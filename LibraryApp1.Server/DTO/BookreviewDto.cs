namespace LibraryApp1.Server.DTO
{
    public class BookreviewDto
    {
        public int ReviewId { get; set; }
        public int? Userid { get; set; }
        public int? BookId { get; set; }
        public string Review { get; set; }
        public int Rating { get; set; }
        public string? Name { get; internal set; }
    }
}