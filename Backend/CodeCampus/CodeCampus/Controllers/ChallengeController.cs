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
        public async Task<IActionResult> CreateChallenge([FromBody] CreateChallengeRequest request)
        {
            var newChallenge = new Challenges
            {
                Title = request.Title,
                Description = request.Description,
                Difficulty = request.Difficulty,
                Points = request.Points,
                InputFormat = request.InputFormat,
                OutputFormat = request.OutputFormat,
                Constraints = request.Constraints,

                // Map the DTOs to your actual SQL entities
                TestCases = request.TestCases.Select(tc => new TestCase
                {
                    InputData = tc.InputData,
                    ExpectedOutput = tc.ExpectedOutput,
                    IsHidden = tc.IsHidden
                }).ToList()
            };

            _context.Challenges.Add(newChallenge);
            await _context.SaveChangesAsync(); // Saves everything in one database transaction!

            return Ok(new { message = "Challenge and Test Cases saved successfully!" });
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

        // --- ADDED THIS NEW ENDPOINT ---
        // GET: api/challenge/5
        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetChallenge(int id)
        //{
        //    // 1. Find the specific challenge by its ID in the database
        //    var challenge = await _context.Challenges.FindAsync(id);

        //    // 2. If it doesn't exist, tell React it's missing
        //    if (challenge == null)
        //    {
        //        return NotFound();
        //    }

        //    // 3. If found, send the data over to the Monaco Editor!
        //    return Ok(challenge);
        //}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChallengeById(int id)
        {
            // Fetch the challenge and ONLY the visible test cases
            var challenge = await _context.Challenges
                .Include(c => c.TestCases.Where(tc => tc.IsHidden == false))
                .FirstOrDefaultAsync(c => c.Id == id);

            if (challenge == null) return NotFound("Challenge not found.");

            return Ok(challenge);
        }
        public class CreateChallengeRequest
        {
            public string Title { get; set; }
            public string Description { get; set; }
            public string Difficulty { get; set; }
            public int Points { get; set; }
            public string InputFormat { get; set; }
            public string OutputFormat { get; set; }
            public string Constraints { get; set; }

            // The incoming array from React
            public List<TestCaseDto> TestCases { get; set; } = new List<TestCaseDto>();
        }

        public class TestCaseDto
        {
            public string InputData { get; set; }
            public string ExpectedOutput { get; set; }
            public bool IsHidden { get; set; }
        }
    }
}