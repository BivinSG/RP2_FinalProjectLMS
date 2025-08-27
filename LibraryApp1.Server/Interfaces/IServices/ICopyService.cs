namespace LibraryApp1.Server.Interfaces.IServices
{
    public interface ICopyService
    {
        void ReserveCopy(int copyId);
        void ReturnCopy(int copyId);
    }
}
