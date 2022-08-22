using Microsoft.EntityFrameworkCore;
using Two.Data;

public class AppUtility
{
    public static async Task EnsureDbCreatedAndSeedWithCountOfAsync(DbContextOptions<AppDbContext> options, int count)
    {
        var factory = new LoggerFactory();
        var builder = new DbContextOptionsBuilder<AppDbContext>(options).UseLoggerFactory(factory);

        using var context = new AppDbContext(builder.Options);

        await context.Database.MigrateAsync();
    }
}