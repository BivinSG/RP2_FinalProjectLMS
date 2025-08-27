using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Interfaces.IRepositories
{
    public interface ILoanRepository
    {
        IEnumerable<Loan> GetAll();
        Loan? GetById(int id);
        void Add(Loan loan);
        void Update(Loan loan);
        void Delete(Loan loan);
        void Save();
        IEnumerable<Loan> GetActiveLoansByUserId(int userId);
        //IEnumerable<BookWithAvailableCopiesDto> GetBooksWithAvailableCopies();
        //IEnumerable<UserDto> GetActiveUsers();
        //IEnumerable<BookDto> GetAvailableCopies();

    }
}
