using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyAPI.DTOs;
using MyAPI.Models;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public TicketsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
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
                .Include(t => t.Attachments)
                .Select(t => new
                {
                    Id = t.Id,
                    Subject = t.Subject,
                    Description = t.Description,
                    CreatorName = t.User.Name,
                    CreatedDate = t.CreatedDate,
                    UpdatedDate = t.UpdatedDate,
                    AgentId = t.AgentId,
                    AgentName = t.Agent != null ? t.Agent.Name : null,
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category.CategoryName,
                    PriorityId = t.PriorityId,
                    PriorityName = t.Priority.PriorityName,
                    StatusId = t.StatusId,
                    StatusName = t.Status.StatusName,
                    UserId = t.UserId,
                    UserName = t.User.Name,
                    UserRole = t.User.Role.RoleName,
                    Attachments = t.Attachments.Select(a => new
                    {
                        a.Id,
                        a.FilePath,
                        a.UploadedDate
                    })
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
                .Include(t => t.Attachments)
                .Select(t => new
                {
                    Id = t.Id,
                    Subject = t.Subject,
                    Description = t.Description,
                    CreatedDate = t.CreatedDate,
                    UpdatedDate = t.UpdatedDate,
                    AgentId = t.AgentId,
                    AgentName = t.Agent != null ? t.Agent.Name : null, 
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category.CategoryName,
                    PriorityId = t.PriorityId,
                    PriorityName = t.Priority.PriorityName,
                    StatusId = t.StatusId,
                    StatusName = t.Status.StatusName,
                    UserId = t.UserId,
                    UserName = t.User.Name,
                    UserRole = t.User.Role.RoleName,
                    Attachments = t.Attachments.Select(a => new
                    {
                        a.Id,
                        a.FilePath,
                        a.UploadedDate
                    })
                })
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null) return NotFound();
            return Ok(ticket);
        }


        [HttpPut("{id}/assign")]
        public async Task<IActionResult> AssignTicket(int id, int agentId, int managerId)
        {
            var manager = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == managerId);
            if (manager.Role.RoleName != "Manager")
                return Forbid("Only Managers can assign tickets.");

            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return NotFound();

            ticket.AgentId = agentId;
            await _context.SaveChangesAsync();
            return Ok(ticket);
        }



        [HttpGet("assigned/{agentId}")]
        public async Task<IActionResult> GetAssignedTickets(int agentId)
        {
            var agent = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == agentId);
            if (agent.Role.RoleName != "Agent")
                return Forbid("Only Agents can view their assigned tickets.");

            var tickets = await _context.Tickets
                .Where(t => t.AgentId == agentId)
                .ToListAsync();

            return Ok(tickets);
        }


        // POST /tickets
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromForm] TicketDto dto, List<IFormFile>? attachments)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Id == dto.UserId);

                if (user == null)
                    return NotFound("User not found.");

                if (user.Role == null)
                    return BadRequest("User has no role assigned.");

                if (user.Role.RoleName != "Admin" && user.Role.RoleName != "Employee")
                    return Forbid("Only Admins and Employees can create tickets.");
                if (dto == null)
                    return BadRequest("Ticket data is missing.");
                if (string.IsNullOrEmpty(dto.Subject))
                    return BadRequest("Subject is required.");
                if (dto.UserId <= 0)
                    return BadRequest("UserId is invalid.");


                var ticket = new Ticket
                {
                    Subject = dto.Subject,
                    Description = dto.Description,
                    UserId = dto.UserId,
                    AgentId = dto.AgentId, 
                    CategoryId = dto.CategoryId,
                    PriorityId = dto.PriorityId,
                    StatusId = dto.StatusId,
                    CreatedDate = DateTime.Now
                };



                _context.Tickets.Add(ticket);
                await _context.SaveChangesAsync();

                // Attachments...
                if (attachments != null && attachments.Count > 0)
                {
                    var uploadPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
                    if (!Directory.Exists(uploadPath))
                        Directory.CreateDirectory(uploadPath);

                    foreach (var file in attachments)
                    {
                        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                        var filePath = Path.Combine(uploadPath, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        _context.TicketAttachments.Add(new TicketAttachment
                        {
                            TicketId = ticket.Id,
                            FilePath = "/uploads/" + fileName,
                            UploadedDate = DateTime.Now
                        });
                    }

                    await _context.SaveChangesAsync();
                }

                return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, ticket);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }





        // PUT /tickets/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id,[FromForm] TicketDto dto,List<IFormFile>? attachments,string? comment) 
        {
            var existing = await _context.Tickets
                .Include(t => t.Attachments)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (existing == null) return NotFound();

            // Role restrictions
            var user = await _context.Users.Include(u => u.Role)
                                           .FirstOrDefaultAsync(u => u.Id == dto.UserId);
            if (user == null) return NotFound("User not found.");
            if (user.Role == null) return BadRequest("User has no role assigned.");

            if (user.Role.RoleName == "Agent")
                return Forbid("Agents cannot edit tickets.");
            if (user.Role.RoleName == "Manager")
                return Forbid("Managers cannot edit tickets.");
            if (existing.StatusId == 2) // In Progress
                return BadRequest("Ticket cannot be edited while in progress.");

            // Update fields
            existing.Subject = dto.Subject;
            existing.Description = dto.Description;
            existing.UpdatedDate = DateTime.Now;
            existing.CategoryId = dto.CategoryId;
            existing.PriorityId = dto.PriorityId;
            existing.StatusId = dto.StatusId;

            // Validate AgentId
            if (dto.AgentId != null)
            {
                var agent = await _context.Users.FindAsync(dto.AgentId);
                if (agent == null || agent.RoleId != 2)
                    return BadRequest("Assigned user must be an Agent (RoleId = 2).");

                existing.AgentId = dto.AgentId;
            }

            // Handle optional attachments
            if (attachments != null && attachments.Count > 0)
            {
                var uploadPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                foreach (var file in attachments)
                {
                    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    _context.TicketAttachments.Add(new TicketAttachment
                    {
                        TicketId = existing.Id,
                        FilePath = "/uploads/" + fileName,
                        UploadedDate = DateTime.Now
                    });
                }
            }

            // Handle optional comment
            if (!string.IsNullOrEmpty(comment))
            {
                _context.TicketComments.Add(new TicketComment
                {
                    TicketId = existing.Id,
                    UserId = dto.UserId,
                    Content = comment,
                    Timestamp = DateTime.Now
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Ticket updated successfully", ticket = existing });

        }

        // DELETE /tickets/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Attachments)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null) return NotFound();

            // ✅ Safe claim handling
            var idClaim = User.FindFirst("id");
            if (idClaim == null) return Unauthorized("Missing user id claim.");
            if (!int.TryParse(idClaim.Value, out var userId))
                return BadRequest("Invalid user id claim.");

            var user = await _context.Users.Include(u => u.Role)
                                           .FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return Unauthorized("User not found.");
            if (user.Role == null) return BadRequest("User has no role assigned.");

            // ✅ Role restrictions
            if (user.Role.RoleName.Equals("Agent", StringComparison.OrdinalIgnoreCase))
                return Forbid("Agents cannot delete tickets.");
            if (user.Role.RoleName.Equals("Manager", StringComparison.OrdinalIgnoreCase))
                return Forbid("Managers cannot delete tickets.");

            // ✅ Status restriction
            if (ticket.StatusId == 2)
                return BadRequest("Ticket cannot be deleted while in progress.");

            // ✅ Delete ticket
            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Ticket deleted successfully", deletedId = id });
        }

    }
}