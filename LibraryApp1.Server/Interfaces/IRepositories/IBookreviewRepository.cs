using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Interfaces.IRepositories
{
    public interface IBookreviewRepository
    {
        IEnumerable<Bookreview> GetAll();

        IEnumerable<Bookreview> GetByUserId(int userId);

        IEnumerable<Bookreview> GetByBookId(int bookId);

        Bookreview? GetById(int id);
        void Add(Bookreview bookreview);
        void Update(Bookreview bookreview);
        void Delete(int id);
        IEnumerable<BookDto> GetReturnedNotReviewedBooks(int userId);
    }
}