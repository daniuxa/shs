namespace SecretStoreHys.Api.Models;

public class CreateSecretRequest
{
    public string? Content { get; set; }
    
    public DateTime ExpirationDate { get; set; }

    public string? PublicPin { get; set; }
}