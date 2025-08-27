using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Interfaces.IServices;
using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Services
{
    public class AuthorService : IAuthorService
    {
        private readonly IAuthorRepository _authorRepository;

        public AuthorService(IAuthorRepository authorRepository)
        {
            _authorRepository = authorRepository;
        }

        public IEnumerable<AuthorDto> GetAllAuthors()
        {
            var authors = _authorRepository.GetAll();    
            return authors.Select(a => new AuthorDto
            {
                AuthorId = a.AuthorId,
                AuthorName = a.AuthorName
            });
        }

        public AuthorDto? GetAuthorById(int id)
        {
            var author = _authorRepository.GetById(id);
            if (author == null) return null;

            return new AuthorDto
            {
                AuthorId = author.AuthorId,
                AuthorName = author.AuthorName
            };
        }

        public void AddAuthor(AuthorDto authorDto)
        {
            var author = new Author
            {
                AuthorName = authorDto.AuthorName
            };

            _authorRepository.Add(author);
        }

        public void UpdateAuthor(AuthorDto authorDto)
        {
            var author = new Author
            {
                AuthorId = authorDto.AuthorId,
                AuthorName = authorDto.AuthorName
            };

            _authorRepository.Update(author);
        }

        public void DeleteAuthor(int id)
        {
            _authorRepository.Delete(id);
        }
    }
}
