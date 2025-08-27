namespace LibraryApp1.Server.Interfaces.IServices
{
    public interface IFineService
    {
        bool PayFine(int loanId, double amount);
    }
}
