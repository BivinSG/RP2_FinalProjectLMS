using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Models;
using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Interfaces.IServices;

namespace LibraryApp1.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public IEnumerable<UserDto> GetAllUsers()
        {
            var users = _userRepository.GetAll();
            return users.Select(u => new UserDto
            {
                UserId = u.Userid,
                Name = u.Name,
                DateOfBirth = u.DateOfBirth,
                Address = u.Address,
                MobileNumber = u.MobileNumber,
                EmailId = u.EmailId,
                Password = u.Password,
                IsActive = u.IsActive,
                Role=u.Role
            });
        }

        public UserDto? GetUserById(int id)
        {
            var user = _userRepository.GetById(id);
            if (user == null) return null;

            return new UserDto
            {
                UserId = user.Userid,
                Name = user.Name,
                DateOfBirth = user.DateOfBirth,
                Address = user.Address,
                MobileNumber = user.MobileNumber,
                EmailId = user.EmailId,
                Password = user.Password,
                IsActive = user.IsActive,
                Role=user.Role
            };
        }

        private string GenerateDefaultPassword(string name, string mobileNumber)
        {
            string namePrefix = name.Length >= 3 ? name.Substring(0, 3) : name;
            string numberPrefix = mobileNumber.Length >= 3 ? mobileNumber.Substring(0, 3) : mobileNumber;
            return $"{namePrefix}{numberPrefix}";
        }

        public void AddUser(UserDto userDto)
        {
            var user = new User
            {
                Name = userDto.Name,
                DateOfBirth = userDto.DateOfBirth,
                Address = userDto.Address,
                MobileNumber = userDto.MobileNumber,
                EmailId = userDto.EmailId,
                Password = GenerateDefaultPassword(userDto.Name, userDto.MobileNumber),
                Role="user",
                IsActive = "Yes" // Default value for new users
            };

            _userRepository.Add(user);
        }

        public void UpdateUser(UserDto userDto)
        {
            var existingUser = _userRepository.GetById(userDto.UserId);
            if (existingUser == null) return;

            var user = new User
            {
                Userid = userDto.UserId,
                Name = userDto.Name,
                DateOfBirth = userDto.DateOfBirth,
                Address = userDto.Address,
                MobileNumber = userDto.MobileNumber,
                EmailId = userDto.EmailId,
                Password = existingUser.Password, // Preserve existing password
                Role= existingUser.Role,
                IsActive = existingUser.IsActive // Preserve existing IsActive status
            };

            _userRepository.Update(user);
        }

        public void DeleteUser(int id)
        {
            var user = _userRepository.GetById(id);
            if (user != null)
            {
                user.IsActive = "No"; // Soft delete
                _userRepository.Update(user);
            }
        }
    }
}
