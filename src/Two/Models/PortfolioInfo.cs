namespace Two.Models;

public record PortfolioInfo
{
    public string Client { get; set; } = string.Empty;
    public string ClientUrl { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public List<PortfolioAuthenticationInfo> PortfolioAuthentications { get; set; } = new List<PortfolioAuthenticationInfo>();
    public List<string> Stacks { get; set; } = new List<string>();
    public string Url { get; set; } = string.Empty;
    public int Year { get; set; }

    public PortfolioInfo() { }

    public PortfolioInfo(string client, string clientUrl, string imageUrl, string name, string url, int year, List<string> stacks)
    {
        Client = client;
        ClientUrl = clientUrl;
        ImageUrl = imageUrl;
        Name = name;
        Stacks = stacks;
        Url = url;
        Year = year;
    }
}

public record PortfolioAuthenticationInfo
{
    public string Password { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;

    public PortfolioAuthenticationInfo(string username, string password) {
        Password = password;
        Username = username;
    }
}