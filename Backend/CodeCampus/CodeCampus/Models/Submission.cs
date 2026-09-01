using System;

namespace CodeCampus.Models
{
    public class Submission
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ChallengeId { get; set; }
        public int ContestId { get; set; }
        public string SourceCode { get; set; }
        public string Language { get; set; }
        public string Status { get; set; }
        public string Feedback { get; set; }
        public double AwardedPoints { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}