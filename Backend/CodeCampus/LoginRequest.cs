namespace CodeCampus.Models
{
	public class LoginRequest
	{
		public string Email { get; set; }
		public string Password { get; set; }
	}
<<<<<<< HEAD

    public class RegisterRequest : LoginRequest
    {
        public string Name { get; set; } = string.Empty;
    }
=======
>>>>>>> d2f8a62f9794f42146d7dd76e975dbf574532772
}