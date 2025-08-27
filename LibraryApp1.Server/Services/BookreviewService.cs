using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Interfaces.IServices;
using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Services
{
    public class BookreviewService : IBookreviewService
    {
        private readonly IBookreviewRepository _bookreviewRepository;

        public BookreviewService(IBookreviewRepository bookreviewRepository)
        {
            _bookreviewRepository = bookreviewRepository;
        }

        public IEnumerable<BookreviewDto> GetAllBookreviews()
        {
            var bookreviews = _bookreviewRepository.GetAll();
            return bookreviews.Select(bookreview => new BookreviewDto
            {
                ReviewId = bookreview.ReviewId,
                Userid = bookreview.Userid,
                BookId = bookreview.BookId,
                Review = bookreview.Review ?? string.Empty,
                Rating = bookreview.Rating
            });
        }

        public IEnumerable<BookreviewDto> GetBookreviewsByUserId(int userId)
        {
            var bookreviews = _bookreviewRepository.GetByUserId(userId);
            return bookreviews.Select(bookreview => new BookreviewDto
            {
                ReviewId = bookreview.ReviewId,
                Userid = bookreview.Userid,
                BookId = bookreview.BookId,
                Review = bookreview.Review ?? string.Empty,
                Rating = bookreview.Rating,
                Name = bookreview.Book.BookTitle
            });
        }

        public IEnumerable<BookreviewDto> GetBookreviewsByBookId(int bookId)
        {
            var bookreviews = _bookreviewRepository.GetByBookId(bookId);
            return bookreviews.Select(bookreview => new BookreviewDto
            {
                ReviewId = bookreview.ReviewId,
                Userid = bookreview.Userid,
                BookId = bookreview.BookId,
                Review = bookreview.Review ?? string.Empty,
                Rating = bookreview.Rating,
                Name=bookreview.User.Name
            });
        }

        public IEnumerable<BookDto> GetBooksToReview(int userId)
        {
            return _bookreviewRepository.GetReturnedNotReviewedBooks(userId);
        }

        public void AddBookreview(BookreviewDto bookreviewDto)
        {
            // Don't set ReviewId when adding - let the database auto-generate it
            var bookreview = new Bookreview
            {
                Userid = bookreviewDto.Userid,
                BookId = bookreviewDto.BookId,
                Review = bookreviewDto.Review,
                Rating = bookreviewDto.Rating
            };

            _bookreviewRepository.Add(bookreview);
        }

        public void UpdateBookreview(BookreviewDto bookreviewDto)
        {
            var bookreview = new Bookreview
            {
                ReviewId = bookreviewDto.ReviewId,
                Userid = bookreviewDto.Userid,
                BookId = bookreviewDto.BookId,
                Review = bookreviewDto.Review,
                Rating = bookreviewDto.Rating
            };

            _bookreviewRepository.Update(bookreview);
        }

        public void DeleteBookreview(int id)
        {
            _bookreviewRepository.Delete(id);
        }
    }
}