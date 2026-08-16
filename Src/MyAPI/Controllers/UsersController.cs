using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAPI.Models; // for User
using Microsoft.EntityFrameworkCore;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // Registration endpoint (open to everyone)
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            // Check if email already exists
            var existingUser = _context.Users.SingleOrDefault(u => u.Email == dto.Email);
            if (existingUser != null)
            {
                return BadRequest("User already exists");
            }

            // Default role = Employee (RoleId = 3) if none provided
            var newUser = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.Password, // ⚠️ hash before saving in real apps
                RoleId = dto.RoleId == 0 ? 3 : dto.RoleId
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok($"User {newUser.Email} registered successfully!");
        }

        // Admin-only endpoint to create users with chosen role
        [Authorize(Roles = "Admin")]
        [HttpPost("create-user")]
        public IActionResult CreateUser([FromBody] RegisterDto dto)
        {
            var existingUser = _context.Users.SingleOrDefault(u => u.Email == dto.Email);
            if (existingUser != null)
            {
                return BadRequest("User already exists");
            }

            var newUser = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.Password,
                RoleId = dto.RoleId
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok($"User {newUser.Email} created successfully by Admin!");
        }

        // Managers and Agents can view tickets
        [Authorize(Roles = "Manager,Agent")]
        [HttpGet("tickets")]
        public IActionResult GetTickets()
        {
            // TODO: implement ticket retrieval logic
            return Ok("Tickets list for Manager/Agent");
        }

        // Employees can view their own tickets
        [Authorize(Roles = "Employee")]
        [HttpGet("my-tickets")]
        public IActionResult GetMyTickets()
        {
            // TODO: implement employee ticket logic
            return Ok("Tickets list for Employee");
        }
    }

    // DTOs
    public class RegisterDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; } // optional, defaults to Employee
    }
}
