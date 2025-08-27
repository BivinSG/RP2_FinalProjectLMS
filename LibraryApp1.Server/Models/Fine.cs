using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryApp1.Server.Models;

public partial class Fine
{
    public int FineId { get; set; }

    public int? LoanId { get; set; }

    public double? Amount { get; set; }
    [Column("is_paid")]
    public string? IsPaid { get; set; }

    public DateOnly? DueDate { get; set; }

    public double? PaidAmount { get; set; }

    public DateOnly? PaidDate { get; set; }

    public virtual Loan? Loan { get; set; }
}
