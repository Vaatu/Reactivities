using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.Email;

public class EmailSender
{
    private readonly IConfiguration _configuration;
    public EmailSender(IConfiguration configuration)
    {
        _configuration = configuration;

    }

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var client = new SendGridClient(_configuration["SendGrid:Key"]);
        var message = new SendGridMessage
        {
            From = new EmailAddress("support@vaatu.dev", "Vaatu"),
            Subject = subject,
            HtmlContent = htmlMessage,
            PlainTextContent = htmlMessage
        };
        message.AddTo(new EmailAddress(email));
        message.SetClickTracking(false, false);
        Console.WriteLine(message.HtmlContent);
        await client.SendEmailAsync(message);
    }
}
