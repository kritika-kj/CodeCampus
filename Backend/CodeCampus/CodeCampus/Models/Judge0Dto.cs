using System.Text.Json.Serialization;

public class Judge0SubmissionRequest
{
    [JsonPropertyName("source_code")]
    public string SourceCode { get; set; }

    [JsonPropertyName("language_id")]
    public int LanguageId { get; set; } // 51 for C# (Mono), 62 for Java, 71 for Python, etc.

    [JsonPropertyName("stdin")]
    public string? Stdin { get; set; }
}

public class Judge0SubmissionResponse
{
    [JsonPropertyName("stdout")]
    public string? Stdout { get; set; }

    [JsonPropertyName("stderr")]
    public string? Stderr { get; set; }

    [JsonPropertyName("compile_output")]
    public string? CompileOutput { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("time")]
    public string? Time { get; set; }

    [JsonPropertyName("memory")]
    public int? Memory { get; set; }

    [JsonPropertyName("status")]
    public Judge0Status? Status { get; set; }
}

public class Judge0Status
{
    [JsonPropertyName("id")]
    public int Id { get; set; } // 3 = Accepted, 4 = Wrong Answer, 5 = Time Limit Exceeded, 6 = Compilation Error

    [JsonPropertyName("description")]
    public string Description { get; set; }
}