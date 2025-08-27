namespace LibraryApp1.Server.DTO
{
    public class BookAuthorDto
    {
        public int Id { get; set; }  // Add this Id property for updates/deletes
        public int AuthorId { get; set; }
        public int BookId { get; set; }
    }

}
