using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Interfaces.IRepositories
{
    public interface IUserRepository
    {

        IEnumerable<User> GetAll();
        User? GetById(int id);
        void Add(User user);
        void Update(User user);
        void Delete(int id);
        IEnumerable<User> GetActiveUsers();

    }
}
