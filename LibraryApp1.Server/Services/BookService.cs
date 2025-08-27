using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Interfaces.IServices;
using LibraryApp1.Server.Models;
using LibraryApp1.Server.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace LibraryApp1.Server.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepository;
        private readonly ICopyRepository _copyRepository;
        private readonly IBookAuthorService _bookauthorService;

       private readonly ILanguageRepository _languageRepository;
private readonly ICategoryRepository _categoryRepository;
private readonly IAuthorRepository _authorRepository;

public BookService(
    IBookRepository bookRepository,
    ICopyRepository copyRepository,
    IBookAuthorService bookauthorService,
    ILanguageRepository languageRepository,
    ICategoryRepository categoryRepository,
    IAuthorRepository authorRepository)
{
    _bookRepository = bookRepository;
    _copyRepository = copyRepository;
    _bookauthorService = bookauthorService;
    _languageRepository = languageRepository;
    _categoryRepository = categoryRepository;
    _authorRepository = authorRepository;
}


        public IEnumerable<BookDto> GetAllBooks()
        {
            return _bookRepository.GetAll().Select(b => {
                var language = b.LanguageId.HasValue ? _languageRepository.GetById(b.LanguageId.Value) : null;
                var category = b.CategoryId.HasValue ? _categoryRepository.GetById(b.CategoryId.Value) : null;

                // Assuming book has AuthorId, but you can also fetch via BookAuthorService if needed
                var author = b.AuthorId.HasValue ? _authorRepository.GetById(b.AuthorId.Value) : null;

                var availableQuantity = _copyRepository
.GetAll()
.Count(c => c.BookId == b.BookId && c.IsAvailable);

                return new BookDto
                {
                    BookId = b.BookId,
                    BookTitle = b.BookTitle,
                    Quantity = b.Quantity,
                    PubYear = b.PubYear,
                    CategoryId = b.CategoryId,
                    LanguageId = b.LanguageId,
                    Keywords = b.Keywords,
                    Summary = b.Summary,
                    AuthorId = b.AuthorId,
                    Coverpage = b.Coverpage,
                    AvailableQuantity = availableQuantity,
                    LanguageName = language?.LanguageName,
                    CategoryName = category?.CategoryName,
                    AuthorName = author?.AuthorName
                };
            });
        }

        public BookDto? GetBookById(int id)
        {
            var book = _bookRepository.GetById(id);
            if (book == null) return null;

            var language = book.LanguageId.HasValue ? _languageRepository.GetById(book.LanguageId.Value) : null;
            var category = book.CategoryId.HasValue ? _categoryRepository.GetById(book.CategoryId.Value) : null;
            var author = book.AuthorId.HasValue ? _authorRepository.GetById(book.AuthorId.Value) : null;

            var availableQuantity = _copyRepository
.GetAll()
.Count(c => c.BookId == book.BookId && c.IsAvailable);
            return new BookDto
            {
                BookId = book.BookId,
                BookTitle = book.BookTitle,
                Quantity = book.Quantity,
                PubYear = book.PubYear,
                CategoryId = book.CategoryId,
                LanguageId = book.LanguageId,
                Keywords = book.Keywords,
                Summary = book.Summary,
                AuthorId = book.AuthorId,
                Coverpage = book.Coverpage,
                AvailableQuantity = availableQuantity,
                LanguageName = language?.LanguageName,
                CategoryName = category?.CategoryName,
                AuthorName = author?.AuthorName
            };
        }

        public void AddBook(BookDto dto)
        {
            var book = new Book
            {
                BookTitle = dto.BookTitle,
                Quantity = dto.Quantity,
                PubYear = dto.PubYear,
                CategoryId = dto.CategoryId,
                LanguageId = dto.LanguageId,
                Keywords = dto.Keywords,
                Summary = dto.Summary,
                AuthorId = dto.AuthorId,
                Coverpage = dto.Coverpage
            };

            _bookRepository.Add(book);
            _bookRepository.Save();

            if (dto.AuthorId.HasValue)
            {
                _bookauthorService.Add(new BookAuthorDto
                {
                    AuthorId = dto.AuthorId.Value,
                    BookId = book.BookId
                });
            }

            for (int i = 0; i < dto.Quantity; i++)
            {
                _copyRepository.Add(new Copy
                {
                    BookId = book.BookId,
                    IsAvailable=true
                });
            }
            _copyRepository.Save();
        }

        public void UpdateBook(BookDto dto)
        {
            var existingBook = _bookRepository.GetById(dto.BookId);
            if (existingBook == null) return;

            existingBook.BookTitle = dto.BookTitle;
            existingBook.Quantity = dto.Quantity;
            existingBook.PubYear = dto.PubYear;
            existingBook.CategoryId = dto.CategoryId;
            existingBook.LanguageId = dto.LanguageId;
            existingBook.Keywords = dto.Keywords;
            existingBook.Summary = dto.Summary;
            existingBook.AuthorId = dto.AuthorId;
            existingBook.Coverpage = dto.Coverpage;

            _bookRepository.Update(existingBook);
            _bookRepository.Save();

            var existingBookAuthors = _bookauthorService.GetByBookId(dto.BookId).ToList();

            if (dto.AuthorId.HasValue)
            {
                var existingBookAuthor = existingBookAuthors.FirstOrDefault();

                if (existingBookAuthor != null)
                {
                    if (existingBookAuthor.AuthorId != dto.AuthorId.Value)
                    {
                        existingBookAuthor.AuthorId = dto.AuthorId.Value;
                        _bookauthorService.Update(existingBookAuthor.Id, existingBookAuthor);
                    }
                }
                else
                {
                    _bookauthorService.Add(new BookAuthorDto
                    {
                        AuthorId = dto.AuthorId.Value,
                        BookId = dto.BookId
                    });
                }
            }
            else
            {
                // Delete all existing book authors for this book (if any)
                foreach (var authorDto in existingBookAuthors)
                {
                    _bookauthorService.Delete(authorDto.Id);
                }
            }
        }

        public void DeleteBook(int id)
        {
            var existingBook = _bookRepository.GetById(id);
            if (existingBook == null) return;

            var copies = _copyRepository.GetByBookId(id).ToList();
            foreach (var copy in copies)
            {
                _copyRepository.Delete(copy);
            }
            _copyRepository.Save();

            // Delete all BookAuthor relations for the book
            var bookAuthors = _bookauthorService.GetByBookId(id).ToList();
            foreach (var authorDto in bookAuthors)
            {
                _bookauthorService.Delete(authorDto.Id);
            }

            _bookRepository.Delete(existingBook);
            _bookRepository.Save();
        }
    }
}
