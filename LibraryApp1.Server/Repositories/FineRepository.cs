using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace LibraryApp1.Server.Repositories
{
    public class FineRepository : IFineRepository
    {
        private readonly DbsLibraryContext _context;

        public FineRepository(DbsLibraryContext context)
        {
            _context = context;
        }

        public IEnumerable<Fine> GetByLoanIds(IEnumerable<int> loanIds)
        {
            return _context.Fines
                .Where(f => f.LoanId.HasValue && loanIds.Contains(f.LoanId.Value))
                .ToList();
        }

        public Fine? GetById(int id)
        {
            return _context.Fines.Find(id);
        }

        public void Add(Fine fine)
        {
            _context.Fines.Add(fine);
        }

        public void Update(Fine fine)
        {
            _context.Fines.Update(fine);
        }

        public void Delete(Fine fine)
        {
            _context.Fines.Remove(fine);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
