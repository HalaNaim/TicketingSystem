namespace MyAPI.Models
{
    public class TicketAttachment
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadedDate { get; set; }

        public Ticket Ticket { get; set; }  // navigation property
    }

}
