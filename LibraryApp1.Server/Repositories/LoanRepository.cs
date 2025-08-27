using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp1.Server.Repositories
{
    public class LoanRepository : ILoanRepository
    {
        private readonly DbsLibraryContext _context;

        public LoanRepository(DbsLibraryContext context)
        {
            _context = context;
        }

        public IEnumerable<Loan> GetAll()
        {
            return _context.Loans
       .Include(l => l.User)
       .Include(l => l.Copy)
       .ThenInclude(c => c.Book)
       .ToList();
        }
        public IEnumerable<Loan> GetActiveLoansByUserId(int userId)
        {
            return _context.Loans
                .Include(l => l.Copy)
                .ThenInclude(c => c.Book)
                .Include(l => l.Fines)
                .Include(l => l.User)
                .Where(l => l.Userid == userId && !l.IsReturned)
                .ToList();
        }
        public Loan? GetById(int id) => _context.Loans.Include(l => l.User).Include(l => l.Copy)
.ThenInclude(c => c.Book)
.FirstOrDefault(l => l.LoanId == id);

        public void Add(Loan loan)
        {
            _context.Loans.Add(loan);
        }

        public void Update(Loan loan)
        {
            _context.Loans.Update(loan);
        }

        public void Delete(Loan loan)
        {
            _context.Loans.Remove(loan);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }



}
