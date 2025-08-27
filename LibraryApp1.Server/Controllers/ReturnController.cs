using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IServices;
using LibraryApp1.Server.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace LibraryApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReturnController : ControllerBase
    {
        private readonly ILoanService _loanService;
        private readonly IFineService _fineService;

        public ReturnController(ILoanService loanService, IFineService fineService)
        {
            _loanService = loanService;
            _fineService = fineService;
        }

        [HttpPost("pay-fine/{loanId}")]
        public IActionResult PayFine(int loanId, [FromBody] PayFineDto dto)
        {
            var success = _fineService.PayFine(loanId, dto.Amount);
            if (!success)
                return BadRequest("Failed to pay fine");

            return Ok();
        }
        [HttpGet("active-users")]
        public ActionResult<IEnumerable<UserDto>> GetActiveUsers()
        {
            var users = _loanService.GetActiveUsers();
            return Ok(users);
        }

        [HttpGet("user-loans/{userId}")]
        public ActionResult<IEnumerable<LoanReturnDto>> GetLoansByUser(int userId)
        {
            var loans = _loanService.GetActiveLoansByUser(userId);
            return Ok(loans);
        }

        [HttpPost("return/{loanId}")]
        public IActionResult ReturnBook(int loanId)
        {
            _loanService.ReturnBook(loanId);
          
            return Ok("Book returned successfully");
        }
    }
}
