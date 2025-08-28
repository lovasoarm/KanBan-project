using Inventory.Core.Entities;
using Inventory.Core.Collections;
using Inventory.Core.Enums;

namespace Inventory.Core.Services;

public record DashboardMetrics(
    int TotalProducts,
    decimal TotalValue,
    int LowStockCount,
    int OutOfStockCount,
    int OverstockedCount,
    decimal AverageProfitMargin,
    Dictionary<string, int> CategoryDistribution,
    Dictionary<ProductStatus, int> StatusDistribution,
    Dictionary<string, decimal> LocationValues,
    List<Product> TopValueProducts,
    List<Product> CriticalStockProducts,
    decimal MonthlyStockTurnover
);

public record CategoryAnalytics(
    string Name,
    int ProductCount,
    decimal TotalValue,
    decimal AveragePrice,
    int LowStockCount,
    decimal ProfitMargin
);

public record LocationAnalytics(
    string Name,
    int ProductCount,
    decimal TotalValue,
    int Capacity,
    double UtilizationRate
);

public interface IDashboardService
{
    Task<DashboardMetrics> GetDashboardMetricsAsync();
    Task<IEnumerable<CategoryAnalytics>> GetCategoryAnalyticsAsync();
    Task<IEnumerable<LocationAnalytics>> GetLocationAnalyticsAsync();
    Task<Dictionary<DateTime, decimal>> GetValueTrendAsync(int days = 30);
    Task<IEnumerable<Product>> GetRestockAlertsAsync();
}

public class DashboardService : IDashboardService
{
    private readonly InventoryCollection<Product> _inventory;
    private readonly IProductService _productService;

    public DashboardService(InventoryCollection<Product> inventory, IProductService productService)
    {
        _inventory = inventory ?? throw new ArgumentNullException(nameof(inventory));
        _productService = productService ?? throw new ArgumentNullException(nameof(productService));
    }

    // Métriques
    public async Task<DashboardMetrics> GetDashboardMetricsAsync()
    {
        var products = await _productService.GetAllAsync();
        await RefreshInventory(products);

        return new DashboardMetrics(
            TotalProducts: _inventory.Count,
            TotalValue: _inventory.TotalValue,
            LowStockCount: _inventory.WhereLowStock().Count(),
            OutOfStockCount: _inventory.WhereOutOfStock().Count(),
            OverstockedCount: _inventory.WhereStatus(ProductStatus.Overstocked).Count(),
            AverageProfitMargin: CalculateAverageProfitMargin(),
            CategoryDistribution: BuildCategoryDistribution(),
            StatusDistribution: BuildStatusDistribution(),
            LocationValues: BuildLocationValues(),
            TopValueProducts: GetTopValueProducts(10),
            CriticalStockProducts: GetCriticalStockProducts(),
            MonthlyStockTurnover: CalculateStockTurnover()
        );
    }

    // Analytiques
    public async Task<IEnumerable<CategoryAnalytics>> GetCategoryAnalyticsAsync()
    {
        var products = await _productService.GetAllAsync();
        await RefreshInventory(products);

        return products
            .GroupBy(p => p.Category)
            .Select(g => new CategoryAnalytics(
                Name: g.Key,
                ProductCount: g.Count(),
                TotalValue: g.Sum(p => p.TotalValue),
                AveragePrice: g.Average(p => p.Price),
                LowStockCount: g.Count(p => p.IsLowStock),
                ProfitMargin: g.Average(p => p.ProfitMargin)
            ))
            .OrderByDescending(c => c.TotalValue);
    }

    public async Task<IEnumerable<LocationAnalytics>> GetLocationAnalyticsAsync()
    {
        var products = await _productService.GetAllAsync();
        await RefreshInventory(products);

        return products
            .GroupBy(p => p.Location)
            .Select(g => new LocationAnalytics(
                Name: g.Key,
                ProductCount: g.Count(),
                TotalValue: g.Sum(p => p.TotalValue),
                Capacity: EstimateCapacity(g.Key),
                UtilizationRate: CalculateUtilization(g.Key, g.Count())
            ))
            .OrderByDescending(l => l.TotalValue);
    }

    // Tendances
    public async Task<Dictionary<DateTime, decimal>> GetValueTrendAsync(int days = 30)
    {
        var products = await _productService.GetAllAsync();
        var trend = new Dictionary<DateTime, decimal>();
        var today = DateTime.UtcNow.Date;

        for (int i = days; i >= 0; i--)
        {
            var date = today.AddDays(-i);
            var value = CalculateHistoricalValue(products, date);
            trend[date] = value;
        }

        return trend;
    }

    // Alertes
    public async Task<IEnumerable<Product>> GetRestockAlertsAsync()
    {
        var products = await _productService.GetAllAsync();
        await RefreshInventory(products);

        return _inventory
            .WhereNeedsRestock()
            .OrderBy(p => p.Quantity)
            .ThenByDescending(p => p.TotalValue);
    }

    // Privé
    private Task RefreshInventory(IEnumerable<Product> products)
    {
        _inventory.Clear();
        foreach (var product in products)
        {
            _inventory.Add(product);
        }
        return Task.CompletedTask;
    }

    private decimal CalculateAverageProfitMargin()
    {
        var margins = _inventory
            .Where(p => p.ProfitMargin > 0)
            .Select(p => p.ProfitMargin);
        
        return margins.Any() ? margins.Average() : 0;
    }

    private Dictionary<string, int> BuildCategoryDistribution()
    {
        return _inventory
            .GroupBy(p => p.Category)
            .ToDictionary(g => g.Key, g => g.Count());
    }

    private Dictionary<ProductStatus, int> BuildStatusDistribution()
    {
        return Enum.GetValues<ProductStatus>()
            .ToDictionary(status => status, status => _inventory.CountByStatus(status));
    }

    private Dictionary<string, decimal> BuildLocationValues()
    {
        return _inventory
            .GroupBy(p => p.Location)
            .ToDictionary(g => g.Key, g => g.Sum(p => p.TotalValue));
    }

    private List<Product> GetTopValueProducts(int count)
    {
        return _inventory
            .OrderByDescending(p => p.TotalValue)
            .Take(count)
            .ToList();
    }

    private List<Product> GetCriticalStockProducts()
    {
        return _inventory
            .Where(p => p.NeedsAttention())
            .OrderBy(p => p.Status)
            .ThenBy(p => p.Quantity)
            .ToList();
    }

    private decimal CalculateStockTurnover()
    {
        var activeProducts = _inventory.Where(p => p.IsActive);
        if (!activeProducts.Any()) return 0;

        return activeProducts.Average(p => p.DaysWithoutRestock > 0 ? 30m / p.DaysWithoutRestock : 0);
    }

    private decimal CalculateHistoricalValue(IEnumerable<Product> products, DateTime date)
    {
        return products
            .Where(p => p.CreatedAt.Date <= date)
            .Sum(p => p.TotalValue);
    }

    private int EstimateCapacity(string location)
    {
        return location.ToLower() switch
        {
            "warehouse" => 10000,
            "store" => 1000,
            "storage" => 5000,
            _ => 500
        };
    }

    private double CalculateUtilization(string location, int currentCount)
    {
        var capacity = EstimateCapacity(location);
        return capacity > 0 ? (double)currentCount / capacity * 100 : 0;
    }
}
