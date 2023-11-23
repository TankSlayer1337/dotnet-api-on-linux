using System.Security.Cryptography.X509Certificates;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (!builder.Environment.IsDevelopment())
{
    var certPemPath = "/etc/letsencrypt/live/weather.cloudchaotic.com/fullchain.pem";
    var keyPemPath = "/etc/letsencrypt/live/weather.cloudchaotic.com/privkey.pem";
    var certificate = X509Certificate2.CreateFromPemFile(certPemPath, keyPemPath);
    builder.WebHost.UseKestrel(options =>
    {
        options.ListenAnyIP(80);
        options.ListenAnyIP(443, listenOptions => listenOptions.UseHttps(certificate));
    });
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
