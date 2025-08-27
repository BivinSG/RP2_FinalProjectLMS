namespace LibraryApp1.Server.DTO
{
    public class AvailableCopyDto
    {
        public int CopyId { get; set; }
        public string? Title { get; set; }
        public bool IsAvailable { get; set; }
        public object? BookId { get; internal set; }
    }
}