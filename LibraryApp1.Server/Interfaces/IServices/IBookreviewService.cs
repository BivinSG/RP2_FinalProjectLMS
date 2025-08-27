using LibraryApp1.Server.DTO;

namespace LibraryApp1.Server.Interfaces.IServices
{
    public interface IBookreviewService
    {
        IEnumerable<BookreviewDto> GetAllBookreviews();

        IEnumerable<BookreviewDto> GetBookreviewsByUserId(int userId);

       IEnumerable<BookreviewDto> GetBookreviewsByBookId(int bookId);

        IEnumerable<BookDto> GetBooksToReview(int userId);

        void AddBookreview(BookreviewDto bookreviewDto);
        void UpdateBookreview(BookreviewDto bookreviewDto);
        void DeleteBookreview(int id);
    }
}