using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp1.Server.Repositories
{
    public class BookAuthorRepository : IBookAuthorRepository
    {
        private readonly DbsLibraryContext _context;

        public BookAuthorRepository(DbsLibraryContext context)
        {
            _context = context;
        }

        public void Add(Bookauthor entity)
        {
            _context.Bookauthors.Add(entity);
        }

        public IEnumerable<Bookauthor> GetByBookId(int bookId)
        {
            return _context.Bookauthors.Where(ba => ba.BookId == bookId).ToList();
        }

        public Bookauthor? GetById(int id)
        {
            return _context.Bookauthors.Find(id);
        }

        public void Update(Bookauthor entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
        }

        public void Delete(Bookauthor entity)
        {
            _context.Bookauthors.Remove(entity);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
