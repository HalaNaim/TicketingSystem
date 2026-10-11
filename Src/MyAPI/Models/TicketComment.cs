namespace MyAPI.Models
{
    public class TicketComment
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }

        // Navigation properties
        public Ticket Ticket { get; set; }
        public User User { get; set; }
    }
}
