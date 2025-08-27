using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IServices;
using LibraryApp1.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LibraryApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<UserDto>> GetAll()
        {
            try
            {
                var users = _userService.GetAllUsers();
                _logger.LogInformation("Retrieved all users at {Time}", DateTime.Now);
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users at {Time}", DateTime.Now);
                return StatusCode(500, "An error occurred.");
            }
        }

        [HttpGet("{id}")]
        public ActionResult<UserDto> GetById(int id)
        {
            try
            {
                var user = _userService.GetUserById(id);
                if (user == null)
                {
                    _logger.LogWarning("User with ID {Id} not found at {Time}", id, DateTime.Now);
                    return NotFound();
                }

                _logger.LogInformation("Retrieved user with ID {Id} at {Time}", id, DateTime.Now);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user ID {Id} at {Time}", id, DateTime.Now);
                return StatusCode(500, "An error occurred.");
            }
        }

        [HttpPost]
        public IActionResult Create([FromBody] UserDto userDto)
        {
            try
            {
                _userService.AddUser(userDto);
                _logger.LogInformation("Created user {@User} at {Time}", userDto, DateTime.Now);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user at {Time}", DateTime.Now);
                return StatusCode(500, "An error occurred.");
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UserDto userDto)
        {
            if (id != userDto.UserId)
            {
                _logger.LogWarning("User ID mismatch at {Time}: {Id} != {UserId}", DateTime.Now, id, userDto.UserId);
                return BadRequest("User ID mismatch.");
            }

            try
            {
                _userService.UpdateUser(userDto);
                _logger.LogInformation("Updated user {@User} at {Time}", userDto, DateTime.Now);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user ID {Id} at {Time}", id, DateTime.Now);
                return StatusCode(500, "An error occurred.");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _userService.DeleteUser(id);
                _logger.LogInformation("Deleted user ID {Id} at {Time}", id, DateTime.Now);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user ID {Id} at {Time}", id, DateTime.Now);
                return StatusCode(500, "An error occurred.");
            }
        }
    }
}
