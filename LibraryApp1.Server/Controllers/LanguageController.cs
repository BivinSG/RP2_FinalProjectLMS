using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LanguageController(ILanguageService _languageService) : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            var languages = _languageService.GetAllLanguages();
            return Ok(languages);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var language = _languageService.GetLanguageById(id);
            if (language == null) return NotFound();
            return Ok(language);
        }

        [HttpPost]
        public IActionResult Create(LanguageDto languageDto)
        {
            _languageService.CreateLanguage(languageDto);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, LanguageDto languageDto)
        {
            if (id != languageDto.LanguageId) return BadRequest();
            _languageService.UpdateLanguage(languageDto);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _languageService.DeleteLanguage(id);
            return Ok();
        }
    }
}
