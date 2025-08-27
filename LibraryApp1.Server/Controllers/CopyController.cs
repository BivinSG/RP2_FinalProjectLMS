using LibraryApp1.Server.Interfaces.IRepositories;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CopyController : ControllerBase
{
    private readonly ICopyRepository _copyRepository;

    public CopyController(ICopyRepository copyRepository)
    {
        _copyRepository = copyRepository;
    }

    [HttpGet("available")]
    public IActionResult GetAvailableCopies()
    {
        var copies = _copyRepository.GetAll()
            .Where(c => !(!c.IsAvailable || c.BookId == null))
            .Select(c => new
            {
                c.CopyId,
                c.BookId,
                Title = c.Book?.BookTitle 
            })
            .ToList();

        return Ok(copies);
    }
}
