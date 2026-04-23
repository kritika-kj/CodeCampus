using CodeCampus.Data;
using CodeCampus.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CodeCampus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContestController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/contest/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateContest([FromBody] Contest newContest)
        {
            _context.Contests.Add(newContest);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Contest started successfully!", id = newContest.Id });
        }

        // GET: api/contest/active
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveContests()
        {
            var contests = await _context.Contests
                                         .Where(c => c.IsActive)
                                         .OrderByDescending(c => c.CreatedAt)
                                         .ToListAsync();
            return Ok(contests);
        }
    }
}