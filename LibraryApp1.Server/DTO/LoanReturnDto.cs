namespace LibraryApp1.Server.DTO
{
    public class LoanReturnDto
    {
        public int LoanId { get; set; }
        public int CopyId { get; set; }
        public string BookTitle { get; set; }
        public DateOnly DateOfPurchase { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public DateOnly? DateOfReturn { get; set; }
        public bool IsReturned { get; set; }
        public double? FineAmount { get; set; }
        public double? PaidAmount { get; set; }
        public string UserName { get; set; }
    }
}
