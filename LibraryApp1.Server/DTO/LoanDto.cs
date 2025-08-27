namespace LibraryApp1.Server.DTO
{
    public class LoanDto
    {
        public int LoanId { get; set; }
        public int UserId { get; set; }
        public int CopyId { get; set; }
        public DateOnly DateOfPurchase { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public DateOnly? DateOfReturn { get; set; }
        public string? UserName { get; internal set; }
        public string? Email { get; internal set; } // <- from User table
        public string? BookTitle { get; internal set; }
      

        // New property
        public string LoanStatus { get; set; } = "Active";
    }

}
