using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Interfaces.IServices;
using LibraryApp1.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LibraryApp1.Server.Services
{
    public class LoanService(
        ILoanRepository loanRepository,
        IUserRepository userRepository,
        ICopyRepository copyRepository,
        IFineRepository fineRepository,
        IEmailService emailService
    ) : ILoanService
    {
        public IEnumerable<AvailableCopyDto> GetAvailableCopies()
        {
            return copyRepository.GetAvailableCopies()
                .Select(c => new AvailableCopyDto
                {
                    CopyId = c.CopyId,
                    Title = c.Book?.BookTitle ?? "(Unknown)",
                    BookId = c.BookId,
                    IsAvailable = c.IsAvailable
                })
                .ToList();
        }

        public IEnumerable<LoanReturnDto> GetActiveLoansByUser(int userId)
        {
            var loans = loanRepository.GetActiveLoansByUserId(userId);
            var loanIds = loans.Select(l => l.LoanId).ToList();
            var fines = fineRepository.GetByLoanIds(loanIds);

            return loans.Select(l =>
            {
                var finesForLoan = fines.Where(f => f.LoanId == l.LoanId).ToList();
                double totalFine = finesForLoan.Sum(f => f.Amount ?? 0);
                double paid = finesForLoan.Sum(f => f.PaidAmount ?? 0);

                return new LoanReturnDto
                {
                    LoanId = l.LoanId,
                    CopyId = l.CopyId ?? 0,
                    BookTitle = l.Copy?.Book?.BookTitle ?? "Unknown",
                    DateOfPurchase = l.DateOfPurchase,
                    ExpiryDate = l.ExpiryDate,
                    DateOfReturn = l.DateOfReturn,
                    IsReturned = l.IsReturned,
                    FineAmount = totalFine - paid,
                    PaidAmount = paid,
                    UserName = l.User?.Name ?? "Unknown"
                };
            }).ToList();
        }

        public IEnumerable<UserDto> GetActiveUsers()
        {
            var usersWithActiveLoans = loanRepository
                .GetAll()
                .Where(l => !l.IsReturned && l.Userid.HasValue)
                .Select(l => l.User)
                .Where(u => u != null)
                .Distinct();

            return usersWithActiveLoans.Select(u => new UserDto
            {
                UserId = u.Userid,
                Name = u.Name,
                IsActive = u.IsActive
            });
        }

        public IEnumerable<LoanDto> GetAllLoans()
        {
            return loanRepository.GetAll().Select(loan => new LoanDto
            {
                LoanId = loan.LoanId,
                UserId = loan.Userid ?? 0,
                UserName = loan.User?.Name ?? "(Unknown)",
                CopyId = loan.CopyId ?? 0,
                BookTitle = loan.Copy?.Book?.BookTitle ?? "(Unknown)",
                DateOfPurchase = loan.DateOfPurchase,
                ExpiryDate = loan.ExpiryDate,
                DateOfReturn = loan.DateOfReturn,
                LoanStatus = loan.IsReturned ? "Returned" : "Active",
                Email = loan.User?.EmailId ?? ""
            }).ToList();
        }

        public LoanDto? GetLoanById(int id)
        {
            var loan = loanRepository.GetById(id);
            if (loan == null) return null;

            return new LoanDto
            {
                LoanId = loan.LoanId,
                UserId = loan.Userid ?? 0,
                CopyId = loan.CopyId ?? 0,
                DateOfPurchase = loan.DateOfPurchase,
                ExpiryDate = loan.ExpiryDate,
                DateOfReturn = loan.DateOfReturn,
                UserName = loan.User?.Name ?? "(Unknown)",
                BookTitle = loan.Copy?.Book?.BookTitle ?? "(Unknown)"
            };
        }

        public bool UpdateLoan(LoanDto loanDto)
        {
            var loan = loanRepository.GetById(loanDto.LoanId);
            if (loan == null)
                return false;

            if (loan.CopyId != loanDto.CopyId)
            {
                var newCopy = copyRepository.GetById(loanDto.CopyId);
                if (newCopy == null || !newCopy.IsAvailable)
                    return false;

                var oldCopy = copyRepository.GetById(loan.CopyId ?? 0);
                if (oldCopy != null)
                {
                    oldCopy.IsAvailable = true;
                    copyRepository.Update(oldCopy);
                }

                newCopy.IsAvailable = false;
                copyRepository.Update(newCopy);

                loan.CopyId = loanDto.CopyId;
            }

            loan.Userid = loanDto.UserId;
            loan.DateOfPurchase = loanDto.DateOfPurchase;
            loan.ExpiryDate = loanDto.ExpiryDate;

            // ✅ FIXED: don't force DateOfReturn to default
            loan.DateOfReturn = loanDto.DateOfReturn;

            loanRepository.Update(loan);
            loanRepository.Save();
            copyRepository.Save();

            return true;
        }

        public bool IssueBook(LoanDto loanDto)
        {
            var copy = copyRepository.GetById(loanDto.CopyId);
            if (copy == null || !copy.IsAvailable)
                return false;

            var user = userRepository.GetById(loanDto.UserId);
            if (user == null)
                return false;

            var loan = new Loan
            {
                Userid = loanDto.UserId,
                CopyId = loanDto.CopyId,
                DateOfPurchase = loanDto.DateOfPurchase,
                ExpiryDate = loanDto.ExpiryDate,
                // ✅ don't set DateOfReturn here, it should be null until returned
                DateOfReturn = loanDto.DateOfReturn
            };

            loanRepository.Add(loan);
            copy.IsAvailable = false;
            copyRepository.Update(copy);

            loanRepository.Save();
            copyRepository.Save();

            try
            {
                if (!string.IsNullOrEmpty(user.EmailId))
                {
                    var subject = "Book Issued: " + (copy.Book?.BookTitle ?? "Unknown Book");
                    var body = $@"
Hello {user.Name},
This is a Test Email..

Your book has been issued successfully!

📘 Title: {copy.Book?.BookTitle ?? "Unknown"}
📅 Issued On: {loan.DateOfPurchase:d}
📅 Expiry Date: {loan.ExpiryDate:d}

Please return the book on or before the expiry date to avoid fines.

Thank you,
RP2 BSN_Library Team";

                    emailService.SendEmail(user.EmailId, subject, body);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Email sending failed: " + ex.Message);
            }

            return true;
        }

        public void ReturnBook(int loanId)
        {
            var loan = loanRepository.GetById(loanId);
            if (loan == null || loan.IsReturned) return;

            loan.IsReturned = true;
            loan.DateOfReturn = DateOnly.FromDateTime(DateTime.Now);

            loanRepository.Update(loan);

            var copy = copyRepository.GetById(loan.CopyId ?? 0);
            if (copy != null)
            {
                copy.IsAvailable = true;
                copyRepository.Update(copy);
            }

            loanRepository.Save();
            copyRepository.Save();
        }
    }
}
