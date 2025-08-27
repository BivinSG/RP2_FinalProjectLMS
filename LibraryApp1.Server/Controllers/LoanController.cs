using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class LoanController : ControllerBase
{
    private readonly ILoanService _loanService;

    public LoanController(ILoanService loanService)
    {
        _loanService = loanService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var loans = _loanService.GetAllLoans();
        return Ok(loans);
    }

    [HttpGet("active-users")]
    public IActionResult GetActiveUsers()
    {
        var users = _loanService.GetActiveUsers();
        return Ok(users);
    }

    [HttpGet("available-copies")]
    public IActionResult GetAvailableCopies()
    {
        var books = _loanService.GetAvailableCopies();
        return Ok(books);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var loan = _loanService.GetLoanById(id);
        if (loan == null)
            return NotFound();

        return Ok(loan);
    }

    [HttpPost("issue")]
    public IActionResult IssueBook([FromBody] LoanDto loanDto)
    {
        var success = _loanService.IssueBook(loanDto);
        if (!success)
            return BadRequest("Copy is not available");

        return Ok("Book issued successfully");
    }

    [HttpPost("return/{loanId}")]
    public IActionResult ReturnBook(int loanId)
    {
        _loanService.ReturnBook(loanId);
        return Ok("Book returned successfully");
    }

    [HttpPut("{loanId:int}")]
    public IActionResult UpdateLoan(int loanId, [FromBody] LoanDto loanDto)
    {
        if (loanId != loanDto.LoanId)
            return BadRequest("Loan ID mismatch");

        var success = _loanService.UpdateLoan(loanDto);
        if (!success)
            return BadRequest("Failed to update loan. Possibly copy not available.");

        return Ok("Loan updated successfully");
    }
}
