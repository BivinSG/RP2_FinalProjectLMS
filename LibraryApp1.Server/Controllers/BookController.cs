using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _service;

        public BookController(IBookService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_service.GetAllBooks());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var book = _service.GetBookById(id);
            if (book == null) return NotFound();
            return Ok(book);
        }

        [HttpPost]
        public IActionResult Create([FromBody] BookDto dto)
        {
            _service.AddBook(dto);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] BookDto dto)
        {
            if (id != dto.BookId) return BadRequest();
            _service.UpdateBook(dto);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.DeleteBook(id);
            return Ok();
        }



      
    }
}
