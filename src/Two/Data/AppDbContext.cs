#nullable disable

using Microsoft.EntityFrameworkCore;
using Two.Models;

namespace Two.Data;

public class AppDbContext : DbContext
{
    public DbSet<ContactInfo> Contacts { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}