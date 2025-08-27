using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryApp1.Server.Migrations
{
    /// <inheritdoc />
    public partial class IntialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "author",
                columns: table => new
                {
                    author_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    author_name = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__author__86516BCFA04FAA4C", x => x.author_id);
                });

            migrationBuilder.CreateTable(
                name: "category",
                columns: table => new
                {
                    category_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    category_name = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__category__D54EE9B40A1FD796", x => x.category_id);
                });

            migrationBuilder.CreateTable(
                name: "languages",
                columns: table => new
                {
                    language_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    language_name = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__language__804CF6B3CC8A94CD", x => x.language_id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    userid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: false),
                    address = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    mobile_number = table.Column<string>(type: "char(10)", unicode: false, fixedLength: true, maxLength: 10, nullable: false),
                    email_id = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    is_active = table.Column<string>(type: "varchar(3)", unicode: false, maxLength: 3, nullable: true, defaultValue: "yes"),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__users__CBA1B257EC8E133C", x => x.userid);
                });

            migrationBuilder.CreateTable(
                name: "books",
                columns: table => new
                {
                    book_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    book_title = table.Column<string>(type: "nvarchar(300)", unicode: false, maxLength: 30, nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    pub_year = table.Column<int>(type: "int", nullable: false),
                    category_id = table.Column<int>(type: "int", nullable: true),
                    language_id = table.Column<int>(type: "int", nullable: true),
                    keywords = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    summary = table.Column<string>(type: "nvarchar(max)", unicode: false, maxLength: 100, nullable: true),
                    author_id = table.Column<int>(type: "int", nullable: true),
                    coverpage = table.Column<string>(type: "varchar(max)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__books__490D1AE1AF8DBC0F", x => x.book_id);
                    table.ForeignKey(
                        name: "FK_Book_Author",
                        column: x => x.author_id,
                        principalTable: "author",
                        principalColumn: "author_id");
                    table.ForeignKey(
                        name: "FK__books__category___3C69FB99",
                        column: x => x.category_id,
                        principalTable: "category",
                        principalColumn: "category_id");
                    table.ForeignKey(
                        name: "FK__books__language___3D5E1FD2",
                        column: x => x.language_id,
                        principalTable: "languages",
                        principalColumn: "language_id");
                });

            migrationBuilder.CreateTable(
                name: "bookauthor",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    author_id = table.Column<int>(type: "int", nullable: true),
                    book_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__bookauth__3213E83F37F0C373", x => x.id);
                    table.ForeignKey(
                        name: "FK__bookautho__autho__4222D4EF",
                        column: x => x.author_id,
                        principalTable: "author",
                        principalColumn: "author_id");
                    table.ForeignKey(
                        name: "FK__bookautho__book___4316F928",
                        column: x => x.book_id,
                        principalTable: "books",
                        principalColumn: "book_id");
                });

            migrationBuilder.CreateTable(
                name: "bookreview",
                columns: table => new
                {
                    review_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userid = table.Column<int>(type: "int", nullable: true),
                    book_id = table.Column<int>(type: "int", nullable: true),
                    review = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    rating = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__bookrevi__60883D9064AE9796", x => x.review_id);
                    table.ForeignKey(
                        name: "FK__bookrevie__book___571DF1D5",
                        column: x => x.book_id,
                        principalTable: "books",
                        principalColumn: "book_id");
                    table.ForeignKey(
                        name: "FK__bookrevie__useri__5629CD9C",
                        column: x => x.userid,
                        principalTable: "users",
                        principalColumn: "userid");
                });

            migrationBuilder.CreateTable(
                name: "copies",
                columns: table => new
                {
                    copy_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    book_id = table.Column<int>(type: "int", nullable: true),
                    is_available = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__copies__3C21D2D2D4AE87BC", x => x.copy_id);
                    table.ForeignKey(
                        name: "FK__copies__book_id__45F365D3",
                        column: x => x.book_id,
                        principalTable: "books",
                        principalColumn: "book_id");
                });

            migrationBuilder.CreateTable(
                name: "reservation",
                columns: table => new
                {
                    reservation_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userid = table.Column<int>(type: "int", nullable: true),
                    book_id = table.Column<int>(type: "int", nullable: true),
                    from_date = table.Column<DateOnly>(type: "date", nullable: false),
                    to_date = table.Column<DateOnly>(type: "date", nullable: false),
                    is_reserved = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "requested")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__reservat__31384C2929C69BB5", x => x.reservation_id);
                    table.ForeignKey(
                        name: "FK__reservati__book___5165187F",
                        column: x => x.book_id,
                        principalTable: "books",
                        principalColumn: "book_id");
                    table.ForeignKey(
                        name: "FK__reservati__useri__5070F446",
                        column: x => x.userid,
                        principalTable: "users",
                        principalColumn: "userid");
                });

            migrationBuilder.CreateTable(
                name: "loan",
                columns: table => new
                {
                    loan_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userid = table.Column<int>(type: "int", nullable: true),
                    copy_id = table.Column<int>(type: "int", nullable: true),
                    expiry_date = table.Column<DateOnly>(type: "date", nullable: false),
                    date_of_purchase = table.Column<DateOnly>(type: "date", nullable: false),
                    date_of_return = table.Column<DateOnly>(type: "date", nullable: true),
                    is_returned = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__loan__A1F79554E523197B", x => x.loan_id);
                    table.ForeignKey(
                        name: "FK__loan__copy_id__4D94879B",
                        column: x => x.copy_id,
                        principalTable: "copies",
                        principalColumn: "copy_id");
                    table.ForeignKey(
                        name: "FK__loan__userid__4CA06362",
                        column: x => x.userid,
                        principalTable: "users",
                        principalColumn: "userid");
                });

            migrationBuilder.CreateTable(
                name: "fine",
                columns: table => new
                {
                    fine_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    loan_id = table.Column<int>(type: "int", nullable: true),
                    amount = table.Column<double>(type: "float", nullable: true),
                    is_paid = table.Column<string>(type: "varchar(3)", unicode: false, maxLength: 3, nullable: true, defaultValue: "yes"),
                    due_date = table.Column<DateOnly>(type: "date", nullable: true),
                    paid_amount = table.Column<double>(type: "float", nullable: true),
                    paid_date = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__fine__F3C688D192121BA5", x => x.fine_id);
                    table.ForeignKey(
                        name: "FK__fine__loan_id__59FA5E80",
                        column: x => x.loan_id,
                        principalTable: "loan",
                        principalColumn: "loan_id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_bookauthor_author_id",
                table: "bookauthor",
                column: "author_id");

            migrationBuilder.CreateIndex(
                name: "IX_bookauthor_book_id",
                table: "bookauthor",
                column: "book_id");

            migrationBuilder.CreateIndex(
                name: "IX_bookreview_book_id",
                table: "bookreview",
                column: "book_id");

            migrationBuilder.CreateIndex(
                name: "IX_bookreview_userid",
                table: "bookreview",
                column: "userid");

            migrationBuilder.CreateIndex(
                name: "IX_books_author_id",
                table: "books",
                column: "author_id");

            migrationBuilder.CreateIndex(
                name: "IX_books_category_id",
                table: "books",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_books_language_id",
                table: "books",
                column: "language_id");

            migrationBuilder.CreateIndex(
                name: "IX_copies_book_id",
                table: "copies",
                column: "book_id");

            migrationBuilder.CreateIndex(
                name: "IX_fine_loan_id",
                table: "fine",
                column: "loan_id");

            migrationBuilder.CreateIndex(
                name: "IX_loan_copy_id",
                table: "loan",
                column: "copy_id");

            migrationBuilder.CreateIndex(
                name: "IX_loan_userid",
                table: "loan",
                column: "userid");

            migrationBuilder.CreateIndex(
                name: "IX_reservation_book_id",
                table: "reservation",
                column: "book_id");

            migrationBuilder.CreateIndex(
                name: "IX_reservation_userid",
                table: "reservation",
                column: "userid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bookauthor");

            migrationBuilder.DropTable(
                name: "bookreview");

            migrationBuilder.DropTable(
                name: "fine");

            migrationBuilder.DropTable(
                name: "reservation");

            migrationBuilder.DropTable(
                name: "loan");

            migrationBuilder.DropTable(
                name: "copies");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "books");

            migrationBuilder.DropTable(
                name: "author");

            migrationBuilder.DropTable(
                name: "category");

            migrationBuilder.DropTable(
                name: "languages");
        }
    }
}
