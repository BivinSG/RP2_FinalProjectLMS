using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly DbsLibraryContext _context;

        public CategoryRepository(DbsLibraryContext context)
        {
            _context = context;
        }

        public IEnumerable<Category> GetAll()
        {
            return _context.Categories.ToList();
        }

        public Category GetById(int id)
        {
            return _context.Categories.FirstOrDefault(c => c.CategoryId == id);
        }

        public void Add(Category category)
        {
            _context.Categories.Add(category);
        }

        public void Update(Category category)
        {
            _context.Categories.Update(category);
        }

        public void Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category != null)
                _context.Categories.Remove(category);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
