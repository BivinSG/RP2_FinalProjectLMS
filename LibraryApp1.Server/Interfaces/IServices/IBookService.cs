using LibraryApp1.Server.DTO;
using System.Collections.Generic;

namespace LibraryApp1.Server.Interfaces.IServices
{
    public interface IBookService
    {
        IEnumerable<BookDto> GetAllBooks();
        BookDto? GetBookById(int id);
        void AddBook(BookDto dto);
        void UpdateBook(BookDto dto);
        void DeleteBook(int id);
    }
}
