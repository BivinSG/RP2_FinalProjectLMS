using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryApp1.Server.Models;

public partial class User
{
    public int Userid { get; set; }

    public string Name { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public string? Address { get; set; }

    public string MobileNumber { get; set; } = null!;

    public string? EmailId { get; set; }
    [Column("is_active")]
    public string? IsActive { get; set; }
    public string? Password { get; set; }

    public string? Role { get; set; }

    public virtual ICollection<Bookreview> Bookreviews { get; set; } = new List<Bookreview>();

    public virtual ICollection<Loan> Loans { get; set; } = new List<Loan>();

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
