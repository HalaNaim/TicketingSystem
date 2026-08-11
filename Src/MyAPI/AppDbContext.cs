using Microsoft.EntityFrameworkCore;
using MyAPI.Models;
using System.Collections.Generic;
using System.Data;
using System.Net.Sockets;


namespace MyAPI
{

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<Priority> Priorities { get; set; }
    }

}
