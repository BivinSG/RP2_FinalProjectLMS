using LibraryApp1.Server.Models;
using System.Collections.Generic;

namespace LibraryApp1.Server.Interfaces.IRepositories
{
    public interface ICopyRepository
    {
        void Add(Copy copy);
        void Delete(Copy copy);
        IEnumerable<Copy> GetByBookId(int bookId);
        Copy GetById(int v);
        void Save();
        void Update(Copy copy);
     
        IEnumerable<Copy> GetAvailableCopies();
        IEnumerable<Copy> GetAll();
    }
}
