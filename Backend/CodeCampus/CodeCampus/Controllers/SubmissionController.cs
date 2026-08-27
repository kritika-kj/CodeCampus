using CodeCampus.Data;
using CodeCampus.Models;
using Microsoft.AspNetCore.Mvc;
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

        // Static HttpClient to prevent socket exhaustion
        private static readonly HttpClient _httpClient = new HttpClient();

        public SubmissionController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("run")]
        public async Task<IActionResult> RunCode([FromBody] CodeRequest request)
        {
            var challenge = await _context.Challenges.FindAsync(request.ChallengeId);
            if (challenge == null) return NotFound("Challenge not found in database.");

            string expectedOutput = challenge.SampleOutput?.Trim() ?? "";

            try
            {
                // 1. Map your frontend string to Judge0's specific integer IDs
                int judge0LangId = request.Language.ToLower() switch
                {
                    "csharp" => 51,
                    "java" => 62,
                    "python" => 71,
                    _ => 51 // Default to C#
                };

                // 2. Prepare the payload for Judge0
                var apiPayload = new
                {
                    source_code = request.SourceCode,
                    language_id = judge0LangId,
                    stdin = challenge.SampleInput ?? ""
                };

                string jsonPayload = JsonSerializer.Serialize(apiPayload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                HttpResponseMessage response;

                // ====================================================================
                // 3. EXECUTION ENGINE TOGGLE (Comment / Uncomment to switch modes)
                // ====================================================================

                // ---> OPTION A: CLOUD (RAPIDAPI) <---
                //string apiKey = _configuration["Judge0:ApiKey"];
                //string apiHost = _configuration["Judge0:Host"];

                //var requestMessage = new HttpRequestMessage
                //{
                //    Method = HttpMethod.Post,
                //    RequestUri = new Uri($"https://{apiHost}/submissions?wait=true&base64_encoded=false"),
                //    Headers =
                //    {
                //        { "x-rapidapi-key", apiKey },
                //        { "x-rapidapi-host", apiHost },
                //    },
                //    Content = content
                //};
                //response = await _httpClient.SendAsync(requestMessage);



                // ---> OPTION B: LOCAL DOCKER <---
                // To use Local Docker, comment out the "OPTION A" block above, 
                // and uncomment the single line below:
                 response = await _httpClient.PostAsync("http://localhost:2358/submissions?wait=true&base64_encoded=false", content);

                // ====================================================================

                if (!response.IsSuccessStatusCode)
                {
                    string engineError = await response.Content.ReadAsStringAsync();
                    return StatusCode(500, new { status = "Error", feedback = $"Execution Engine Error: {engineError}" });
                }

                // 4. Parse the Judge0 response
                string apiResponseString = await response.Content.ReadAsStringAsync();
                using JsonDocument doc = JsonDocument.Parse(apiResponseString);
                var root = doc.RootElement;

                // Safely extract properties
                string actualOutput = root.TryGetProperty("stdout", out var stdoutProp) && stdoutProp.ValueKind != JsonValueKind.Null ? stdoutProp.GetString()?.Trim() ?? "" : "";
                string errorOutput = root.TryGetProperty("stderr", out var stderrProp) && stderrProp.ValueKind != JsonValueKind.Null ? stderrProp.GetString()?.Trim() ?? "" : "";
                string compileError = root.TryGetProperty("compile_output", out var compileProp) && compileProp.ValueKind != JsonValueKind.Null ? compileProp.GetString()?.Trim() ?? "" : "";

                string fullError = string.IsNullOrEmpty(errorOutput) ? compileError : errorOutput;

                // 5. Check for Runtime/Compilation Errors
                if (!string.IsNullOrEmpty(fullError))
                {
                    return Ok(new
                    {
                        status = "Error",
                        feedback = $"⚠️ Code Error:\n{fullError}"
                    });
                }

                // 6. Grading Logic (With newline normalization for Linux/Windows compatibility)
                string normalizedActual = actualOutput.Replace("\r\n", "\n").Trim();
                string normalizedExpected = expectedOutput.Replace("\r\n", "\n").Trim();

                if (normalizedActual == normalizedExpected)
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