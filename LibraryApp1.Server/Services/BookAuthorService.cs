using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Interfaces.IServices;
using LibraryApp1.Server.Models;
using System.Collections.Generic;
using System.Linq;

namespace LibraryApp1.Server.Services
{
    public class BookAuthorService : IBookAuthorService
    {
        private readonly IBookAuthorRepository _repository;

        public BookAuthorService(IBookAuthorRepository repository)
        {
            _repository = repository;
        }

        public void Add(BookAuthorDto dto)
        {
            var entity = new Bookauthor
            {
                AuthorId = dto.AuthorId,
                BookId = dto.BookId
            };
            _repository.Add(entity);
            _repository.Save();
        }

        public IEnumerable<BookAuthorDto> GetByBookId(int bookId)
        {
            return _repository.GetByBookId(bookId)
                .Select(e => new BookAuthorDto
                {
                    Id = e.Id, // map entity ID
                    AuthorId = (int)e.AuthorId,
                    BookId = (int)e.BookId
                })
                .ToList();
        }

        public void Update(int id, BookAuthorDto dto)
        {
            var entity = _repository.GetById(id);
            if (entity != null)
            {
                entity.AuthorId = dto.AuthorId;
                entity.BookId = dto.BookId;
                _repository.Update(entity);
                _repository.Save();
            }
        }

        public void Delete(int id)
        {
            var entity = _repository.GetById(id);
            if (entity != null)
            {
                _repository.Delete(entity);
                _repository.Save();
            }
        }
    }
}
