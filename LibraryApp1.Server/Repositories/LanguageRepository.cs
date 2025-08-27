using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Models;
using System.Collections.Generic;
using System.Linq;

namespace LibraryApp1.Server.Repositories
{
    public class LanguageRepository : ILanguageRepository
    {
        private readonly DbsLibraryContext _context;

        public LanguageRepository(DbsLibraryContext context)
        {
            _context = context;
        }

        public IEnumerable<Language> GetAll()
        {
            return _context.Languages.ToList();
        }

        public Language GetById(int id)
        {
            return _context.Languages.FirstOrDefault(l => l.LanguageId == id);
        }

        public void Add(Language language)
        {
            _context.Languages.Add(language);
        }

        public void Update(Language language)
        {
            _context.Languages.Update(language);
        }

        public void Delete(int id)
        {
            var language = _context.Languages.Find(id);
            if (language != null)
                _context.Languages.Remove(language);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
