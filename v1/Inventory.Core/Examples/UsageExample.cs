using Inventory.Core.Collections;
using Inventory.Core.Entities;
using Inventory.Core.Factories;
using Inventory.Core.Services;
using Inventory.Core.Enums;

namespace Inventory.Core.Examples;

public static class UsageExample
{
    public static async Task DemonstrateAdvancedFeaturesAsync()
    {
        var productService = ProductServiceFactory.CreateProductService();
        var inventory = new InventoryCollection<Product>();
        var dashboardService = new DashboardService(inventory, productService);
        
        await PopulateInventoryAsync(inventory);
        await DemonstrateAdvancedIndexersAsync(inventory);
        await DemonstrateDashboardFeaturesAsync(dashboardService);
        await DemonstrateCollectionQueriesAsync(inventory);
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

    // Indexeurs
    private static Task DemonstrateAdvancedIndexersAsync(InventoryCollection<Product> inventory)
    {
        // ID
        var product = inventory[1];
        
        // SKU
        var productsBySku = inventory["APPLE-001"];
        
        // Catégorie
        var electronicProducts = inventory["Electronics", true];
        
        // Location
        var storeProducts = inventory["Store Front", "location"];
        
        // Status
        var lowStockProducts = inventory[ProductStatus.LowStock];
        
        // Index
        var firstProduct = inventory[^1]; // Dernier
        var lastProduct = inventory[0];   // Premier
        
        // Range
        var firstFive = inventory[0..5];
        
        return Task.CompletedTask;
    }

    // Dashboard
    private static async Task DemonstrateDashboardFeaturesAsync(DashboardService dashboardService)
    {
        // Métriques
        var metrics = await dashboardService.GetDashboardMetricsAsync();
        Console.WriteLine($"Total Products: {metrics.TotalProducts}");
        Console.WriteLine($"Total Value: ${metrics.TotalValue:F2}");
        Console.WriteLine($"Health Score: {CalculateHealthScore(metrics)}%");
        
        // Analytiques
        var categoryAnalytics = await dashboardService.GetCategoryAnalyticsAsync();
        foreach (var category in categoryAnalytics.Take(3))
        {
            Console.WriteLine($"{category.Name}: {category.ProductCount} products, ${category.TotalValue:F2}");
        }
        
        // Alertes
        var alerts = await dashboardService.GetRestockAlertsAsync();
        Console.WriteLine($"Restock Alerts: {alerts.Count()}");
        
        // Tendances
        var trends = await dashboardService.GetValueTrendAsync(7);
        Console.WriteLine($"Value Trend (7 days): {trends.Count} data points");
    }

    // Requêtes
    private static Task DemonstrateCollectionQueriesAsync(InventoryCollection<Product> inventory)
    {
        // Filtres
        var lowStock = inventory.WhereLowStock();
        var outOfStock = inventory.WhereOutOfStock();
        var electronics = inventory.WhereCategory("Electronics");
        var storeItems = inventory.WhereLocation("Store Front");
        var needsRestock = inventory.WhereNeedsRestock();
        
        // Statistiques
        Console.WriteLine($"Total Inventory Value: ${inventory.TotalValue:F2}");
        Console.WriteLine($"Total Quantity: {inventory.TotalQuantity}");
        Console.WriteLine($"Low Stock Count: {lowStock.Count()}");
        Console.WriteLine($"Out of Stock Count: {outOfStock.Count()}");
        Console.WriteLine($"Electronics Count: {electronics.Count()}");
        
        return Task.CompletedTask;
    }

    // Population
    private static Task PopulateInventoryAsync(InventoryCollection<Product> inventory)
    {
        var products = CreateEnhancedSampleProducts();
        foreach (var product in products)
        {
            inventory.Add(product);
        }
        return Task.CompletedTask;
    }

    private static List<Product> CreateEnhancedSampleProducts()
    {
        return new List<Product>
        {
            new Product
            {
                Id = 1,
                Name = "MacBook Pro",
                SKU = "APPLE-001",
                Brand = "Apple",
                Model = "MacBook Pro 16",
                Price = 2499.99m,
                Cost = 1899.99m,
                Quantity = 15,
                MinQuantity = 5,
                MaxQuantity = 50,
                Category = "Electronics",
                SubCategory = "Computers",
                Location = "Store Front",
                Warehouse = "Main Warehouse",
                IsActive = true
            },
            new Product
            {
                Id = 2,
                Name = "iPhone 15 Pro",
                SKU = "APPLE-002",
                Brand = "Apple",
                Model = "iPhone 15 Pro",
                Price = 1199.99m,
                Cost = 899.99m,
                Quantity = 3,
                MinQuantity = 10,
                MaxQuantity = 100,
                Category = "Electronics",
                SubCategory = "Smartphones",
                Location = "Store Front",
                Warehouse = "Main Warehouse",
                IsActive = true
            },
            new Product
            {
                Id = 3,
                Name = "Nike Air Max",
                SKU = "NIKE-001",
                Brand = "Nike",
                Model = "Air Max 270",
                Price = 149.99m,
                Cost = 89.99m,
                Quantity = 250,
                MinQuantity = 20,
                MaxQuantity = 200,
                Category = "Fashion",
                SubCategory = "Footwear",
                Location = "Store Floor",
                Warehouse = "Apparel Warehouse",
                IsActive = true
            }
        };
    }

    private static double CalculateHealthScore(DashboardMetrics metrics)
    {
        if (metrics.TotalProducts == 0) return 0;
        var issues = metrics.LowStockCount + metrics.OutOfStockCount + metrics.OverstockedCount;
        return Math.Max(0, 100 - (double)issues / metrics.TotalProducts * 100);
    }
}
