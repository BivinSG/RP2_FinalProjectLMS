using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp1.Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DbsLibraryContext _context;

        public UserRepository(DbsLibraryContext context)
        {
            _context = context;
        }

        public IEnumerable<User> GetAll() =>
            _context.Users.Where(u => u.IsActive == "Yes").ToList();

        public User? GetById(int id) =>
            _context.Users.FirstOrDefault(u => u.Userid == id && u.IsActive == "Yes");

        public void Add(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void Update(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }
        public IEnumerable<User> GetActiveUsers()
        {
            return _context.Users
                .Where(u =>  u.IsActive != null
                         && u.IsActive == "yes")
                .ToList();
        }




        public void Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                user.IsActive = "No"; 
                _context.Users.Update(user);
                _context.SaveChanges();
            }
        }

    }
}
