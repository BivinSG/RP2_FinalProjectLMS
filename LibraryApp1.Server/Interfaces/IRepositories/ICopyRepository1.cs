using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Interfaces.IRepositories
{
    public interface ICopyRepository1
    {
      //.  IEnumerable<Copy> GetAll();
        ///IEnumerable<Copy> GetAvailableByBookId(int bookId);
        Copy? ReserveCopy(int copyId);

      /// <summary>
      ///  void Add(Copy copy);
      /// </summary>
      /// <param name="copy"></param>
       /// void Update(Copy copy);
      ///  void Delete(int copyId);
    }
}
