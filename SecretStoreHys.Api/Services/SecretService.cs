using System.Text.Json;
using SecretStoreHys.Api.Models;

namespace SecretStoreHys.Api.Services;

/// <summary>
/// Service for managing secrets.
/// </summary>
public class SecretService : ISecretService
{
    private const string SECRET_FOLDER = "Secrets";

    private readonly string _secretsFolder = Path.Combine(Directory.GetCurrentDirectory(), SECRET_FOLDER);

    /// <summary>
    /// Creates a new secret.
    /// </summary>
    /// <param name="content">The content of the secret.</param>
    /// <param name="expirationDate">The expiration date of the secret.</param>
    /// <param name="publicPin">The public pin of the secret.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The created secret.</returns>
    public async Task<SecretModel> CreateSecretAsync(string content, DateTimeOffset expirationDate,
        string publicPin, CancellationToken cancellationToken)
    {
        var secretContent = await SecretHelper.EncryptAsync(content, publicPin, cancellationToken);
        var secret = new SecretModel(Convert.ToBase64String(secretContent));

        if (!Directory.Exists(_secretsFolder))
            Directory.CreateDirectory(_secretsFolder);

        var uixTimeMilliseconds = expirationDate.ToUnixTimeMilliseconds();

        if (SecretModel.IsExpired(uixTimeMilliseconds))
            throw new InvalidOperationException("Expiration date is in the past");

        var secretName = $"{secret.Id:N}-{expirationDate.ToUnixTimeMilliseconds()}.secret";

        var secretPath = Path.Combine(_secretsFolder, secretName);
        await File.WriteAllTextAsync(secretPath, JsonSerializer.Serialize(secret), cancellationToken);
        return secret;
    }

    /// <summary>
    /// Retrieves a secret.
    /// </summary>
    /// <param name="id">The id of the secret.</param>
    /// <param name="pin">The pin of the secret.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The content and description of the secret.</returns>
    public async Task<string> GetSecretAsync(Guid id, string pin,
        CancellationToken cancellationToken)
    {
        var secretPath = Directory.GetFiles(_secretsFolder, "*.secret")
            .SingleOrDefault(f => f.Contains(id.ToString("N")));

        if (!File.Exists(secretPath) || string.IsNullOrWhiteSpace(secretPath))
            throw new FileNotFoundException("Secret not found");

        var expirationDate = GetSecretIdAndExpDate(secretPath);

        if (SecretModel.IsExpired(expirationDate))
        {
            File.Delete(secretPath);
            throw new InvalidOperationException("Secret expired");
        }

        var secretJson = await File.ReadAllTextAsync(secretPath, cancellationToken);
        var secret = JsonSerializer.Deserialize<SecretModel>(secretJson);

        if (secret == null)
        {
            File.Delete(secretPath);
            throw new InvalidOperationException("Secret expired");
        }

        var secretContent = Convert.FromBase64String(secret.Content);
        var content = await SecretHelper.DecryptAsync(secretContent, pin, cancellationToken);

        File.Delete(secretPath);

        return content;
    }

    /// <summary>
    /// Cleans up expired secrets.
    /// </summary>
    public void CleanExpiredSecrets()
    {
        if (!Directory.Exists(_secretsFolder))
            return;

        var secretFiles = Directory.GetFiles(_secretsFolder, "*.secret");

        foreach (var secretFile in secretFiles)
        {
            var expirationDate = GetSecretIdAndExpDate(secretFile);

            if (SecretModel.IsExpired(expirationDate))
                File.Delete(secretFile);
        }
    }

    /// <summary>
    /// Retrieves the secret id and expiration date from the secret path.
    /// </summary>
    /// <param name="secretPath">The path of the secret.</param>
    /// <returns>The expiration date of the secret.</returns>
    private static long GetSecretIdAndExpDate(string secretPath)
    {
        var data = Path.GetFileNameWithoutExtension(secretPath).Split('-');
        return Int64.Parse(data[1]);
    }
}