using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Interfaces.IRepositories
{
    public interface ICategoryRepository
    {
        IEnumerable<Category> GetAll();
        Category GetById(int id);
        void Add(Category category);
        void Update(Category category);
        void Delete(int id);
        void Save();
    }
}
