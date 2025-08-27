using Inventory.Core.Entities;
using Inventory.Core.Collections;
using Inventory.Core.Enums;
using System.Globalization;

namespace Inventory.Core.Services;

public interface IOrderService
{
    Task<IEnumerable<Order>> GetAllAsync();
    Task<Order?> GetByIdAsync(int id);
    Task<Order?> GetByOrderNumberAsync(string orderNumber);
    Task<Order> CreateAsync(Order order);
    Task<Order> UpdateAsync(Order order);
    Task<bool> DeleteAsync(int id);
    Task<OrderSummaryData> GetOrderSummaryAsync();
    Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status);
    Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Order>> GetRecentOrdersAsync(int count = 10);
    Task<IEnumerable<OrderTrendData>> GetMonthlyTrendsAsync(int months = 6);
    Task<Dictionary<DateTime, int>> GetOrdersByDateAsync(int days = 30);
    Task<Dictionary<DateTime, decimal>> GetRevenueByDateAsync(int days = 30);
}

public class OrderService : IOrderService
{
    private readonly GenericCollection<Order, int> _orders;
    private readonly IProductService _productService;

    public OrderService(IProductService productService)
    {
        _orders = new GenericCollection<Order, int>(o => o.Id);
        _productService = productService ?? throw new ArgumentNullException(nameof(productService));
        
        // Initialiser avec des données d'exemple
        InitializeSampleData();
    }

    public Task<IEnumerable<Order>> GetAllAsync()
    {
        return Task.FromResult(_orders.AsEnumerable());
    }

    public Task<Order?> GetByIdAsync(int id)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        return Task.FromResult(order);
    }

    public Task<Order?> GetByOrderNumberAsync(string orderNumber)
    {
        var order = _orders.FirstOrDefault(o => o.OrderNumber.Equals(orderNumber, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(order);
    }

    public Task<Order> CreateAsync(Order order)
    {
        if (order.Id == 0)
        {
            order.Id = _orders.Any() ? _orders.Max(o => o.Id) + 1 : 1;
        }

        if (string.IsNullOrEmpty(order.OrderNumber))
        {
            order.OrderNumber = GenerateOrderNumber();
        }

        _orders.Add(order);
        return Task.FromResult(order);
    }

    public Task<Order> UpdateAsync(Order order)
    {
        var existing = _orders.FirstOrDefault(o => o.Id == order.Id);
        if (existing != null)
        {
            var index = _orders.ToList().IndexOf(existing);
            _orders.Clear();
            var orders = _orders.ToList();
            orders[index] = order;
            
            foreach (var o in orders)
            {
                _orders.Add(o);
            }
        }
        return Task.FromResult(order);
    }

    public Task<bool> DeleteAsync(int id)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        if (order != null)
        {
            order.IsActive = false;
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public async Task<OrderSummaryData> GetOrderSummaryAsync()
    {
        var orders = await GetAllAsync();
        var activeOrders = orders.Where(o => o.IsActive).ToList();

        var totalOrders = activeOrders.Count;
        var pendingOrders = activeOrders.Count(o => o.Status == OrderStatus.Pending);
        var processingOrders = activeOrders.Count(o => o.Status == OrderStatus.Processing);
        var deliveredOrders = activeOrders.Count(o => o.Status == OrderStatus.Delivered);
        var cancelledOrders = activeOrders.Count(o => o.Status == OrderStatus.Cancelled);

        var totalRevenue = activeOrders.Where(o => o.Status != OrderStatus.Cancelled).Sum(o => o.TotalAmount);
        var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        var deliveredOrdersWithTimes = activeOrders
            .Where(o => o.Status == OrderStatus.Delivered && o.DeliveryDate.HasValue)
            .ToList();
        
        var averageDeliveryTime = deliveredOrdersWithTimes.Any()
            ? deliveredOrdersWithTimes.Average(o => (o.DeliveryDate!.Value - o.OrderDate).TotalDays)
            : 0;

        var recentOrders = activeOrders
            .OrderByDescending(o => o.OrderDate)
            .Take(10)
            .ToList();

        var ordersByDate = await GetOrdersByDateAsync(30);
        var revenueByDate = await GetRevenueByDateAsync(30);

        var ordersByStatus = Enum.GetValues<OrderStatus>()
            .ToDictionary(status => status, status => activeOrders.Count(o => o.Status == status));

        var monthlyTrends = await GetMonthlyTrendsAsync(6);

        return new OrderSummaryData(
            totalOrders,
            pendingOrders,
            processingOrders,
            deliveredOrders,
            cancelledOrders,
            totalRevenue,
            averageOrderValue,
            averageDeliveryTime,
            recentOrders,
            ordersByDate,
            revenueByDate,
            ordersByStatus,
            monthlyTrends.ToList()
        );
    }

    public Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status)
    {
        var orders = _orders.Where(o => o.Status == status && o.IsActive);
        return Task.FromResult(orders);
    }

    public Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        var orders = _orders.Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.IsActive);
        return Task.FromResult(orders);
    }

    public Task<IEnumerable<Order>> GetRecentOrdersAsync(int count = 10)
    {
        var orders = _orders
            .Where(o => o.IsActive)
            .OrderByDescending(o => o.OrderDate)
            .Take(count);
        return Task.FromResult(orders);
    }

    public Task<IEnumerable<OrderTrendData>> GetMonthlyTrendsAsync(int months = 6)
    {
        var trends = new List<OrderTrendData>();
        var now = DateTime.UtcNow;

        for (int i = months - 1; i >= 0; i--)
        {
            var month = now.AddMonths(-i);
            var startOfMonth = new DateTime(month.Year, month.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            var monthlyOrders = _orders
                .Where(o => o.OrderDate >= startOfMonth && o.OrderDate <= endOfMonth && o.IsActive)
                .ToList();

            var orderedCount = monthlyOrders.Count;
            var deliveredCount = monthlyOrders.Count(o => o.Status == OrderStatus.Delivered);
            var revenue = monthlyOrders.Where(o => o.Status != OrderStatus.Cancelled).Sum(o => o.TotalAmount);
            var deliveryRate = orderedCount > 0 ? (double)deliveredCount / orderedCount : 0;

            trends.Add(new OrderTrendData(
                startOfMonth.ToString("MMM yyyy", CultureInfo.InvariantCulture),
                orderedCount,
                deliveredCount,
                revenue,
                deliveryRate
            ));
        }

        return Task.FromResult(trends.AsEnumerable());
    }

    public Task<Dictionary<DateTime, int>> GetOrdersByDateAsync(int days = 30)
    {
        var result = new Dictionary<DateTime, int>();
        var startDate = DateTime.UtcNow.Date.AddDays(-days);

        for (int i = 0; i < days; i++)
        {
            var date = startDate.AddDays(i);
            var count = _orders.Count(o => o.OrderDate.Date == date && o.IsActive);
            result[date] = count;
        }

        return Task.FromResult(result);
    }

    public Task<Dictionary<DateTime, decimal>> GetRevenueByDateAsync(int days = 30)
    {
        var result = new Dictionary<DateTime, decimal>();
        var startDate = DateTime.UtcNow.Date.AddDays(-days);

        for (int i = 0; i < days; i++)
        {
            var date = startDate.AddDays(i);
            var revenue = _orders
                .Where(o => o.OrderDate.Date == date && o.IsActive && o.Status != OrderStatus.Cancelled)
                .Sum(o => o.TotalAmount);
            result[date] = revenue;
        }

        return Task.FromResult(result);
    }

    private string GenerateOrderNumber()
    {
        var prefix = "ORD";
        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd");
        var sequence = (_orders.Count + 1).ToString("D4");
        return $"{prefix}-{timestamp}-{sequence}";
    }

    private void InitializeSampleData()
    {
        var random = new Random();
        var statuses = Enum.GetValues<OrderStatus>();
        
        // Générer 100 commandes d'exemple sur les 6 derniers mois
        for (int i = 1; i <= 100; i++)
        {
            var orderDate = DateTime.UtcNow.AddDays(-random.Next(0, 180));
            var status = statuses[random.Next(statuses.Length)];
            
            var order = new Order
            {
                Id = i,
                OrderNumber = $"ORD-{orderDate:yyyyMMdd}-{i:D4}",
                OrderDate = orderDate,
                CustomerName = $"Customer {i}",
                CustomerEmail = $"customer{i}@example.com",
                TotalAmount = random.Next(50, 2000),
                Status = status,
                Type = OrderType.Sale,
                IsPaid = status == OrderStatus.Delivered || random.NextDouble() > 0.3,
                CreatedAt = orderDate
            };

            // Ajouter une date de livraison pour les commandes livrées
            if (status == OrderStatus.Delivered)
            {
                order.DeliveryDate = orderDate.AddDays(random.Next(1, 14));
                order.ExpectedDeliveryDate = orderDate.AddDays(random.Next(3, 10));
            }
            else if (status != OrderStatus.Cancelled && status != OrderStatus.Pending)
            {
                order.ExpectedDeliveryDate = orderDate.AddDays(random.Next(3, 10));
            }

            _orders.Add(order);
        }
    }
}
