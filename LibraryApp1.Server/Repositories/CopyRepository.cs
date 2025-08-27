using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace LibraryApp1.Server.Repositories
{
    public class CopyRepository(DbsLibraryContext context) : ICopyRepository
    {
        private readonly DbsLibraryContext _context = context;

        public IEnumerable<Copy> GetAll()
        {
            return _context.Copies
                           .Include(c => c.Book) // ensure Book is always loaded
                           .ToList();
        }

        public void Add(Copy copy)
        {
            _context.Copies.Add(copy);
        }

        // ✅ FIXED: include Book when fetching by Id
        public Copy? GetById(int id)
        {
            return _context.Copies
                           .Include(c => c.Book)
                           .FirstOrDefault(c => c.CopyId == id);
        }

        public void Update(Copy copy)
        {
            _context.Copies.Update(copy);
        }

        public void Delete(Copy copy)
        {
            _context.Copies.Remove(copy);
        }

        public IEnumerable<Copy> GetAvailableCopies()
        {
            return _context.Copies
                .Include(c => c.Book)
                .Where(c => c.IsAvailable && c.BookId != null)
                .AsEnumerable() // switch to in-memory for DistinctBy
                .DistinctBy(c => c.BookId)
                .ToList();
        }

        public IEnumerable<Copy> GetByBookId(int bookId)
        {
            return _context.Copies
                           .Include(c => c.Book)
                           .Where(c => c.BookId == bookId)
                           .ToList();
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
