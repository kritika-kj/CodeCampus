using CodeCampus.Data;
using CodeCampus.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
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
            if (newContest == null) return BadRequest("Invalid contest data.");

            newContest.CreatedAt = DateTime.UtcNow;

            if (newContest.IsActive)
            {
                DateTime now = DateTime.UtcNow;
                newContest.StartTime = now;
                newContest.EndTime = now.AddMinutes(newContest.DurationInMinutes);
            }

            _context.Contests.Add(newContest);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Contest created successfully!", contestId = newContest.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContest(int id, [FromBody] Contest updatedContest)
        {
            var existingContest = await _context.Contests.FindAsync(id);
            if (existingContest == null) return NotFound("Contest not found.");

            existingContest.Title = updatedContest.Title;
            existingContest.ChallengeIds = updatedContest.ChallengeIds;
            existingContest.DurationInMinutes = updatedContest.DurationInMinutes;
            existingContest.IsActive = updatedContest.IsActive;

            if (existingContest.IsActive)
            {
                DateTime now = DateTime.UtcNow;
                existingContest.StartTime = now;
                existingContest.EndTime = now.AddMinutes(existingContest.DurationInMinutes);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Contest updated successfully!" });
        }

        private async Task DeactivateExpiredContests()
        {
            var Now = DateTime.UtcNow;
            await _context.Contests
                .Where(c => c.IsActive && c.EndTime.HasValue && c.EndTime <= Now)
                .ExecuteUpdateAsync(set => set.SetProperty(c => c.IsActive, false));
            
        }

        [HttpPut("{contestId}/close-manually")]
        public async Task<IActionResult> CloseContestManually(int contestId)
        {
            // Forcefully set IsActive to false for this specific ID, ignoring the clock
            var rowsAffected = await _context.Contests
                .Where(c => c.Id == contestId)
                .ExecuteUpdateAsync(set => set.SetProperty(c => c.IsActive, false));

            if (rowsAffected == 0)
            {
                return NotFound(new { message = "Contest not found." });
            }

            return Ok(new { message = "Contest manually ended." });
        }

        // GET: api/contest/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllContests()
        {
            await DeactivateExpiredContests();
            var contests = await _context.Contests
                                         //.Where(c => c.IsActive)
                                         .OrderByDescending(c => c.CreatedAt)
                                         .ToListAsync();
            return Ok(contests);
        }
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveContests()
        {
            await DeactivateExpiredContests();
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
        //[HttpGet("{id}/leaderboard")]
        //public async Task<IActionResult> GetLeaderboard(int id)
        //{
        //    var contestSubmissions = await _context.Submissions
        //        .Where(s => s.ContestId == id)
        //        .OrderBy(s => s.UserId)
        //        .ThenBy(s => s.ChallengeId)
        //        .ThenByDescending(s => s.CreatedAt)
        //        .ToListAsync();

        //    if (!contestSubmissions.Any())
        //    {
        //        return Ok(new List<object>());
        //    }

        //    var userChallengeBestScore = new Dictionary<int, Dictionary<int, int>>();
        //    var userIds = contestSubmissions.Select(s => s.UserId).Distinct().ToList();
        //    var userNames = await _context.Users
        //        .Where(u => userIds.Contains(u.Id))
        //        .Select(u => new { u.Id, u.Name })
        //        .ToDictionaryAsync(u => u.Id, u => u.Name);

        //    foreach (var submission in contestSubmissions)
        //    {
        //        var challenge = await _context.Challenges.FindAsync(submission.ChallengeId);
        //        int challengePoints = challenge?.Points ?? 0;
        //        int earnedPoints = ExtractAwardedPoints(submission.Feedback, challengePoints);

        //        if (!userChallengeBestScore.ContainsKey(submission.UserId))
        //        {
        //            userChallengeBestScore[submission.UserId] = new Dictionary<int, int>();
        //        }

        //        if (!userChallengeBestScore[submission.UserId].ContainsKey(submission.ChallengeId) ||
        //            earnedPoints > userChallengeBestScore[submission.UserId][submission.ChallengeId])
        //        {
        //            userChallengeBestScore[submission.UserId][submission.ChallengeId] = earnedPoints;
        //        }
        //    }

        //    var leaderboard = userChallengeBestScore
        //        .Select(entry =>
        //        {
        //            var userId = entry.Key;
        //            var challengeScores = entry.Value.Values.ToList();
        //            var totalScore = challengeScores.Sum();
        //            var problemsSolved = challengeScores.Count(score => score > 0);
        //            var name = userNames.TryGetValue(userId, out var userName) && !string.IsNullOrWhiteSpace(userName)
        //                ? userName
        //                : $"Student {userId}";

        //            return new
        //            {
        //                UserId = userId,
        //                Name = name,
        //                ProblemsSolved = problemsSolved,
        //                Score = totalScore,
        //                TotalScore = totalScore
        //            };
        //        })
        //        .OrderByDescending(x => x.Score)
        //        .ThenByDescending(x => x.ProblemsSolved)
        //        .ThenBy(x => x.UserId)
        //        .Select((x, index) => new
        //        {
        //            Rank = index + 1,
        //            x.UserId,
        //            x.Name,
        //            x.ProblemsSolved,
        //            x.Score,
        //            x.TotalScore
        //        })
        //        .ToList();

        //    return Ok(leaderboard);
        //}
        [HttpGet("{id}/leaderboard")]
        public async Task<IActionResult> GetLeaderboard(int id)
        {
            // 1. Fetch only the 3 specific columns we need (Super lightweight)
            var contestSubmissions = await _context.Submissions
                .Where(s => s.ContestId == id)
                .Select(s => new { s.UserId, s.ChallengeId, s.AwardedPoints })
                .ToListAsync();

            if (!contestSubmissions.Any())
                return Ok(new List<object>());

            // 2. Fetch User Names in ONE single database query (Fixes the N+1 loop problem)
            var userIds = contestSubmissions.Select(s => s.UserId).Distinct().ToList();
            var userNames = await _context.Users
                .Where(u => userIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => u.Name);

            // 3. Calculate scores in-memory (Blazing fast now that it's just integers)
            var leaderboard = contestSubmissions
                .GroupBy(s => s.UserId)
                .Select(userGroup =>
                {
                    var userId = userGroup.Key;

                    // Find the highest score they got for each specific challenge
                    var bestScoresPerChallenge = userGroup
                        .GroupBy(g => g.ChallengeId)
                        .Select(g => g.Max(sub => sub.AwardedPoints))
                        .ToList();

                    return new
                    {
                        UserId = userId,
                        Name = userNames.TryGetValue(userId, out var name) ? name : $"Student {userId}",
                        ProblemsSolved = bestScoresPerChallenge.Count(score => score > 0),
                        Score = bestScoresPerChallenge.Sum()
                    };
                })
                .OrderByDescending(x => x.Score)
                .ThenByDescending(x => x.ProblemsSolved) // Tie-breaker: Who solved more distinct problems?
                .ThenBy(x => x.UserId) // Final tie-breaker: ID
                .Select((x, index) => new
                {
                    Rank = index + 1,
                    x.UserId,
                    x.Name,
                    x.ProblemsSolved,
                    x.Score,
                    TotalScore = x.Score // Kept to match your existing React props
                })
                .ToList();

            return Ok(leaderboard);
        }

        //private static int ExtractAwardedPoints(string feedback, int challengePoints)
        //{
        //    if (string.IsNullOrWhiteSpace(feedback))
        //    {
        //        return 0;
        //    }

        //    var partialMatch = Regex.Match(feedback, @"Partial credit:\s*(\d+)", RegexOptions.IgnoreCase);
        //    if (partialMatch.Success)
        //    {
        //        return int.TryParse(partialMatch.Groups[1].Value, out var partialPoints) ? partialPoints : 0;
        //    }

        //    var awardedMatch = Regex.Match(feedback, @"Awarded\s+(\d+)\s+points", RegexOptions.IgnoreCase);
        //    if (awardedMatch.Success)
        //    {
        //        return int.TryParse(awardedMatch.Groups[1].Value, out var awardedPoints) ? awardedPoints : 0;
        //    }

        //    if (feedback.Contains("All", StringComparison.OrdinalIgnoreCase) && feedback.Contains("passed", StringComparison.OrdinalIgnoreCase))
        //    {
        //        return challengePoints;
        //    }

        //    return 0;
        //}
        [HttpGet("{id}/viewsubmissions")]
        public async Task<IActionResult> ViewSubmissions(int id)
        {
            var Submission = await _context.Submissions
                .Where(s => s.UserId == id)
                .GroupBy(s => s.ContestId)
                .Select(g => new
                {
                    ContestId = g.Key,
                    ContestTitle = _context.Contests.Where(c => c.Id == g.Key).Select(c => c.Title).FirstOrDefault(),
                    TotalPoints = g.Sum(s => s.AwardedPoints)
                })
                .ToListAsync();


            return Ok(Submission);
        }
    }
}