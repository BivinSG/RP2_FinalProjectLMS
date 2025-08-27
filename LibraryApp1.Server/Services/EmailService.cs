    using LibraryApp1.Server.Interfaces.IServices;
    using System.Net;
    using System.Net.Mail;
    using System.Net.Mime;

    namespace LibraryApp1.Server.Services
    {
        public class EmailService : IEmailService
        {
            private readonly IConfiguration _config;
            public EmailService(IConfiguration config)
            {
                _config = config;
            }

            public void SendEmail(string to, string subject, string bodyText)
            {
                Task.Run(async () =>
                {
                    var smtpSection = _config.GetSection("Smtp");
                    string host = smtpSection["Host"]!;
                    int port = int.Parse(smtpSection["Port"]!);
                    string username = smtpSection["Username"]!;
                    string password = smtpSection["Password"]!;
                    string fromEmail = smtpSection["FromEmail"]!;

                    using (var client = new SmtpClient(host, port))
                    {
                        client.EnableSsl = true;
                        client.Credentials = new NetworkCredential(username, password);

                        var mail = new MailMessage(fromEmail, to)
                        {
                            Subject = subject,
                            IsBodyHtml = true
                        };

                        string imagePath = @"E:\Books Image\images.jpg";

                        // ✅ HTML template (subject → 2 line gap → body text)
                        string htmlTemplate = $@"
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1'>
      <title>{subject}</title>
    </head>
    <body style='margin:0;padding:0;background:#f6f7f9;font-family:Segoe UI, Arial, Helvetica, sans-serif;color:#222;'>
      <div style='max-width:640px;margin:20px auto;padding:24px;background:#ffffff;border:1px solid #e6e6e6;border-radius:10px;'>
    
        <!-- Subject -->
        <h2 style='margin:0;font-size:20px;line-height:1.4;color:#333;'>{subject}</h2>
        <div style='height:16px;'></div> <!-- two line spacing -->

        <!-- Body -->
        <div style='font-size:14px;line-height:1.6;margin-bottom:16px;white-space:pre-line;'>
          {bodyText}
        </div>

        <!-- Optional Image -->
        <div style='text-align:center;margin-top:20px;'>
          <img src='cid:BookCover'
               alt='Book cover'
               style='display:inline-block;width:200px;max-width:100%;height:auto;border-radius:6px;border:1px solid #eee;' />
        </div>
      </div>

      <div style='text-align:center;color:#7d8996;font-size:12px;margin:12px 0;'>
        Sent from LibraryApp
      </div>
    </body>
    </html>";

                        if (File.Exists(imagePath))
                        {
                            var htmlView = AlternateView.CreateAlternateViewFromString(
                                htmlTemplate, null, MediaTypeNames.Text.Html);

                            LinkedResource inlineImage = new LinkedResource(imagePath, MediaTypeNames.Image.Jpeg)
                            {
                                ContentId = "BookCover",
                                TransferEncoding = TransferEncoding.Base64
                            };

                            htmlView.LinkedResources.Add(inlineImage);
                            mail.AlternateViews.Add(htmlView);
                        }
                        else
                        {
                            mail.Body = $"{bodyText}\n\n(Image not found at {imagePath})";
                        }

                        await client.SendMailAsync(mail);
                    }
                });
            }
        }
    }
