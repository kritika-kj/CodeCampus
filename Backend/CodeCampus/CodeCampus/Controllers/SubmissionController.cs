using CodeCampus.Data;
using CodeCampus.Models;
using Microsoft.AspNetCore.Mvc;
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
        // Static HttpClient to prevent socket exhaustion
        private static readonly HttpClient _httpClient = new HttpClient();

        public SubmissionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("run")]
        public async Task<IActionResult> RunCode([FromBody] CodeRequest request)
        {
            // 1. Fetch the challenge from YOUR SQL Database
            var challenge = await _context.Challenges.FindAsync(request.ChallengeId);
            if (challenge == null) return NotFound("Challenge not found in database.");

            // Get the expected answer the moderator typed in
            string expectedOutput = challenge.SampleOutput?.Trim() ?? "";

            try
            {
                // 2. Prepare the payload for Piston API
                // Language mapping: "csharp" -> "dotnet" (Piston uses "dotnet" for C#)
                string pistonLanguage = request.Language == "csharp" ? "dotnet" : request.Language;

                var apiPayload = new
                {
                    language = pistonLanguage,
                    version = "*", // Uses the latest version available on their server
                    files = new[] {
                        new { content = request.SourceCode }
                    },
                    stdin = challenge.SampleInput ?? "" // Pass the DB input to the code's console
                };

                string jsonPayload = JsonSerializer.Serialize(apiPayload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                // 3. Request execution from Piston
                HttpResponseMessage response = await _httpClient.PostAsync("https://emkc.org/api/v2/piston/execute", content);

                if (!response.IsSuccessStatusCode)
                {
                    string pistonError = await response.Content.ReadAsStringAsync();
                    return StatusCode(500, new { status = "Error", feedback = $"Piston Rejected Request: {pistonError}" });
                }

                // 4. Parse the response
                string apiResponseString = await response.Content.ReadAsStringAsync();
                using JsonDocument doc = JsonDocument.Parse(apiResponseString);
                var runResult = doc.RootElement.GetProperty("run");

                string actualOutput = runResult.GetProperty("stdout").GetString()?.Trim() ?? "";
                string errorOutput = runResult.GetProperty("stderr").GetString()?.Trim() ?? "";

                // 5. Check for Runtime/Compilation Errors
                if (!string.IsNullOrEmpty(errorOutput))
                {
                    return Ok(new
                    {
                        status = "Error",
                        feedback = $"⚠️ Code Error:\n{errorOutput}"
                    });
                }

                // 6. Grading Logic
                if (actualOutput == expectedOutput)
                {
                    return Ok(new
                    {
                        status = "Passed",
                        feedback = "✅ Success! All test cases passed.",
                        actual = actualOutput
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = "Failed",
                        feedback = $"❌ Wrong Answer. Expected '{expectedOutput}' but got '{actualOutput}'",
                        actual = actualOutput
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "Error", feedback = $"Internal Server Error: {ex.Message}" });
            }
        }
    }

    public class CodeRequest
    {
        public int ChallengeId { get; set; }
        public string SourceCode { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
    }
}