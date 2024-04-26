using SecretStoreHys.Api.Models;

namespace SecretStoreHys.Api.Services;

public interface ISecretService
{
    Task<SecretModel> CreateSecretAsync(string content, DateTimeOffset expirationDate,
        string publicPin, CancellationToken cancellationToken);

    Task<string> GetSecretAsync(Guid id, string pin, CancellationToken cancellationToken);

    void CleanExpiredSecrets();
}