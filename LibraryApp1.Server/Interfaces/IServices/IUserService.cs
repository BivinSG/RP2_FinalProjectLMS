using LibraryApp1.Server.DTO;

namespace LibraryApp1.Server.Interfaces.IServices
{
    public interface IUserService
    {
        IEnumerable<UserDto> GetAllUsers();
        UserDto? GetUserById(int id);
        void AddUser(UserDto userDto);
        void UpdateUser(UserDto userDto);
        void DeleteUser(int id);

    }
}
