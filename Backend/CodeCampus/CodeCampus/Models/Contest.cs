using System.ComponentModel.DataAnnotations;

namespace CodeCampus.Models
{
    public class Contest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        // We will store the selected challenges like this: "1,4,5"
        public string ChallengeIds { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}