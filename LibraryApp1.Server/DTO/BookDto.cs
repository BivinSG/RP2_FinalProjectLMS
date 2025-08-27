namespace LibraryApp1.Server.DTO
{
    public class BookDto
    {
        public int BookId { get; set; }
        public string BookTitle { get; set; } = null!;
        public int Quantity { get; set; }
        public int PubYear { get; set; }
        public int? CategoryId { get; set; }
        public int? LanguageId { get; set; }
        public string? Keywords { get; set; }
        public string? Summary { get; set; }
        public int? AuthorId { get; set; }
        public string? Coverpage { get; set; }

        public string? CategoryName { get; set; }
        public string? LanguageName { get; set; }
        public string? AuthorName { get; set; }
        public int? AvailableQuantity { get; internal set; }
    }
}
