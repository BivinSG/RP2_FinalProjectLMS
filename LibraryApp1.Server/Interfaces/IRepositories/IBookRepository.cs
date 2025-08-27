using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Interfaces.IRepositories
{
    public interface IBookRepository
    {
        IEnumerable<Book> GetAll();
        Book? GetById(int id);
        void Add(Book book);
        void Update(Book book);
        void Save();
        void Delete(Book book);
    }
}
