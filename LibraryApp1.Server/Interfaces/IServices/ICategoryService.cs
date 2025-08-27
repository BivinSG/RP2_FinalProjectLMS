using LibraryApp1.Server.DTO;

namespace LibraryApp1.Server.Interfaces.IServices
{
    public interface ICategoryService
    {
        IEnumerable<CategoryDto> GetAllCategories();
        CategoryDto GetCategoryById(int id);
        void CreateCategory(CategoryDto categoryDto);
        void UpdateCategory(CategoryDto categoryDto);
        void DeleteCategory(int id);
    }
}
