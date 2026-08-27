using CodeCampus.Data;
using CodeCampus.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
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
            // 1. Capture the exact moment you clicked launch
            DateTime now = DateTime.UtcNow;

            // 2. Automatically generate the start and end times
            newContest.StartTime = now;
            newContest.EndTime = now.AddMinutes(newContest.DurationInMinutes);

            // Ensure these defaults are set securely on the backend
            newContest.CreatedAt = now;
            newContest.IsActive = true;

            // 3. Save to the database
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetContestById(int id)
        {
            var contest = await _context.Contests.FindAsync(id);

            if (contest == null)
            {
                return NotFound("Contest not found.");
            }

            return Ok(contest);
        }
    }
}