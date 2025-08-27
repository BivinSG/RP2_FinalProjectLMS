using LibraryApp1.Server.Data;
using LibraryApp1.Server.Interfaces.IRepositories;
using LibraryApp1.Server.Interfaces.IServices;
using LibraryApp1.Server.Models;
using LibraryApp1.Server.Repositories;
using LibraryApp1.Server.Services;
using LibraryApp1.Server.Settings;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace LibraryApp1.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.File(
                    "Logs/log-.txt",
                    rollingInterval: RollingInterval.Day,
                    outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
                )
                .CreateLogger();

            var builder = WebApplication.CreateBuilder(args);
            builder.Host.UseSerilog();


         //   builder.Services.AddTransient<IMailService, MailService>();

            builder.Services.AddEndpointsApiExplorer(); // Required for minimal APIs
            builder.Services.AddSwaggerGen();           // Adds Swagger generation

            // Add DbContext
            builder.Services.AddDbContext<DbsLibraryContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("https://localhost:59792", "http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials(); // Added this for better compatibility
                });
            });

            // Add MailSettings (binds appsettings.json -> MailSettings class)
            builder.Services.Configure<MailSettings>(
                builder.Configuration.GetSection("MailSettings")
            );

            // Add services
            builder.Services.AddScoped<IAuthorRepository, AuthorRepository>();
            builder.Services.AddScoped<IAuthorService, AuthorService>();
            builder.Services.AddScoped<IBookRepository, BookRepository>();
            builder.Services.AddScoped<IBookService, BookService>();
            builder.Services.AddScoped<IBookAuthorRepository, BookAuthorRepository>();
            builder.Services.AddScoped<IBookAuthorService, BookAuthorService>();
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<ILanguageRepository, LanguageRepository>();
            builder.Services.AddScoped<ILanguageService, LanguageService>();
            builder.Services.AddScoped<ICopyRepository, CopyRepository>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<ILoanService, LoanService>();
            builder.Services.AddScoped<ILoanRepository, LoanRepository>();
            builder.Services.AddScoped<IFineService, FineService>();
            builder.Services.AddScoped<IFineRepository, FineRepository>();
            builder.Services.AddScoped<IBookreviewService, BookreviewService>();
            builder.Services.AddScoped<IBookreviewRepository, BookreviewRepository>();
            builder.Services.AddControllers();
            builder.Services.AddOpenApi();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<IEmailService, EmailService>();



            var app = builder.Build();

            //Seedata
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<DbsLibraryContext>();
                DbSeeder.Seed(db); // <- Your seeding logic
            }

            app.UseDefaultFiles();
            app.MapStaticAssets();
            app.UseCors("AllowFrontend");
            app.UseAuthorization();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            //app.UseHttpsRedirection();

            app.MapControllers();
            //app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
