using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using API.Models;
using CryptoApi.Models;
using CryptoApi.Repositories;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMySql("server=db-mysql-lon1-09773-do-user-16195469-0.c.db.ondigitalocean.com;port=25060;database=defaultdb;uid=doadmin;pwd=AVNS_gH_0fY3uABDefT4jW_6;sslmode=Required", 
        serverVersion: new MySqlServerVersion(new Version(8, 0, 30)));
});


builder.Services.AddScoped<AssetRepository>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<CryptoPortfolioRepository>();
builder.Services.AddScoped<CryptoTransactionRepository>();

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>(opt => 
    { 
        opt.Password.RequiredLength = 8; 
        opt.User.RequireUniqueEmail = true; 
        opt.Password.RequireNonAlphanumeric = false;
        opt.SignIn.RequireConfirmedEmail = false; 
    })
    .AddDefaultUI()
    .AddEntityFrameworkStores<ApplicationDbContext>();
// Add Swagger/OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CryptoApi", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseAuthorization();
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CryptoApi v1");
    });
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapIdentityApi<IdentityUser>();
app.MapControllers();

app.Run();