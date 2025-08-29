using Microsoft.AspNetCore.Mvc;
using Inventory.Core.Services;
using Inventory.Core.Entities;
using Inventory.WebUI.Models;

namespace Inventory.WebUI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService ?? throw new ArgumentNullException(nameof(dashboardService));
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<object>>> GetDashboard()
    {
        var metrics = await _dashboardService.GetDashboardMetricsAsync();
        var categoryAnalytics = await _dashboardService.GetCategoryAnalyticsAsync();
        var locationAnalytics = await _dashboardService.GetLocationAnalyticsAsync();
        var valueTrend = await _dashboardService.GetValueTrendAsync(30);

        var dashboard = new
        {
            TotalProducts = metrics.TotalProducts,
            LowStockItems = metrics.LowStockCount,
            OutOfStockItems = metrics.OutOfStockCount,
            TotalValue = metrics.TotalValue,
            CategoryData = categoryAnalytics.Select(c => new { Category = c.Name, Count = c.ProductCount }),
            StatusData = new[]
            {
                new { Status = "In Stock", Count = metrics.TotalProducts - metrics.LowStockCount - metrics.OutOfStockCount },
                new { Status = "Low Stock", Count = metrics.LowStockCount },
                new { Status = "Out of Stock", Count = metrics.OutOfStockCount },
                new { Status = "Overstocked", Count = metrics.OverstockedCount }
            },
            MonthlyTrends = valueTrend.Select(t => new { Month = t.Key.ToString("MMM"), Value = t.Value }).ToArray()
        };

        return Ok(new ApiResponse<object>(dashboard, "Dashboard data retrieved successfully"));
    }
    [HttpGet("metrics")]
    public async Task<ActionResult<ApiResponse<DashboardMetrics>>> GetMetrics()
    {
        var metrics = await _dashboardService.GetDashboardMetricsAsync();
        return Ok(new ApiResponse<DashboardMetrics>(metrics, "Metrics retrieved successfully"));
    }

  
    [HttpGet("analytics/categories")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CategoryAnalytics>>>> GetCategoryAnalytics()
    {
        var analytics = await _dashboardService.GetCategoryAnalyticsAsync();
        return Ok(new ApiResponse<IEnumerable<CategoryAnalytics>>(analytics, "Category analytics retrieved"));
    }

    [HttpGet("analytics/locations")]
    public async Task<ActionResult<ApiResponse<IEnumerable<LocationAnalytics>>>> GetLocationAnalytics()
    {
        var analytics = await _dashboardService.GetLocationAnalyticsAsync();
        return Ok(new ApiResponse<IEnumerable<LocationAnalytics>>(analytics, "Location analytics retrieved"));
    }

    [HttpGet("trends/value")]
    public async Task<ActionResult<ApiResponse<Dictionary<DateTime, decimal>>>> GetValueTrend([FromQuery] int days = 30)
    {
        var trend = await _dashboardService.GetValueTrendAsync(days);
        return Ok(new ApiResponse<Dictionary<DateTime, decimal>>(trend, $"Value trend for {days} days retrieved"));
    }

    [HttpGet("alerts/restock")]
    public async Task<ActionResult<ApiResponse<IEnumerable<Product>>>> GetRestockAlerts()
    {
        var alerts = await _dashboardService.GetRestockAlertsAsync();
        return Ok(new ApiResponse<IEnumerable<Product>>(alerts, "Restock alerts retrieved"));
    }

    [HttpGet("stats/summary")]
    public async Task<ActionResult<ApiResponse<object>>> GetSummaryStats()
    {
        var metrics = await _dashboardService.GetDashboardMetricsAsync();
        
        var summary = new
        {
            TotalProducts = metrics.TotalProducts,
            TotalValue = metrics.TotalValue,
            HealthScore = CalculateHealthScore(metrics),
            Alerts = new
            {
                LowStock = metrics.LowStockCount,
                OutOfStock = metrics.OutOfStockCount,
                Overstocked = metrics.OverstockedCount
            },
            Performance = new
            {
                ProfitMargin = metrics.AverageProfitMargin,
                StockTurnover = metrics.MonthlyStockTurnover
            }
        };

        return Ok(new ApiResponse<object>(summary, "Summary statistics retrieved"));
    }

    private double CalculateHealthScore(DashboardMetrics metrics)
    {
        if (metrics.TotalProducts == 0) return 0;

        var stockIssues = metrics.LowStockCount + metrics.OutOfStockCount + metrics.OverstockedCount;
        var healthPercentage = Math.Max(0, 100 - (double)stockIssues / metrics.TotalProducts * 100);
        
        return Math.Round(healthPercentage, 1);
    }
}

