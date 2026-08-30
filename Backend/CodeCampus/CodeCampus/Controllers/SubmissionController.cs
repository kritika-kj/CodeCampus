using CodeCampus.Data;
using CodeCampus.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration; // Added for reading appsettings.json
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CodeCampus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration; // Added to access RapidAPI keys
        private readonly IWebHostEnvironment _env;

        // Static HttpClient to prevent socket exhaustion
        private static readonly HttpClient _httpClient = new HttpClient();

        public SubmissionController(AppDbContext context, IConfiguration configuration, IWebHostEnvironment env)
        {
            _context = context;
            _configuration = configuration;
            _env = env;
        }

        [HttpPost("run")]
        public async Task<IActionResult> RunCode([FromBody] CodeRequest request)
        {
            // 1. Fetch only VISIBLE test cases for the "Run" button
            var testCases = await _context.TestCases
                .Where(t => t.ChallengeId == request.ChallengeId && t.IsHidden == false)
                .OrderBy(t => t.Id)
                .ToListAsync();

            if (!testCases.Any()) return NotFound(new { status = "Error", feedback = "No test cases found." });

            // 2. Construct the input stream (Count \n Input1 \n Input2)
            var inputBuilder = new StringBuilder();
            inputBuilder.AppendLine(testCases.Count.ToString());
            foreach (var tc in testCases)
            {
                inputBuilder.AppendLine(tc.InputData);
            }
            string finalInput = inputBuilder.ToString();

            try
            {
                int judge0LangId = request.Language.ToLower() switch
                {
                    "csharp" => 51,
                    "java" => 62,
                    "python" => 71,
                    _ => 51
                };

                var apiPayload = new
                {
                    source_code = request.SourceCode,
                    language_id = judge0LangId,
                    stdin = finalInput // Inject the dynamically built input here
                };

                string jsonPayload = JsonSerializer.Serialize(apiPayload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await _httpClient.PostAsync("http://localhost:2358/submissions?wait=true&base64_encoded=false", content);

                if (!response.IsSuccessStatusCode)
                {
                    string engineError = await response.Content.ReadAsStringAsync();
                    return StatusCode(500, new { status = "Error", feedback = $"Execution Engine Error: {engineError}" });
                }

                string apiResponseString = await response.Content.ReadAsStringAsync();
                using JsonDocument doc = JsonDocument.Parse(apiResponseString);
                var root = doc.RootElement;

                string actualOutput = root.TryGetProperty("stdout", out var stdoutProp) && stdoutProp.ValueKind != JsonValueKind.Null ? stdoutProp.GetString()?.Trim() ?? "" : "";
                string errorOutput = root.TryGetProperty("stderr", out var stderrProp) && stderrProp.ValueKind != JsonValueKind.Null ? stderrProp.GetString()?.Trim() ?? "" : "";
                string compileError = root.TryGetProperty("compile_output", out var compileProp) && compileProp.ValueKind != JsonValueKind.Null ? compileProp.GetString()?.Trim() ?? "" : "";

                string fullError = string.IsNullOrEmpty(errorOutput) ? compileError : errorOutput;

                if (!string.IsNullOrEmpty(fullError))
                {
                    return Ok(new { status = "Error", feedback = $"⚠️ Code Error:\n{fullError}" });
                }

                // 3. Split Judge0 output and grade line-by-line
                string[] userOutputLines = actualOutput.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

                var evaluation = new EvaluationResponse
                {
                    TotalTests = testCases.Count,
                    PassedTests = 0
                };

                for (int i = 0; i < testCases.Count; i++)
                {
                    bool isPass = false;

                    // Prevent crash if user printed fewer lines than expected
                    if (i < userOutputLines.Length)
                    {
                        string expected = testCases[i].ExpectedOutput.Trim();
                        string actual = userOutputLines[i].Trim();
                        if (expected == actual) isPass = true;
                    }

                    if (isPass) evaluation.PassedTests++;

                    evaluation.TestResults.Add(new TestResultDto
                    {
                        TestNumber = i + 1,
                        Passed = isPass
                    });
                }

                evaluation.Status = (evaluation.PassedTests == evaluation.TotalTests) ? "Passed" : "Failed";
                evaluation.ScorePercentage = evaluation.TotalTests == 0
                    ? 0
                    : (int)Math.Round((double)evaluation.PassedTests / evaluation.TotalTests * 100);

                return Ok(evaluation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "Error", feedback = $"Internal Server Error: {ex.Message}" });
            }
        }
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitCode([FromBody] SubmitRequest request)
        {
            var newSubmission = new Submission
            {
                UserId = request.UserId,
                ChallengeId = request.ChallengeId,
                ContestId = request.ContestId,
                SourceCode = request.SourceCode,
                Language = request.Language,
                CreatedAt = DateTime.UtcNow
            };

            // 1. Fetch ALL test cases (visible + hidden) for rigorous grading
            var testCases = await _context.TestCases
                .Where(t => t.ChallengeId == request.ChallengeId)
                .OrderBy(t => t.Id)
                .ToListAsync();

            if (!testCases.Any()) return NotFound("No test cases found.");

            var inputBuilder = new StringBuilder();
            inputBuilder.AppendLine(testCases.Count.ToString());
            foreach (var tc in testCases)
            {
                inputBuilder.AppendLine(tc.InputData);
            }
            string finalInput = inputBuilder.ToString();

            try
            {
                int judge0LangId = newSubmission.Language.ToLower() switch
                {
                    "csharp" => 51,
                    "java" => 62,
                    "python" => 71,
                    _ => 51
                };

                var apiPayload = new
                {
                    source_code = newSubmission.SourceCode,
                    language_id = judge0LangId,
                    stdin = finalInput
                };

                string jsonPayload = JsonSerializer.Serialize(apiPayload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("http://localhost:2358/submissions?wait=true&base64_encoded=false", content);

                if (!response.IsSuccessStatusCode)
                {
                    newSubmission.Status = "Error";
                    newSubmission.Feedback = "Execution Engine Error.";
                }
                else
                {
                    string apiResponseString = await response.Content.ReadAsStringAsync();
                    using JsonDocument doc = JsonDocument.Parse(apiResponseString);
                    var root = doc.RootElement;

                    string actualOutput = root.TryGetProperty("stdout", out var stdoutProp) && stdoutProp.ValueKind != JsonValueKind.Null ? stdoutProp.GetString()?.Trim() ?? "" : "";
                    string errorOutput = root.TryGetProperty("stderr", out var stderrProp) && stderrProp.ValueKind != JsonValueKind.Null ? stderrProp.GetString()?.Trim() ?? "" : "";
                    string compileError = root.TryGetProperty("compile_output", out var compileProp) && compileProp.ValueKind != JsonValueKind.Null ? compileProp.GetString()?.Trim() ?? "" : "";

                    string fullError = string.IsNullOrEmpty(errorOutput) ? compileError : errorOutput;

                    if (!string.IsNullOrEmpty(fullError))
                    {
                        newSubmission.Status = "Failed";
                        newSubmission.Feedback = $"⚠️ Code Error:\n{fullError}";
                    }
                    else
                    {
                        // 3. Grade all test cases
                        string[] userOutputLines = actualOutput.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                        int passedCount = 0;

                        for (int i = 0; i < testCases.Count; i++)
                        {
                            if (i < userOutputLines.Length)
                            {
                                if (testCases[i].ExpectedOutput.Trim() == userOutputLines[i].Trim())
                                {
                                    passedCount++;
                                }
                            }
                        }

                        int totalTests = testCases.Count;
                        int percentage = totalTests == 0 ? 0 : (int)Math.Round((double)passedCount / totalTests * 100);
                        var challenge = await _context.Challenges.FindAsync(request.ChallengeId);
                        int challengePoints = challenge?.Points ?? 0;
                        int awardedPoints = totalTests == 0
                            ? 0
                            : (passedCount == totalTests ? challengePoints : (int)Math.Round((double)passedCount / totalTests * challengePoints));

                        if (passedCount == totalTests)
                        {
                            newSubmission.Status = "Passed";
                            newSubmission.Feedback = $"✅ Success! All {totalTests} test cases passed. Awarded {challengePoints} points.";
                        }
                        else
                        {
                            newSubmission.Status = "Failed";
                            newSubmission.Feedback = $"❌ Failed. Passed {passedCount} out of {totalTests} test cases ({percentage}%). Partial credit: {awardedPoints} points.";
                        }

                        _context.Submissions.Add(newSubmission);
                        await _context.SaveChangesAsync();

                        return Ok(new
                        {
                            message = "Submission graded and saved successfully!",
                            submissionId = newSubmission.Id,
                            status = newSubmission.Status,
                            passedTests = passedCount,
                            totalTests = totalTests,
                            scorePercentage = percentage,
                            awardedPoints = awardedPoints,
                            challengePoints = challengePoints
                        });
                    }
                }

                return Ok(new { message = "Submission graded and saved successfully!", submissionId = newSubmission.Id, status = newSubmission.Status });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Database error saving submission.", details = ex.Message });
            }
        }
    }

    public class CodeRequest
    {
        public int ChallengeId { get; set; }
        public string SourceCode { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
    }
    public class SubmitRequest
    {
        public int UserId { get; set; }
        public int ChallengeId { get; set; }
        public int ContestId { get; set; }
        public string SourceCode { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
    }
    public class EvaluationResponse
    {
        public string Status { get; set; }
        public int TotalTests { get; set; }
        public int PassedTests { get; set; }
        public int ScorePercentage { get; set; }
        public int AwardedPoints { get; set; }
        public List<TestResultDto> TestResults { get; set; } = new List<TestResultDto>();
    }

    public class TestResultDto
    {
        public int TestNumber { get; set; }
        public bool Passed { get; set; }
    }
}