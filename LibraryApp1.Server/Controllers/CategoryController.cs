using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _categoryService.GetAllCategories();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var category = _categoryService.GetCategoryById(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        [HttpPost]
        public IActionResult Create(CategoryDto categoryDto)
        {
            _categoryService.CreateCategory(categoryDto);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, CategoryDto categoryDto)
        {
            if (id != categoryDto.CategoryId) return BadRequest();
            _categoryService.UpdateCategory(categoryDto);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _categoryService.DeleteCategory(id);
            return Ok();
        }
    }
}
