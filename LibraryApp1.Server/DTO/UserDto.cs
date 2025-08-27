namespace LibraryApp1.Server.DTO
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = null!;
        public DateOnly DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string MobileNumber { get; set; } = null!;
        public string EmailId { get; set; } = null!;
        public string? Password { get; internal set; }
        public string? IsActive { get; internal set; }
        public string? Role { get; internal set; }


    }
}
