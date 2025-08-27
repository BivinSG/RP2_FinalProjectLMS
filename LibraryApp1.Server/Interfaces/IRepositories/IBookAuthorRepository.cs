using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Interfaces.IRepositories
{
    public interface IBookAuthorRepository
    {
        void Add(Bookauthor entity);
        IEnumerable<Bookauthor> GetByBookId(int bookId);
        Bookauthor? GetById(int id);
        void Update(Bookauthor entity);
        void Delete(Bookauthor entity);
        void Save();
        //void Add(BookAuthorDto entity);
    }
}
