using CodeCampus.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class TestCase
{
    public int Id { get; set; }
    
    public int ChallengeId { get; set; } 
    
    [ForeignKey("ChallengeId")]
    [JsonIgnore]
    public Challenges Challenge { get; set; }
    
    public string InputData { get; set; }
    public string ExpectedOutput { get; set; }
    public bool IsHidden { get; set; }
}