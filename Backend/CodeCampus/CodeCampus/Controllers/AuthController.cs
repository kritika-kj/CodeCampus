using BCrypt.Net;
using CodeCampus.Data;
using CodeCampus.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CodeCampus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] Models.LoginRequest request)
        {

            var standardizedEmail = request.Email.ToLower().Trim();


            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == standardizedEmail);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }
            var token = GenerateJwtToken(user);

            return Ok(new { message = "Login successful", token = token, role = user.Role });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Models.RegisterRequest request)
        {
            var standardizedEmail = request.Email.ToLower().Trim();

            if (await _context.Users.AnyAsync(u => u.Email == standardizedEmail))
            {
                return BadRequest(new { message = "Email is already in use." });
            }

            var newUser = new User
            {
                Name = request.Name.Trim(),
                Email = standardizedEmail,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Contestant"
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful", role = newUser.Role });
        }
        private static string GenerateJwtToken(User user)
        {
            // 1. Get the secret key from appsettings
            var jwtKey = "ThisIsMySuperSecretCodeCampusKeyThatIsLongEnoughToWork12345!"; // Match your appsettings exact string
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 2. Put the user's specific data ON the badge
            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, user.Email),
        new Claim("role", user.Role), // We bake their role right into the token!
        new Claim("userId", user.Id.ToString())
    };

            // 3. Print the token (expires in 2 hours)
            var token = new JwtSecurityToken(
                issuer: "CodeCampusAPI",
                audience: "CodeCampusReactApp",
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

