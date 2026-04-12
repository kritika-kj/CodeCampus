<<<<<<< HEAD
using Microsoft.EntityFrameworkCore;
using CodeCampus.Data;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
=======
var builder = WebApplication.CreateBuilder(args);
>>>>>>> d2f8a62f9794f42146d7dd76e975dbf574532772

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- 1. DEFINE THE CORS VIP PASS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Your exact React URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

// --- 2. ACTIVATE THE CORS VIP PASS ---
// CRITICAL: This must go BEFORE app.MapControllers()!
app.UseCors("AllowReactApp");

app.MapControllers();

app.Run();