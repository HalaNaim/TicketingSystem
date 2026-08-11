namespace MyAPI.Models
{
    public class Ticket
    {
        public int Id { get; set; }          // PK
        public string Subject { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public int UserId { get; set; }
        public int AgentId { get; set; }
        public int CategoryId { get; set; }
        public int PriorityId { get; set; }
        public int StatusId { get; set; }

        public User User { get; set; }
        public User Agent { get; set; }
        public Category Category { get; set; }
        public Priority Priority { get; set; }
        public Status Status { get; set; }
    }

}
