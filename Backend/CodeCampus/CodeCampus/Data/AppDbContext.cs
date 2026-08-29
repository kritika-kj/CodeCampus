using CodeCampus.Models; 

using Microsoft.EntityFrameworkCore;

namespace CodeCampus.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Challenges> Challenges { get; set; }
        public DbSet<Contest> Contests { get; set; }
        public DbSet<Submission> Submissions { get; set; }
    }
}