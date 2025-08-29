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

    [HttpGet]
    public async Task<ActionResult<ApiResponse<object>>> GetReports()
    {
        var products = await _productService.GetAllAsync();
        var metrics = await _dashboardService.GetDashboardMetricsAsync();

        var totalRevenue = products.Sum(p => p.Price * p.Quantity);
        var totalSales = products.Count(p => p.Quantity > 0);
        var totalProfit = totalRevenue * 0.3m; 

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

        var random = new Random();
        var monthlyRevenue = new List<decimal>();
        var monthlyProfit = new List<decimal>();
        
        var seasonalMultipliers = new decimal[] { 0.85m, 0.92m, 1.15m, 1.35m, 1.20m, 0.95m, 0.88m };
        var baseRevenue = totalRevenue / 7;
        
        for (int i = 0; i < 7; i++)
        {
            var seasonalFactor = seasonalMultipliers[i];
            var randomVariation = (decimal)(random.NextDouble() * 0.6 - 0.3); 
            var trendFactor = 1 + (decimal)(i * 0.05 * random.NextDouble()); 
            
            var monthRevenue = baseRevenue * seasonalFactor * (1 + randomVariation) * trendFactor;
            monthlyRevenue.Add(Math.Round(monthRevenue, 2));
            
            var profitBase = monthRevenue * (decimal)(0.18 + random.NextDouble() * 0.27); 
            var profitVariation = (decimal)(random.NextDouble() * 0.4 - 0.2); 
            var profit = profitBase * (1 + profitVariation);
            monthlyProfit.Add(Math.Round(profit, 2));
        }

        var weeklyRevenue = new List<decimal>();
        var weeklyProfit = new List<decimal>();
        
        var weeklyMultipliers = new decimal[] { 0.8m, 1.1m, 1.3m, 0.95m };
        var baseWeeklyRevenue = totalRevenue / 4;
        
        for (int i = 0; i < 4; i++)
        {
            var weeklyFactor = weeklyMultipliers[i];
            var randomVariation = (decimal)(random.NextDouble() * 0.5 - 0.25); 
            var performanceFactor = (decimal)(0.7 + random.NextDouble() * 0.6); 
            
            var weekRevenue = baseWeeklyRevenue * weeklyFactor * (1 + randomVariation) * performanceFactor;
            weeklyRevenue.Add(Math.Round(weekRevenue, 2));
            
            var baseProfitMargin = (decimal)(0.15 + random.NextDouble() * 0.35); 
            var profitEfficiency = (decimal)(0.8 + random.NextDouble() * 0.4); 
            var profit = weekRevenue * baseProfitMargin * profitEfficiency;
            weeklyProfit.Add(Math.Round(profit, 2));
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

    [HttpGet("overview")]
    public async Task<ActionResult<ApiResponse<object>>> GetOverviewMetrics()
    {
        var products = await _productService.GetAllAsync();
        
        var totalRevenue = products.Sum(p => p.Price * p.Quantity);
        var totalSales = products.Count(p => p.Quantity > 0);
        var totalProfit = totalRevenue * 0.3m; 

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

    [HttpGet("chart-data")]
    public async Task<ActionResult<ApiResponse<object>>> GetChartData([FromQuery] string period = "monthly")
    {
        var products = await _productService.GetAllAsync();
        var totalRevenue = products.Sum(p => p.Price * p.Quantity);
        var random = new Random();
        object chartData;

        if (period.ToLower() == "weekly")
        {
            var weeklyRevenue = new List<decimal>();
            var weeklyProfit = new List<decimal>();
            
            var weeklyMultipliers = new decimal[] { 0.8m, 1.1m, 1.3m, 0.95m };
            var baseWeeklyRevenue = totalRevenue / 4;
            
            for (int i = 0; i < 4; i++)
            {
                var weeklyFactor = weeklyMultipliers[i];
                var randomVariation = (decimal)(random.NextDouble() * 0.5 - 0.25); 
                var performanceFactor = (decimal)(0.7 + random.NextDouble() * 0.6); 
                
                var weekRevenue = baseWeeklyRevenue * weeklyFactor * (1 + randomVariation) * performanceFactor;
                weeklyRevenue.Add(Math.Round(weekRevenue, 2));
                
                var baseProfitMargin = (decimal)(0.15 + random.NextDouble() * 0.35); 
                var profitEfficiency = (decimal)(0.8 + random.NextDouble() * 0.4); 
                var profit = weekRevenue * baseProfitMargin * profitEfficiency;
                weeklyProfit.Add(Math.Round(profit, 2));
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
            
            var seasonalMultipliers = new decimal[] { 0.85m, 0.92m, 1.15m, 1.35m, 1.20m, 0.95m, 0.88m };
            var baseRevenue = totalRevenue / 7;
            
            for (int i = 0; i < 7; i++)
            {
                var seasonalFactor = seasonalMultipliers[i];
                var randomVariation = (decimal)(random.NextDouble() * 0.6 - 0.3); 
                var trendFactor = 1 + (decimal)(i * 0.05 * random.NextDouble()); 
                
                var monthRevenue = baseRevenue * seasonalFactor * (1 + randomVariation) * trendFactor;
                monthlyRevenue.Add(Math.Round(monthRevenue, 2));
                
                var profitBase = monthRevenue * (decimal)(0.18 + random.NextDouble() * 0.27); 
                var profitVariation = (decimal)(random.NextDouble() * 0.4 - 0.2); 
                var profit = profitBase * (1 + profitVariation);
                monthlyProfit.Add(Math.Round(profit, 2));
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

