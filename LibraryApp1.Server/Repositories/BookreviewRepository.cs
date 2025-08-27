using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp1.Server.Repositories
{
    public class BookreviewRepository : IBookreviewRepository
    {
        private readonly DbsLibraryContext _context;

        public BookreviewRepository(DbsLibraryContext context)
        {
            _context = context;
        }

        public IEnumerable<Bookreview> GetAll() =>
            _context.Bookreviews.ToList();

        public IEnumerable<Bookreview> GetByUserId(int userId) =>
    _context.Bookreviews.Include(br=>br.Book).Where(br => br.Userid == userId).ToList();


        public IEnumerable<Bookreview> GetByBookId(int bookId) =>
    _context.Bookreviews.Include(br => br.User).Where(br => br.BookId == bookId).ToList();

        public IEnumerable<BookDto> GetReturnedNotReviewedBooks(int userId)
        {
            var books = from loan in _context.Loans
                        join copy in _context.Copies on loan.CopyId equals copy.CopyId
                        join book in _context.Books on copy.BookId equals book.BookId
                        join review in _context.Bookreviews
                            on new { loan.Userid, copy.BookId } equals new { review.Userid, review.BookId } into reviewGroup
                        from review in reviewGroup.DefaultIfEmpty()
                        where loan.Userid == userId
                              && loan.DateOfReturn != null
                              && review == null
                        select new BookDto
                        {
                            BookId = book.BookId,
                            BookTitle = book.BookTitle
                        };

            return books.ToList();
        }

        public Bookreview? GetById(int id) =>
            _context.Bookreviews.Find(id);

        public void Add(Bookreview bookreview)
        {
            _context.Bookreviews.Add(bookreview);
            _context.SaveChanges();
        }

        public void Update(Bookreview bookreview)
        {
            _context.Bookreviews.Update(bookreview);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var bookreview = _context.Bookreviews.Find(id);
            if (bookreview != null)
            {
                _context.Bookreviews.Remove(bookreview);
                _context.SaveChanges();
            }
        }
    }
}