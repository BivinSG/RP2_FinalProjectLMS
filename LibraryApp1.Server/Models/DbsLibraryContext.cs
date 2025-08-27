using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp1.Server.Models;

public partial class DbsLibraryContext : DbContext
{
    //public DbsLibraryContext()
    //{
    //}

    public DbsLibraryContext(DbContextOptions<DbsLibraryContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Author> Authors { get; set; }

    public virtual DbSet<Book> Books { get; set; }

    public virtual DbSet<Bookauthor> Bookauthors { get; set; }

    public virtual DbSet<Bookreview> Bookreviews { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Copy> Copies { get; set; }

    public virtual DbSet<Fine> Fines { get; set; }

    public virtual DbSet<Language> Languages { get; set; }

    public virtual DbSet<Loan> Loans { get; set; }

    public virtual DbSet<Reservation> Reservations { get; set; }

    public virtual DbSet<User> Users { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseSqlServer("Data Source=LAPTOP-AO30EKDA\\SQLEXPRESS;Initial Catalog=dbs_library;Integrated Security=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Author>(entity =>
        {
            entity.HasKey(e => e.AuthorId).HasName("PK__author__86516BCFA04FAA4C");

            entity.ToTable("author");

            entity.Property(e => e.AuthorId).HasColumnName("author_id");
            entity.Property(e => e.AuthorName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("author_name");
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.BookId).HasName("PK__books__490D1AE1AF8DBC0F");

            entity.ToTable("books");

            entity.Property(e => e.BookId).HasColumnName("book_id");
            entity.Property(e => e.AuthorId).HasColumnName("author_id");
            entity.Property(e => e.BookTitle)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("book_title");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Coverpage)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("coverpage");
            entity.Property(e => e.Keywords)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("keywords");
            entity.Property(e => e.LanguageId).HasColumnName("language_id");
            entity.Property(e => e.PubYear).HasColumnName("pub_year");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.Summary)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("summary");

            entity.HasOne(d => d.Author).WithMany(p => p.Books)
                .HasForeignKey(d => d.AuthorId)
                .HasConstraintName("FK_Book_Author");

            entity.HasOne(d => d.Category).WithMany(p => p.Books)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__books__category___3C69FB99");

            entity.HasOne(d => d.Language).WithMany(p => p.Books)
                .HasForeignKey(d => d.LanguageId)
                .HasConstraintName("FK__books__language___3D5E1FD2");
        });

        modelBuilder.Entity<Bookauthor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__bookauth__3213E83F37F0C373");

            entity.ToTable("bookauthor");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AuthorId).HasColumnName("author_id");
            entity.Property(e => e.BookId).HasColumnName("book_id");

            entity.HasOne(d => d.Author).WithMany(p => p.Bookauthors)
                .HasForeignKey(d => d.AuthorId)
                .HasConstraintName("FK__bookautho__autho__4222D4EF");

            entity.HasOne(d => d.Book).WithMany(p => p.Bookauthors)
                .HasForeignKey(d => d.BookId)
                .HasConstraintName("FK__bookautho__book___4316F928");
        });

        modelBuilder.Entity<Bookreview>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__bookrevi__60883D9064AE9796");

            entity.ToTable("bookreview");

            entity.Property(e => e.ReviewId).HasColumnName("review_id");
            entity.Property(e => e.BookId).HasColumnName("book_id");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.Review)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("review");
            entity.Property(e => e.Userid).HasColumnName("userid");

            entity.HasOne(d => d.Book).WithMany(p => p.Bookreviews)
                .HasForeignKey(d => d.BookId)
                .HasConstraintName("FK__bookrevie__book___571DF1D5");

            entity.HasOne(d => d.User).WithMany(p => p.Bookreviews)
                .HasForeignKey(d => d.Userid)
                .HasConstraintName("FK__bookrevie__useri__5629CD9C");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__category__D54EE9B40A1FD796");

            entity.ToTable("category");

            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.CategoryName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("category_name");
        });

        modelBuilder.Entity<Copy>(entity =>
        {
            entity.HasKey(e => e.CopyId).HasName("PK__copies__3C21D2D2D4AE87BC");

            entity.ToTable("copies");

            entity.Property(e => e.CopyId).HasColumnName("copy_id");
            entity.Property(e => e.BookId).HasColumnName("book_id");
            entity.Property(e => e.IsAvailable)
                .HasDefaultValue(true)
                .HasColumnName("is_available");

            entity.HasOne(d => d.Book).WithMany(p => p.Copies)
                .HasForeignKey(d => d.BookId)
                .HasConstraintName("FK__copies__book_id__45F365D3");
        });

        modelBuilder.Entity<Fine>(entity =>
        {
            entity.HasKey(e => e.FineId).HasName("PK__fine__F3C688D192121BA5");

            entity.ToTable("fine");

            entity.Property(e => e.FineId).HasColumnName("fine_id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.DueDate).HasColumnName("due_date");
            entity.Property(e => e.IsPaid)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasDefaultValue("yes")
                .HasColumnName("is_paid");
            entity.Property(e => e.LoanId).HasColumnName("loan_id");
            entity.Property(e => e.PaidAmount).HasColumnName("paid_amount");
            entity.Property(e => e.PaidDate).HasColumnName("paid_date");

            entity.HasOne(d => d.Loan).WithMany(p => p.Fines)
                .HasForeignKey(d => d.LoanId)
                .HasConstraintName("FK__fine__loan_id__59FA5E80");
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.HasKey(e => e.LanguageId).HasName("PK__language__804CF6B3CC8A94CD");

            entity.ToTable("languages");

            entity.Property(e => e.LanguageId).HasColumnName("language_id");
            entity.Property(e => e.LanguageName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("language_name");
        });

        modelBuilder.Entity<Loan>(entity =>
        {
            entity.HasKey(e => e.LoanId).HasName("PK__loan__A1F79554E523197B");

            entity.ToTable("loan");

            entity.Property(e => e.LoanId).HasColumnName("loan_id");
            entity.Property(e => e.CopyId).HasColumnName("copy_id");
            entity.Property(e => e.DateOfPurchase).HasColumnName("date_of_purchase");
            entity.Property(e => e.DateOfReturn).HasColumnName("date_of_return");
            entity.Property(e => e.ExpiryDate).HasColumnName("expiry_date");
            entity.Property(e => e.IsReturned).HasColumnName("is_returned");
            entity.Property(e => e.Userid).HasColumnName("userid");

            entity.HasOne(d => d.Copy).WithMany(p => p.Loans)
                .HasForeignKey(d => d.CopyId)
                .HasConstraintName("FK__loan__copy_id__4D94879B");

            entity.HasOne(d => d.User).WithMany(p => p.Loans)
                .HasForeignKey(d => d.Userid)
                .HasConstraintName("FK__loan__userid__4CA06362");
        });

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId).HasName("PK__reservat__31384C2929C69BB5");

            entity.ToTable("reservation");

            entity.Property(e => e.ReservationId).HasColumnName("reservation_id");
            entity.Property(e => e.BookId).HasColumnName("book_id");
            entity.Property(e => e.FromDate).HasColumnName("from_date");
            entity.Property(e => e.IsReserved)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("requested")
                .HasColumnName("is_reserved");
            entity.Property(e => e.ToDate).HasColumnName("to_date");
            entity.Property(e => e.Userid).HasColumnName("userid");

            entity.HasOne(d => d.Book).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.BookId)
                .HasConstraintName("FK__reservati__book___5165187F");

            entity.HasOne(d => d.User).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.Userid)
                .HasConstraintName("FK__reservati__useri__5070F446");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Userid).HasName("PK__users__CBA1B257EC8E133C");

            entity.ToTable("users");

            entity.Property(e => e.Userid).HasColumnName("userid");
            entity.Property(e => e.Address)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("address");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.EmailId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email_id");
            entity.Property(e => e.IsActive)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasDefaultValue("yes")
                .HasColumnName("is_active");
            entity.Property(e => e.MobileNumber)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("mobile_number");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
