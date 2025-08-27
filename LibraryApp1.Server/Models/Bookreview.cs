using System;
using System.Collections.Generic;

namespace LibraryApp1.Server.Models;

public partial class Bookreview
{
    public int ReviewId { get; set; }

    public int? Userid { get; set; }

    public int? BookId { get; set; }

    public string Review { get; set; } = null!;

    public int Rating { get; set; }

    public virtual Book? Book { get; set; }

    public virtual User? User { get; set; }

}
