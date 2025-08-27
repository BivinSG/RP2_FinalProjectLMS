using System;
using System.Collections.Generic;

namespace LibraryApp1.Server.Models;

public partial class Bookauthor
{
    public int Id { get; set; }

    public int? AuthorId { get; set; }

    public int? BookId { get; set; }

    public virtual Author? Author { get; set; }

    public virtual Book? Book { get; set; }
    //public int Id { get; internal set; }
}
