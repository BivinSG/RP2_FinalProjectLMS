using Microsoft.AspNetCore.Mvc;
using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IServices;

namespace LibraryApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookreviewController : ControllerBase
    {
        private readonly IBookreviewService _bookreviewService;

        public BookreviewController(IBookreviewService bookreviewService)
        {
            _bookreviewService = bookreviewService;
        }

        [HttpGet]
        public IActionResult GetAllBookreviews()
        {
            try
            {
                var bookreviews = _bookreviewService.GetAllBookreviews();
                return Ok(bookreviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("to-review/{userId}")]
        public IActionResult GetBooksToReview(int userId)
        {
            try
            {
                var books = _bookreviewService.GetBooksToReview(userId);
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("{bookId}")]
        public IActionResult GetBookreviewsByBookId(int bookId)
        {
            try
            {
                var bookreviews = _bookreviewService.GetBookreviewsByBookId(bookId);
                return Ok(bookreviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetBookreviewsByUserId(int userId)
        {
            try
            {
                var bookreviews = _bookreviewService.GetBookreviewsByUserId(userId);
                return Ok(bookreviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost]
        public IActionResult AddBookreview([FromBody] BookreviewDto bookreviewDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                _bookreviewService.AddBookreview(bookreviewDto);
                return Ok("Bookreview created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPut]
        public IActionResult UpdateBookreview([FromBody] BookreviewDto bookreviewDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                _bookreviewService.UpdateBookreview(bookreviewDto);
                return Ok("Bookreview updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBookreview(int id)
        {
            try
            {
                _bookreviewService.DeleteBookreview(id);
                return Ok("Bookreview deleted successfully");
            }
            catch (Exception ex)
            {
                 return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}