using CodeCampus.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CodeCampus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        //public IActionResult Index()
        //{
        //    return View();
        //}
        private readonly AppDbContext _context;
        public AdminController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Role
            })
                .Where(u => u.Role!="Admin")
                .ToListAsync();
            return Ok(users);
        }

        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] string newRole)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new {message = "user not found"});
            }
            if (newRole != "Contestant" && newRole != "Moderator")
            {
                return BadRequest(new { message = "Invalid role provided." });
            }
            user.Role = newRole;
            await _context.SaveChangesAsync();


            return Ok(new {message = "user role updated successfully" });
        }
        [HttpGet("allcontest")]
        public async Task<IActionResult> GetAllContests()
        {
            var allcontests = await _context.Contests
                .Select(c => new
                {
                    c.Id,
                    c.Title,
                    c.StartTime,
                    c.IsActive,
                    StudentCount = _context.Submissions
                     .Where(s => s.ContestId == c.Id)
                    .Select(s => s.UserId)
                    .Distinct()
                    .Count()
                })
                .ToListAsync();
            return Ok(allcontests);
        }
    }
}
