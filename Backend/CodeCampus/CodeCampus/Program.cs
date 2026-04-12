var builder = WebApplication.CreateBuilder(args);

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