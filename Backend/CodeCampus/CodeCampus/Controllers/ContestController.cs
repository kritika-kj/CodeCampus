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
            DateTime now = DateTime.UtcNow;
            newContest.StartTime = now;
            newContest.EndTime = now.AddMinutes(newContest.DurationInMinutes);

            newContest.CreatedAt = now;
            newContest.IsActive = true;

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
        // GET: api/contest/{id}/leaderboard
        [HttpGet("{id}/leaderboard")]
        public async Task<IActionResult> GetLeaderboard(int id)
        {
            var leaderboard = await _context.Submissions
                .Where(s => s.ContestId == id && s.Status == "Passed")
                .GroupBy(s => s.UserId)
                .Select(g => new
                {
                    UserId = g.Key,
                    // Awards 10 points per passed challenge
                    TotalScore = g.Count() * 10,
                    ProblemsSolved = g.Count()
                })
                .OrderByDescending(l => l.TotalScore)
                .ToListAsync();

            return Ok(leaderboard);
        }
    }
}