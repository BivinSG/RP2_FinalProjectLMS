namespace LibraryApp1.Server.Interfaces.IServices
{
    public interface IEmailService
    {
        void SendEmail(string to, string subject, string body);
    }
}
