namespace Two.Models;

public record ExperienceInfo
{
    public string ImageUrl { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;

    public ExperienceInfo() { }

    public ExperienceInfo(string name, string url)
    {
        Name = name;
        Url = url;
    }

    public ExperienceInfo(string imageUrl, string name, string url)
    {
        ImageUrl = imageUrl;
        Name = name;
        Url = url;
    }
}