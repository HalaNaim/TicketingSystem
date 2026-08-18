using System.ComponentModel.DataAnnotations;

namespace MyAPI.Models
{
    public class Priority
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string PriorityName { get; set; }
    }
}
