using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryApp1.Server.Models;

public partial class Book
{
    public int BookId { get; set; }

    [StringLength(300)]
    [Column(TypeName = "nvarchar(300)")]
    public string BookTitle { get; set; } = null!;

    public int Quantity { get; set; }

    public int PubYear { get; set; }

    public int? CategoryId { get; set; }

    public int? LanguageId { get; set; }

    public string? Keywords { get; set; }
    //[StringLength(2000)]
    [Column(TypeName = "nvarchar(max)")]
    public string? Summary { get; set; }

    public int? AuthorId { get; set; }

    [Column(TypeName = "varchar(max)")]
    public string? Coverpage { get; set; }

    public virtual Author? Author { get; set; }

    public virtual ICollection<Bookauthor> Bookauthors { get; set; } = new List<Bookauthor>();

    public virtual ICollection<Bookreview> Bookreviews { get; set; } = new List<Bookreview>();

    public virtual Category? Category { get; set; }

    public virtual ICollection<Copy> Copies { get; set; } = new List<Copy>();

    public virtual Language? Language { get; set; }

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
