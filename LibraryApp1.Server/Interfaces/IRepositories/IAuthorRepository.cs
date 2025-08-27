using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Interfaces.IRepositories
{
    public interface IAuthorRepository
    {
        IEnumerable<Author> GetAll();
        Author? GetById(int id);
        void Add(Author author);
        void Update(Author author);
        void Delete(int id);
    }
}
