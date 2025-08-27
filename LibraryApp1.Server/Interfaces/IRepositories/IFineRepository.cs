using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Models;
using System.Collections.Generic;

namespace LibraryApp1.Server.Interfaces.IRepositories
{
    public interface IFineRepository
    {
        IEnumerable<Fine> GetByLoanIds(IEnumerable<int> loanIds);
        Fine? GetById(int id);
        void Add(Fine fine);
        void Update(Fine fine);
        void Delete(Fine fine);
        void Save();
        //void Add(PayFineDto fine);
    }
}
