using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        // Example: only Admin can create users
        [Authorize(Roles = "Admin")]
        [HttpPost("create-user")]
        public IActionResult CreateUser(UserDto dto)
        {
            // TODO: implement user creation logic
            return Ok($"User {dto.Email} created successfully!");
        }

        // Example: Managers and Agents can view tickets
        [Authorize(Roles = "Manager,Agent")]
        [HttpGet("tickets")]
        public IActionResult GetTickets()
        {
            // TODO: implement ticket retrieval logic
            return Ok("Tickets list for Manager/Agent");
        }

        // Example: Employees can view their own tickets
        [Authorize(Roles = "Employee")]
        [HttpGet("my-tickets")]
        public IActionResult GetMyTickets()
        {
            // TODO: implement employee ticket logic
            return Ok("Tickets list for Employee");
        }
    }

    // Simple DTO for demo
    public class UserDto
    {
        public string Email { get; set; }
    }
}
