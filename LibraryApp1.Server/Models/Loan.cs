using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryApp1.Server.Models;

public partial class Loan
{
    public int LoanId { get; set; }

    public int? Userid { get; set; }

    public int? CopyId { get; set; }


    public DateOnly ExpiryDate { get; set; }

    public DateOnly DateOfPurchase { get; set; }

    public DateOnly? DateOfReturn { get; set; }

    public bool IsReturned { get; set; }


    public virtual Copy? Copy { get; set; }   

    public virtual ICollection<Fine> Fines { get; set; } = new List<Fine>();

    public virtual User? User { get; set; }





}
