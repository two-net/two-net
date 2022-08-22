namespace Two.Models;

public record TableBase
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
}