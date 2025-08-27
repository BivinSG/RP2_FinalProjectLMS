using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Interfaces.IServices;
using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public IEnumerable<CategoryDto> GetAllCategories()
        {
            return _categoryRepository.GetAll().Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName
            });
        }

        public CategoryDto GetCategoryById(int id)
        {
            var c = _categoryRepository.GetById(id);
            if (c == null) return null;

            return new CategoryDto
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName
            };
        }

        public void CreateCategory(CategoryDto categoryDto)
        {
            var category = new Category
            {
                CategoryName = categoryDto.CategoryName
            };

            _categoryRepository.Add(category);
            _categoryRepository.Save();
        }

        public void UpdateCategory(CategoryDto categoryDto)
        {
            var category = _categoryRepository.GetById(categoryDto.CategoryId);
            if (category == null) return;

            category.CategoryName = categoryDto.CategoryName;

            _categoryRepository.Update(category);
            _categoryRepository.Save();
        }

        public void DeleteCategory(int id)
        {
            _categoryRepository.Delete(id);
            _categoryRepository.Save();
        }
    }
}
