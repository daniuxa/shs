namespace SecretStoreHys.Api.Models;

public class SecretModel
{
    public Guid Id { get; private set; }

    public string Content { get; private set; }
    
    public SecretModel(string content)
    {
        Id = Guid.NewGuid();
        Content = content;
    }

    public static bool IsExpired(long milliseconds) 
        => DateTimeOffset.Now.ToUnixTimeMilliseconds() > milliseconds;
}