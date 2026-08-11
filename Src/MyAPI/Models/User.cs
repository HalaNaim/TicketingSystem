using System.Data;

namespace MyAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }       // matches Users.Name
        public string Email { get; set; }      // matches Users.Email
        public string Password { get; set; }   // matches Users.Password
        public int RoleId { get; set; }        // FK to Roles.Id

        // Navigation property
        public Role Role { get; set; }         // gives you RoleName like "Admin", "Manager", etc.
    }



}
