using Inventory.Core.Contracts;
using Inventory.Core.Services;
using Inventory.Core.Repositories;
using Inventory.Core.Collections;
using Inventory.Core.Entities;
using Inventory.Import.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register application services
builder.Services.AddScoped<IGenericRepository<Product, int>>(provider => 
    new GenericRepository<Product, int>(p => p.Id));
builder.Services.AddScoped<ICsvService<Product, int>>(provider => 
    new CsvService<Product, int>(p => p.Id, new ProductCsvMap()));
builder.Services.AddScoped<IProductService, ProductService>();
// Register dashboard services
builder.Services.AddSingleton<InventoryCollection<Product>>(provider => 
    new InventoryCollection<Product>());
builder.Services.AddScoped<IDashboardService, DashboardService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
