using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using SecretStoreHys.Api.Models;
using SecretStoreHys.Api.Services;

namespace SecretStoreHys.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SecretController(ISecretService secretService, ILogger<SecretController> logger)
    : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateSecretAsync([FromBody] CreateSecretRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Content))
                return BadRequest("Content is required");

            if (string.IsNullOrWhiteSpace(request.PublicPin))
                return BadRequest("Public pin is required");

            var secret = await secretService.CreateSecretAsync(request.Content,
                request.ExpirationDate, request.PublicPin, CancellationToken.None);
            return Ok(secret.Id.ToString("N"));
        }
        catch (InvalidOperationException ioe)
        {
            logger.LogWarning(ioe, "An error occurred while creating the secret");
            return BadRequest("Expiration date is in the past");
        }
        catch (Exception e)
        {
            logger.LogError(e, "An error occurred while creating the secret");
            return StatusCode(500, "An error occurred while creating the secret");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSecretAsync(string id, [FromQuery] string pin,
        CancellationToken cancellationToken)
    {
        try
        {
            var secretId = Guid.Parse(id);

            var secretContent = await secretService.GetSecretAsync(secretId, pin, cancellationToken);
            return Ok(new { secret = secretContent });
        }
        catch (FileNotFoundException)
        {
            logger.LogWarning("Secret not found");
            return NotFound("Secret not found");
        }
        catch (InvalidOperationException ioe)
        {
            logger.LogWarning(ioe, "An error occurred while retrieving the secret");
            return BadRequest("Secret expired");
        }
        catch (FormatException fe)
        {
            logger.LogWarning(fe, "Invalid secret id");
            return BadRequest("Invalid secret id");
        }
        catch (CryptographicException ce)
        {
            logger.LogWarning(ce, "An error occurred while decrypting the secret");
            return BadRequest("Invalid pin");
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "An error occurred while retrieving the secret");
            return StatusCode(500, "An error occurred while retrieving the secret");
        }
    }
}