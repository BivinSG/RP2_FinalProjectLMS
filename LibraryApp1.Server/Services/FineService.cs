using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Interfaces.IServices;
using LibraryApp1.Server.Models;
using System;

namespace LibraryApp1.Server.Services
{
    public class FineService : IFineService
    {
        private readonly IFineRepository _fineRepository;
        private readonly ILoanRepository _loanRepository;

        public FineService(IFineRepository fineRepository, ILoanRepository loanRepository)
        {
            _fineRepository = fineRepository;
            _loanRepository = loanRepository;
        }

        public bool PayFine(int loanId, double amount)
        {
            var loan = _loanRepository.GetById(loanId);
            if (loan == null)
                return false;

            var fine = new Fine
            {
                LoanId = loanId,
                Amount = amount,
                IsPaid = "yes",
                PaidAmount = amount,
                PaidDate = DateOnly.FromDateTime(DateTime.Now),
                DueDate = DateOnly.FromDateTime(DateTime.Now) // or null if you want
            };

            _fineRepository.Add(fine);
            _fineRepository.Save();

            return true;
        }
    }
}
