namespace MyAPI.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string RoleName { get; set; }   // "Admin", "Manager", "Agent", "Employee"

        public ICollection<User> Users { get; set; }
    }



}
