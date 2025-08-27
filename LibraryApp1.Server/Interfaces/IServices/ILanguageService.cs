using LibraryApp1.Server.DTO;
using System.Collections.Generic;

namespace LibraryApp1.Server.Interfaces.IServices
{
    public interface ILanguageService
    {
        IEnumerable<LanguageDto> GetAllLanguages();
        LanguageDto GetLanguageById(int id);
        void CreateLanguage(LanguageDto languageDto);
        void UpdateLanguage(LanguageDto languageDto);
        void DeleteLanguage(int id);
    }
}
