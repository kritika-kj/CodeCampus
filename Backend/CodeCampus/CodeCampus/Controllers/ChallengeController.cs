using CodeCampus.Data;
using CodeCampus.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CodeCampus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChallengeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChallengeController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/challenge/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateChallenge([FromBody] Challenges newChallenge)
        {
            // 1. Add it to the tracking system
            _context.Challenges.Add(newChallenge);

            // 2. Save it permanently to the SQL database
            await _context.SaveChangesAsync();

            // 3. Send a success message back to React
            return Ok(new { message = "Challenge published successfully!", id = newChallenge.Id });
        }
        // GET: api/challenge
        [HttpGet]
        public async Task<IActionResult> GetAllChallenges()
        {
            // Fetch all challenges, newest first!
            var challenges = await _context.Challenges
                                           .OrderByDescending(c => c.CreatedAt)
                                           .ToListAsync();

            return Ok(challenges);
        }
    }
}