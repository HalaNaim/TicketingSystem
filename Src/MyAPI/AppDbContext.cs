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
        public DbSet<Category> Categories { get; set; }
        public DbSet<TicketAttachment> TicketAttachments { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict); // or DeleteBehavior.NoAction

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Agent)
                .WithMany()
                .HasForeignKey(t => t.AgentId)
                .OnDelete(DeleteBehavior.Restrict); // or DeleteBehavior.NoAction
        }
        public DbSet<TicketComment> TicketComments { get; set; }


    }

}
