using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyAPI.DTOs; // for LoginRequest
using MyAPI.Models; // for User, Role
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;


namespace MyAPI.Controllers
{
  
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)   // 👈 add [FromBody] here
        {
            var user = _context.Users
                .Include(u => u.Role)
                .SingleOrDefault(u => u.Email == request.Email);

            if (user == null) return Unauthorized();

            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Role, user.Role.RoleName)
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: creds);

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }


        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = _context.Users.SingleOrDefault(u => u.Email == request.Email);
            if (user == null) return BadRequest("User not found");

            // Generate secure token
            var resetToken = Guid.NewGuid().ToString();
            user.PasswordResetToken = resetToken;
            user.PasswordResetExpiry = DateTime.Now.AddHours(24);
            _context.SaveChanges();

            var resetLink = $"https://localhost:7184/Auth/reset-password?token={resetToken}";
            // TODO: send resetLink via email using SMTP or a mail service

            return Ok("Reset link sent to email");
        }



        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = _context.Users.SingleOrDefault(u => u.PasswordResetToken == dto.Token
                                                           && u.PasswordResetExpiry > DateTime.Now);
            if (user == null) return BadRequest("Invalid or expired token");

            user.Password = dto.NewPassword; // ⚠️ hash before saving
            user.PasswordResetToken = null;
            user.PasswordResetExpiry = null;

            _context.SaveChanges();
            return Ok("Password reset successful");
        }

        public class ResetPasswordDto
        {
            public string Token { get; set; }
            public string NewPassword { get; set; }
        }


    }

}
