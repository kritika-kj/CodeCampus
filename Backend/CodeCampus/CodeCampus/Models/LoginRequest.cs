namespace CodeCampus.Models
{
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest : LoginRequest
    {
        public string Name { get; set; } = string.Empty;
    }
}