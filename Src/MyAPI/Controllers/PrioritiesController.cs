using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyAPI.Models;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PrioritiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PrioritiesController(AppDbContext context)
        {
            _context = context;
        }

        // GET /priorities
        [HttpGet]
        public async Task<IActionResult> GetPriorities()
        {
            var priorities = await _context.Priorities.ToListAsync();
            return Ok(priorities);
        }

        // POST /priorities
        [HttpPost]
        public async Task<IActionResult> CreatePriority([FromBody] Priority priority)
        {
            _context.Priorities.Add(priority);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPriorities), new { id = priority.Id }, priority);
        }
    }
}
