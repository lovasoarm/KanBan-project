using Inventory.Core.Contracts;
using Inventory.Core.Entities;
using Inventory.Core.Services;
using Inventory.Import.Services;

namespace Inventory.WebUI.Services;

public interface IDataInitializationService
{
    Task InitializeAsync();
}

public class DataInitializationService : IDataInitializationService
{
    private readonly IProductService _productService;
    private readonly IImportService _importService;
    private readonly ILogger<DataInitializationService> _logger;

    public DataInitializationService(
        IProductService productService, 
        IImportService importService,
        ILogger<DataInitializationService> logger)
    {
        _productService = productService;
        _importService = importService;
        _logger = logger;
    }

    public async Task InitializeAsync()
    {
        try
        {
            var existingProducts = await _productService.GetAllAsync();
            if (existingProducts.Any())
            {
                _logger.LogInformation("Database already contains {Count} products. Skipping initialization.", existingProducts.Count());
                return;
            }

            _logger.LogInformation("Initializing database with sample data...");

            var csvFilePath = Path.Combine(Directory.GetCurrentDirectory(), "import", "products.csv");
            
            if (!File.Exists(csvFilePath))
            {
                _logger.LogWarning("Sample data file not found at {Path}. Creating sample products manually.", csvFilePath);
                await CreateSampleProductsAsync();
                return;
            }

            using var stream = File.OpenRead(csvFilePath);
            var result = await _importService.ImportFromStreamAsync(stream);
            
            _logger.LogInformation("Successfully imported {SuccessCount} products. {ErrorCount} errors occurred.", 
                result.SuccessCount, result.Errors.Count);

            if (result.Errors.Any())
            {
                _logger.LogWarning("Import errors: {Errors}", string.Join(", ", result.Errors.Take(5)));
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during data initialization");
            
            try
            {
                await CreateSampleProductsAsync();
            }
            catch (Exception innerEx)
            {
                _logger.LogError(innerEx, "Failed to create sample products as fallback");
            }
        }
    }

    private async Task CreateSampleProductsAsync()
    {
        _logger.LogInformation("Creating sample products manually...");

        var sampleProducts = new[]
        {
            new Product
            {
                Name = "Laptop Dell XPS 13",
                SKU = "DELL001",
                Description = "13-inch ultrabook with Intel Core i7",
                Price = 1299.99m,
                Quantity = 25,
                MinQuantity = 5,
                Category = "Electronics",
                Brand = "Dell",
                ExpiryDate = DateTime.Now.AddYears(3),
                IsActive = true
            },
            new Product
            {
                Name = "iPhone 15 Pro",
                SKU = "APPLE001",
                Description = "Latest iPhone with A17 Pro chip",
                Price = 999.99m,
                Quantity = 15,
                MinQuantity = 3,
                Category = "Electronics",
                Brand = "Apple",
                ExpiryDate = DateTime.Now.AddYears(2),
                IsActive = true
            },
            new Product
            {
                Name = "Samsung 4K Monitor",
                SKU = "SAM001",
                Description = "27-inch 4K UHD monitor",
                Price = 349.99m,
                Quantity = 8,
                MinQuantity = 2,
                Category = "Electronics",
                Brand = "Samsung",
                ExpiryDate = DateTime.Now.AddYears(5),
                IsActive = true
            },
            new Product
            {
                Name = "Sony WH-1000XM5",
                SKU = "SONY001",
                Description = "Wireless noise-canceling headphones",
                Price = 299.99m,
                Quantity = 12,
                MinQuantity = 5,
                Category = "Electronics",
                Brand = "Sony",
                ExpiryDate = DateTime.Now.AddYears(2),
                IsActive = true
            },
            new Product
            {
                Name = "Office Chair",
                SKU = "CHAIR001",
                Description = "Ergonomic office chair with lumbar support",
                Price = 199.99m,
                Quantity = 2,
                MinQuantity = 5,
                Category = "Furniture",
                Brand = "Generic",
                ExpiryDate = DateTime.Now.AddYears(10),
                IsActive = true
            },
            new Product
            {
                Name = "Mechanical Keyboard",
                SKU = "KB001",
                Description = "RGB mechanical gaming keyboard",
                Price = 129.99m,
                Quantity = 0,
                MinQuantity = 3,
                Category = "Electronics",
                Brand = "Corsair",
                ExpiryDate = DateTime.Now.AddYears(3),
                IsActive = true
            },
            new Product
            {
                Name = "Wireless Mouse",
                SKU = "MOUSE001",
                Description = "Wireless optical mouse",
                Price = 49.99m,
                Quantity = 30,
                MinQuantity = 10,
                Category = "Electronics",
                Brand = "Logitech",
                ExpiryDate = DateTime.Now.AddYears(2),
                IsActive = true
            },
            new Product
            {
                Name = "USB-C Hub",
                SKU = "HUB001",
                Description = "7-in-1 USB-C hub with HDMI",
                Price = 79.99m,
                Quantity = 18,
                MinQuantity = 8,
                Category = "Electronics",
                Brand = "Anker",
                ExpiryDate = DateTime.Now.AddYears(3),
                IsActive = true
            }
        };

        foreach (var product in sampleProducts)
        {
            await _productService.CreateAsync(product);
        }

        _logger.LogInformation("Successfully created {Count} sample products", sampleProducts.Length);
    }
}

