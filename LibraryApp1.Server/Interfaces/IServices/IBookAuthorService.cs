using LibraryApp1.Server.DTO;
using System.Collections.Generic;

namespace LibraryApp1.Server.Interfaces.IServices
{
    public interface IBookAuthorService
    {
        void Add(BookAuthorDto dto);
        IEnumerable<BookAuthorDto> GetByBookId(int bookId);
        void Update(int id, BookAuthorDto dto);
        void Delete(int id);
    }
}
