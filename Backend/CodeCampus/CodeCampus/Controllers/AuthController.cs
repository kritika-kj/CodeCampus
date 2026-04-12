<<<<<<< HEAD
﻿using CodeCampus.Models;
using CodeCampus.Data;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
=======
﻿//using CodeCampus.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
>>>>>>> d2f8a62f9794f42146d7dd76e975dbf574532772

namespace CodeCampus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
<<<<<<< HEAD
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

            return Ok(new { message = "Login successful", role = user.Role });
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
=======
        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // TEMPORARY: Hardcoded logic to test the React connection
            // Later, this will search your SQL database!

            if (request.Email == "admin@codecampus.com" && request.Password == "admin123")
            {
                return Ok(new { message = "Login successful", role = "Admin" });
            }
            if (request.Email == "mod@codecampus.com" && request.Password == "mod123")
            {
                return Ok(new { message = "Login successful", role = "Moderator" });
            }
            if (request.Email == "contestant@example.com" && request.Password == "password")
            {
                return Ok(new { message = "Login successful", role = "Contestant" });
            }

            // If no match is found, kick them out
            return Unauthorized(new { message = "Invalid email or password." });
>>>>>>> d2f8a62f9794f42146d7dd76e975dbf574532772
        }
    }
}

