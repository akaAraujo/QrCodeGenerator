using WhatsappQrApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IQrCodeService, QrCodeService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});

builder.WebHost.UseUrls("http://0.0.0.0:" + (Environment.GetEnvironmentVariable("PORT") ?? "8080"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");

app.MapControllers();

app.Run();