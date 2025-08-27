using LibraryApp1.Server.DTO;

namespace LibraryApp1.Server.Interfaces.IServices
{
    public interface ILoanService
    {
        bool IssueBook(LoanDto loanDto);
        void ReturnBook(int loanId);
        LoanDto? GetLoanById(int id);
        IEnumerable<LoanDto> GetAllLoans();
        IEnumerable<AvailableCopyDto> GetAvailableCopies();
        IEnumerable<UserDto> GetActiveUsers();
        bool UpdateLoan(LoanDto loanDto);
        IEnumerable<LoanReturnDto> GetActiveLoansByUser(int userId);
        //bool Return(int loanId);
    }

}
