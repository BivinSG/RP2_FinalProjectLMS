using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LibraryApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthorsController : ControllerBase
    {
        private readonly IAuthorService _authorService;
        private readonly ILogger<AuthorsController> _logger;

        public AuthorsController(IAuthorService authorService, ILogger<AuthorsController> logger)
        {
            _authorService = authorService;
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<AuthorDto>> GetAll()
        {
            try
            {
                var authors = _authorService.GetAllAuthors();
                _logger.LogInformation("Retrieved all authors at {Time}", DateTime.Now);
                return Ok(authors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving authors at {Time}", DateTime.Now);
                return StatusCode(500, "An error occurred.");
            }
        }

        [HttpGet("{id}")]
        public ActionResult<AuthorDto> GetById(int id)
        {
            try
            {
                var author = _authorService.GetAuthorById(id);
                if (author == null)
                {
                    _logger.LogWarning("Author with ID {Id} not found at {Time}", id, DateTime.Now);
                    return NotFound();
                }

                _logger.LogInformation("Retrieved author with ID {Id} at {Time}", id, DateTime.Now);
                return Ok(author);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving author ID {Id} at {Time}", id, DateTime.Now);
                return StatusCode(500, "An error occurred.");
            }
        }

        [HttpPost]
        public IActionResult Create([FromBody] AuthorDto authorDto)
        {
            try
            {
                _authorService.AddAuthor(authorDto);
                _logger.LogInformation("Created author {@Author} at {Time}", authorDto, DateTime.Now);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating author at {Time}", DateTime.Now);
                return StatusCode(500, "An error occurred.");
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] AuthorDto authorDto)
        {
            if (id != authorDto.AuthorId)
            {
                _logger.LogWarning("Author ID mismatch at {Time}: {Id} != {AuthorId}", DateTime.Now, id, authorDto.AuthorId);
                return BadRequest("Author ID mismatch.");
            }

            try
            {
                _authorService.UpdateAuthor(authorDto);
                _logger.LogInformation("Updated author {@Author} at {Time}", authorDto, DateTime.Now);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating author ID {Id} at {Time}", id, DateTime.Now);
                return StatusCode(500, "An error occurred.");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _authorService.DeleteAuthor(id);
                _logger.LogInformation("Deleted author ID {Id} at {Time}", id, DateTime.Now);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting author ID {Id} at {Time}", id, DateTime.Now);
                return StatusCode(500, "An error occurred.");
            }
        }
    }
}
