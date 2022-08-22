using System.ComponentModel.DataAnnotations;

namespace Two.Models;

public record ContactInfo : TableBase
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Message { get; set; } = string.Empty;

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;
}