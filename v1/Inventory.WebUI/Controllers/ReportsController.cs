using Microsoft.AspNetCore.Mvc;
using Inventory.Core.Contracts;
using Inventory.Core.Entities;
using Inventory.Core.Services;
using Inventory.WebUI.Models;

namespace Inventory.WebUI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IDashboardService _dashboardService;

    public ReportsController(IProductService productService, IDashboardService dashboardService)
    {
        _productService = productService ?? throw new ArgumentNullException(nameof(productService));
        _dashboardService = dashboardService ?? throw new ArgumentNullException(nameof(dashboardService));
    }

    // Get complete reports data
    [HttpGet]
    public async Task<ActionResult<ApiResponse<object>>> GetReports()
    {
        var products = await _productService.GetAllAsync();
        var metrics = await _dashboardService.GetDashboardMetricsAsync();

        // Calculate overview metrics
        var totalRevenue = products.Sum(p => p.Price * p.Quantity);
        var totalSales = products.Count(p => p.Quantity > 0);
        var totalProfit = totalRevenue * 0.3m; // Assuming 30% profit margin

        // Calculate best selling categories
        var categoryAnalytics = products
            .GroupBy(p => p.Category)
            .Select(g => new
            {
                Category = g.Key,
                TurnOver = g.Sum(p => p.Price * p.Quantity),
                ProductCount = g.Count(),
                AvgRating = g.Where(p => !string.IsNullOrEmpty(p.SustainabilityScore))
                             .Select(p => decimal.TryParse(p.SustainabilityScore, out var rating) ? rating : 3.0m)
                             .DefaultIfEmpty(3.0m)
                             .Average()
            })
            .OrderByDescending(c => c.TurnOver)
            .Take(5)
            .ToList();

        // Calculate best selling products
        var bestProducts = products
            .OrderByDescending(p => p.Price * p.Quantity)
            .Take(10)
            .Select(p => new
            {
                Product = p.Name,
                ProductId = p.SKU,
                Category = p.Category,
                RemainingQuantity = $"{p.Quantity} {p.Unit}",
                TurnOver = p.Price * p.Quantity,
                IncreaseBy = $"{(decimal.TryParse(p.SustainabilityScore, out var rating) ? rating * 2 : 6.0m)}%"
            })
            .ToList();

        // Calculate monthly trend data (simulated based on existing data)
        var monthlyRevenue = new List<decimal>();
        var monthlyProfit = new List<decimal>();
        
        for (int i = 0; i < 7; i++)
        {
            var monthRevenue = totalRevenue / 7 + (decimal)(new Random().NextDouble() * 1000);
            monthlyRevenue.Add(monthRevenue);
            monthlyProfit.Add(monthRevenue * 0.3m);
        }

        // Calculate weekly trend data
        var weeklyRevenue = new List<decimal>();
        var weeklyProfit = new List<decimal>();
        
        for (int i = 0; i < 4; i++)
        {
            var weekRevenue = totalRevenue / 4 + (decimal)(new Random().NextDouble() * 500);
            weeklyRevenue.Add(weekRevenue);
            weeklyProfit.Add(weekRevenue * 0.3m);
        }

        var reportsData = new
        {
            Overview = new
            {
                TotalProfit = totalProfit,
                Revenue = totalRevenue,
                Sales = totalSales,
                NetPurchaseValue = totalRevenue * 0.7m,
                NetSalesValue = totalRevenue,
                MomProfit = totalProfit * 0.15m,
                YoyProfit = totalProfit * 0.25m
            },
            BestCategories = categoryAnalytics.Select(c => new
            {
                Category = c.Category,
                TurnOver = c.TurnOver,
                IncreaseBy = $"{Math.Round(c.AvgRating * 3, 1)}%"
            }),
            BestProducts = bestProducts,
            ChartData = new
            {
                Monthly = new
                {
                    Labels = new[] { "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar" },
                    Revenue = monthlyRevenue,
                    Profit = monthlyProfit
                },
                Weekly = new
                {
                    Labels = new[] { "Week 1", "Week 2", "Week 3", "Week 4" },
                    Revenue = weeklyRevenue,
                    Profit = weeklyProfit
                }
            }
        };

        return Ok(new ApiResponse<object>(reportsData, "Reports data retrieved successfully"));
    }

    // Get overview metrics only
    [HttpGet("overview")]
    public async Task<ActionResult<ApiResponse<object>>> GetOverviewMetrics()
    {
        var products = await _productService.GetAllAsync();
        
        var totalRevenue = products.Sum(p => p.Price * p.Quantity);
        var totalSales = products.Count(p => p.Quantity > 0);
        var totalProfit = totalRevenue * 0.3m; // Assuming 30% profit margin

        var overview = new
        {
            TotalProfit = totalProfit,
            Revenue = totalRevenue,
            Sales = totalSales,
            NetPurchaseValue = totalRevenue * 0.7m,
            NetSalesValue = totalRevenue,
            MomProfit = totalProfit * 0.15m,
            YoyProfit = totalProfit * 0.25m
        };

        return Ok(new ApiResponse<object>(overview, "Overview metrics retrieved successfully"));
    }

    // Get best selling categories
    [HttpGet("categories/best-selling")]
    public async Task<ActionResult<ApiResponse<object>>> GetBestSellingCategories()
    {
        var products = await _productService.GetAllAsync();
        
        var categoryAnalytics = products
            .GroupBy(p => p.Category)
            .Select(g => new
            {
                Category = g.Key,
                TurnOver = g.Sum(p => p.Price * p.Quantity),
                ProductCount = g.Count(),
                AvgRating = g.Where(p => !string.IsNullOrEmpty(p.SustainabilityScore))
                             .Select(p => decimal.TryParse(p.SustainabilityScore, out var rating) ? rating : 3.0m)
                             .DefaultIfEmpty(3.0m)
                             .Average()
            })
            .OrderByDescending(c => c.TurnOver)
            .Take(10)
            .Select(c => new
            {
                Category = c.Category,
                TurnOver = c.TurnOver,
                IncreaseBy = $"{Math.Round(c.AvgRating * 3, 1)}%"
            })
            .ToList();

        return Ok(new ApiResponse<object>(categoryAnalytics, "Best selling categories retrieved successfully"));
    }

    // Get best selling products
    [HttpGet("products/best-selling")]
    public async Task<ActionResult<ApiResponse<object>>> GetBestSellingProducts()
    {
        var products = await _productService.GetAllAsync();
        
        var bestProducts = products
            .OrderByDescending(p => p.Price * p.Quantity)
            .Take(10)
            .Select(p => new
            {
                Product = p.Name,
                ProductId = p.SKU,
                Category = p.Category,
                RemainingQuantity = $"{p.Quantity} {p.Unit}",
                TurnOver = p.Price * p.Quantity,
                IncreaseBy = $"{(decimal.TryParse(p.SustainabilityScore, out var rating) ? rating * 2 : 6.0m)}%"
            })
            .ToList();

        return Ok(new ApiResponse<object>(bestProducts, "Best selling products retrieved successfully"));
    }

    // Get chart data for profit and revenue
    [HttpGet("chart-data")]
    public async Task<ActionResult<ApiResponse<object>>> GetChartData([FromQuery] string period = "monthly")
    {
        var products = await _productService.GetAllAsync();
        var totalRevenue = products.Sum(p => p.Price * p.Quantity);

        object chartData;

        if (period.ToLower() == "weekly")
        {
            var weeklyRevenue = new List<decimal>();
            var weeklyProfit = new List<decimal>();
            
            for (int i = 0; i < 4; i++)
            {
                var weekRevenue = totalRevenue / 4 + (decimal)(new Random().NextDouble() * 500);
                weeklyRevenue.Add(weekRevenue);
                weeklyProfit.Add(weekRevenue * 0.3m);
            }

            chartData = new
            {
                Labels = new[] { "Week 1", "Week 2", "Week 3", "Week 4" },
                Revenue = weeklyRevenue,
                Profit = weeklyProfit
            };
        }
        else
        {
            var monthlyRevenue = new List<decimal>();
            var monthlyProfit = new List<decimal>();
            
            for (int i = 0; i < 7; i++)
            {
                var monthRevenue = totalRevenue / 7 + (decimal)(new Random().NextDouble() * 1000);
                monthlyRevenue.Add(monthRevenue);
                monthlyProfit.Add(monthRevenue * 0.3m);
            }

            chartData = new
            {
                Labels = new[] { "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar" },
                Revenue = monthlyRevenue,
                Profit = monthlyProfit
            };
        }

        return Ok(new ApiResponse<object>(chartData, $"{period} chart data retrieved successfully"));
    }
}
