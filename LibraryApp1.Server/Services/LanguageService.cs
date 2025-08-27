using LibraryApp1.Server.DTO;
using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Interfaces.IServices;
using LibraryApp1.Server.Models;
using System.Collections.Generic;
using System.Linq;

namespace LibraryApp1.Server.Services
{
    public class LanguageService : ILanguageService
    {
        private readonly ILanguageRepository _languageRepository;

        public LanguageService(ILanguageRepository languageRepository)
        {
            _languageRepository = languageRepository;
        }

        public IEnumerable<LanguageDto> GetAllLanguages()
        {
            return _languageRepository.GetAll().Select(l => new LanguageDto
            {
                LanguageId = l.LanguageId,
                LanguageName = l.LanguageName
            });
        }

        public LanguageDto GetLanguageById(int id)
        {
            var l = _languageRepository.GetById(id);
            if (l == null) return null;

            return new LanguageDto
            {
                LanguageId = l.LanguageId,
                LanguageName = l.LanguageName
            };
        }

        public void CreateLanguage(LanguageDto languageDto)
        {
            var language = new Language
            {
                LanguageName = languageDto.LanguageName
            };

            _languageRepository.Add(language);
            _languageRepository.Save();
        }

        public void UpdateLanguage(LanguageDto languageDto)
        {
            var language = _languageRepository.GetById(languageDto.LanguageId);
            if (language == null) return;

            language.LanguageName = languageDto.LanguageName;

            _languageRepository.Update(language);
            _languageRepository.Save();
        }

        public void DeleteLanguage(int id)
        {
            _languageRepository.Delete(id);
            _languageRepository.Save();
        }
    }
}
