using LibraryApp1.Server.DTO;

namespace LibraryApp1.Server.Interfaces.IServices
{
    public interface IAuthorService
    {
        IEnumerable<AuthorDto> GetAllAuthors();
        AuthorDto? GetAuthorById(int id);
        void AddAuthor(AuthorDto authorDto);
        void UpdateAuthor(AuthorDto authorDto);
        void DeleteAuthor(int id);
    }
}
