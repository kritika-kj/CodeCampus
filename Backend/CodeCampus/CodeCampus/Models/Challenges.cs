using System.ComponentModel.DataAnnotations;

namespace CodeCampus.Models
{
    public class Challenges
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty; // This will act as the "Problem Statement"

        public string Difficulty { get; set; } = "Easy";

        public int Points { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // --- NEW MODULAR FIELDS ---
        public string InputFormat { get; set; } = string.Empty;
        public string OutputFormat { get; set; } = string.Empty;
        public string Constraints { get; set; } = string.Empty;
        public string SampleInput { get; set; } = string.Empty;
        public string SampleOutput { get; set; } = string.Empty;
    }
}