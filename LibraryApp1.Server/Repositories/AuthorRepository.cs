using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp1.Server.Repositories
{
    public class AuthorRepository : IAuthorRepository
    {
        private readonly DbsLibraryContext _context;

        public AuthorRepository(DbsLibraryContext context)
        {
            _context = context;
        }

        public IEnumerable<Author> GetAll() =>
            _context.Authors.ToList();

        public Author? GetById(int id) =>
            _context.Authors.Find(id);

        public void Add(Author author)
        {
            _context.Authors.Add(author);
            _context.SaveChanges();
        }

        public void Update(Author author)
        {
            _context.Authors.Update(author);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var author = _context.Authors.Find(id);
            if (author != null)
            {
                _context.Authors.Remove(author);
                _context.SaveChanges();
            }
        }
    }
}
