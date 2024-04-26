using SecretStoreHys.Api.Services;

namespace SecretStoreHys.Api;

public class SecretsCleanerJob(
    ISecretService secretService,
    ILogger<SecretsCleanerJob> logger,
    IConfiguration configuration)
    : BackgroundService
{
    private const int DefaultCleanupIntervalSeconds = 40;

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.Run(async () =>
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    secretService.CleanExpiredSecrets();
                    await Task.Delay(GetCleanupInterval(), stoppingToken);
                }
                catch (Exception e)
                {
                    logger.LogError(e, "An error occurred while cleaning secrets");
                }
            }
        }, stoppingToken);
    }

    private TimeSpan GetCleanupInterval()
    {
        var interval = configuration.GetValue<int>("SecretsCleanupIntervalInSeconds");
        return interval > 0 ? TimeSpan.FromSeconds(interval) : TimeSpan.FromSeconds(DefaultCleanupIntervalSeconds);
    }
}