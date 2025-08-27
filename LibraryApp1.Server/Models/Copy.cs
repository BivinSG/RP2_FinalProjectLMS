using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryApp1.Server.Models;

public partial class Copy
{
    public int CopyId { get; set; }

    public int? BookId { get; set; }
    [Column("is_available")]
    public bool IsAvailable { get; set; }

    public virtual Book? Book { get; set; }


    public virtual ICollection<Loan> Loans { get; set; } = new List<Loan>();
}
