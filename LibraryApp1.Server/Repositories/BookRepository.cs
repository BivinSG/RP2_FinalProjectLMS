using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace LibraryApp1.Server.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly DbsLibraryContext _context;

        public BookRepository(DbsLibraryContext context)
        {
            _context = context;
        }

        public IEnumerable<Book> GetAll()
        {
            return _context.Books.ToList();
        }

        public Book? GetById(int id)
        {
            return _context.Books.FirstOrDefault(b => b.BookId == id);
        }

        public void Add(Book book)
        {
            _context.Books.Add(book);
        }

        public void Update(Book book)
        {
            _context.Entry(book).State = EntityState.Modified;
        }

        public void Delete(Book book)
        {
            _context.Books.Remove(book);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
