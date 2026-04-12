//using CodeCampus.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace CodeCampus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
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
        }
    }
}

