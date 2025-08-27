using System;
using System.Collections.Generic;

namespace LibraryApp1.Server.Models;

public partial class Reservation
{
    public int ReservationId { get; set; }

    public int? Userid { get; set; }

    public int? BookId { get; set; }

    public DateOnly FromDate { get; set; }

    public DateOnly ToDate { get; set; }

    public string? IsReserved { get; set; }

    public virtual Book? Book { get; set; }

    public virtual User? User { get; set; }
}
