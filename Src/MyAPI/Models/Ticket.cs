using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyAPI.Models
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Subject { get; set; }

        public string Description { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }

        [ForeignKey("Agent")]
        public int AgentId { get; set; }
        public User? Agent { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        [ForeignKey("Priority")]
        public int PriorityId { get; set; }
        public Priority? Priority { get; set; }

        [ForeignKey("Status")]
        public int StatusId { get; set; }
        public Status? Status { get; set; }
    }
}
