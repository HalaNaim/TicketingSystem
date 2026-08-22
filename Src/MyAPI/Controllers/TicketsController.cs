using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyAPI.Models;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TicketsController(AppDbContext context)
        {
            _context = context;
        }

        // GET /tickets
        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.Category)
                .Include(t => t.Priority)
                .Include(t => t.Status)
                .Include(t => t.User)
                .Include(t => t.Agent)
                .Select(t => new {
                    Id = t.Id,
                    Subject = t.Subject,
                    Description = t.Description,
                    CreatedDate = t.CreatedDate,
                    UpdatedDate = t.UpdatedDate,
                    AgentId = t.AgentId,
                    AgentName = t.Agent.Name,   
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category.CategoryName,
                    PriorityId = t.PriorityId,
                    PriorityName = t.Priority.PriorityName,
                    StatusId = t.StatusId,
                    StatusName = t.Status.StatusName
                })
                .ToListAsync();

            return Ok(tickets);
        }

        // GET /tickets/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicket(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Category)
                .Include(t => t.Priority)
                .Include(t => t.Status)
                .Include(t => t.User)
                .Include(t => t.Agent)
                .Select(t => new {
                    Id = t.Id,
                    Subject = t.Subject,
                    Description = t.Description,
                    CreatedDate = t.CreatedDate,
                    UpdatedDate = t.UpdatedDate,
                    AgentId = t.AgentId,
                    AgentName = t.Agent.Name,
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category.CategoryName,
                    PriorityId = t.PriorityId,
                    PriorityName = t.Priority.PriorityName,
                    StatusId = t.StatusId,
                    StatusName = t.Status.StatusName
                })
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null) return NotFound();
            return Ok(ticket);
        }

        // POST /tickets
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] Ticket ticket)
        {
            ticket.CreatedDate = DateTime.Now;
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, ticket);
        }

        // PUT /tickets/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] Ticket ticket)
        {
            var existing = await _context.Tickets.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Subject = ticket.Subject;
            existing.Description = ticket.Description;
            existing.UpdatedDate = DateTime.Now;
            existing.CategoryId = ticket.CategoryId;
            existing.PriorityId = ticket.PriorityId;
            existing.StatusId = ticket.StatusId;
            existing.AgentId = ticket.AgentId;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE /tickets/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return NotFound();

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
