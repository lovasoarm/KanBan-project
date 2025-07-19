using Inventory.Core.Collections;
using Inventory.Core.Entities;
using Inventory.Core.Factories;
using Inventory.Core.Services;

namespace Inventory.Core.Examples;

public static class UsageExample
{
    public static async Task DemonstrateArchitectureAsync()
    {
        var productService = ProductServiceFactory.CreateProductService();
        
        var sampleProducts = CreateSampleProducts();
        foreach (var product in sampleProducts)
        {
            await AddProductAsync(productService, product);
        }
        
        await DemonstrateIndexersAsync(sampleProducts);
        await DemonstrateCsvOperationsAsync();
        await DemonstrateQueryOperationsAsync(productService);
    }

    private static async Task AddProductAsync(IProductService service, Product product)
    {
        var repository = ProductServiceFactory.CreateProductRepository();
        await repository.AddAsync(product);
    }

    private static Task DemonstrateIndexersAsync(IGenericCollection<Product, int> products)
    {
        var productById = products[1];
        
        var productByIndex = products[0];
        
        // Note: Indexer is read-only, use Update method instead
        // products.Update(new Product { Id = 2, Name = "Updated Product" });
        
        return Task.CompletedTask;
    }

    private static async Task DemonstrateCsvOperationsAsync()
    {
        var csvService = ProductServiceFactory.CreateProductCsvService();
        var products = new GenericCollection<Product, int>(p => p.Id);
        
        products.Add(new Product { Id = 1, Name = "Test Product", Price = 10.00m });
        
        await csvService.ExportToCsvAsync(products, "products.csv");
    }

    private static async Task DemonstrateQueryOperationsAsync(IProductService service)
    {
        var lowStockProducts = await service.GetLowStockProductsAsync();
        
        var electronicsProducts = await service.GetProductsByCategoryAsync("Electronics");
        
        var product = await service.GetProductByIdAsync(1);
        
        if (product != null)
        {
            await service.UpdateStockAsync(product.Id, 100);
        }
    }

    private static IGenericCollection<Product, int> CreateSampleProducts()
    {
        var products = new GenericCollection<Product, int>(p => p.Id);
        
        products.Add(new Product
        {
            Id = 1,
            Name = "Laptop",
            SKU = "LAP001",
            Description = "Gaming laptop",
            Price = 999.99m,
            Quantity = 10,
            MinQuantity = 5,
            Category = "Electronics",
            Location = "A1"
        });
        
        products.Add(new Product
        {
            Id = 2,
            Name = "Mouse",
            SKU = "MSE001", 
            Description = "Wireless mouse",
            Price = 29.99m,
            Quantity = 2,
            MinQuantity = 10,
            Category = "Electronics",
            Location = "B2"
        });
        
        return products;
    }
}
