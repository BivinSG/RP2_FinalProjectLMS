using LibraryApp1.Server.Models;

namespace LibraryApp1.Server.Interfaces.IRepositories
{
    public interface ILanguageRepository
    {
        IEnumerable<Language> GetAll();
        Language GetById(int id);
        void Add(Language language);
        void Update(Language language);
        void Delete(int id);
        void Save();
    }
}
