using Inventory.Core.Contracts;
using Inventory.Core.Services;
using Inventory.Core.Repositories;
using Inventory.Core.Collections;
using Inventory.Core.Entities;
using Inventory.Import.Services;
using Inventory.WebUI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register application services
builder.Services.AddSingleton<IGenericRepository<Product, int>>(provider => 
    new GenericRepository<Product, int>(p => p.Id));
var csvService = new CsvService<Product, int>(p => p.Id, new ProductCsvMap());
builder.Services.AddSingleton<ICsvService<Product, int>>(provider => csvService);
builder.Services.AddSingleton<ICsvImportService<Product>>(provider => csvService);
builder.Services.AddSingleton<IProductService, ProductService>();

// Register import services
builder.Services.AddSingleton<IImportService, ImportService>();

// Register initialization service
builder.Services.AddSingleton<IDataInitializationService, DataInitializationService>();

// Register dashboard services
builder.Services.AddSingleton<InventoryCollection<Product>>(provider => 
    new InventoryCollection<Product>());
builder.Services.AddSingleton<IDashboardService, DashboardService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// Initialize sample data on startup
using (var scope = app.Services.CreateScope())
{
    var dataInitializer = scope.ServiceProvider.GetRequiredService<IDataInitializationService>();
    await dataInitializer.InitializeAsync();
}

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
