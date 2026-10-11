namespace MyAPI.DTOs
{
    public class TicketDto
    {
        public string Subject { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }   // creator (must be Admin or Employee)
        public int? AgentId { get; set; }  // assigned agent
        public int CategoryId { get; set; }
        public int PriorityId { get; set; }
        public int StatusId { get; set; }
    }
}
