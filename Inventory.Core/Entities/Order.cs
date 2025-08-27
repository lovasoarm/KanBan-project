using Inventory.Core.Contracts;
using Inventory.Core.Enums;

namespace Inventory.Core.Entities;

public class Order : IInventoryItem<int>, IStatusProvider<OrderStatus>
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public DateTime? DeliveryDate { get; set; }
    public DateTime? ExpectedDeliveryDate { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal DiscountAmount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public bool IsPaid { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string Notes { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public OrderType Type { get; set; } = OrderType.Sale;
    public string TrackingNumber { get; set; } = string.Empty;
    public string Supplier { get; set; } = string.Empty;
    public int Priority { get; set; } = 1;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true;

    // IInventoryItem properties
    private string _name = string.Empty;
    private string _description = string.Empty;
    private string _category = string.Empty;
    
    public string Name 
    { 
        get => string.IsNullOrEmpty(_name) ? $"Order {OrderNumber}" : _name;
        set => _name = value;
    }
    
    public string Description 
    { 
        get => string.IsNullOrEmpty(_description) ? $"Order for {CustomerName} - {TotalItems} items" : _description;
        set => _description = value;
    }
    
    public string Category 
    { 
        get => string.IsNullOrEmpty(_category) ? Type.ToString() : _category;
        set => _category = value;
    }

    // IValuable properties
    private decimal _price;
    private int _quantity;
    
    public decimal Price 
    { 
        get => _price > 0 ? _price : TotalAmount;
        set => _price = value;
    }
    
    public int Quantity 
    { 
        get => _quantity > 0 ? _quantity : TotalItems;
        set => _quantity = value;
    }
    public decimal TotalValue => TotalAmount;

    // Navigation properties
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    // Propriétés calculées
    public decimal SubTotal => TotalAmount - TaxAmount - ShippingCost + DiscountAmount;
    public decimal FinalAmount => TotalAmount;
    public int TotalItems => OrderItems?.Sum(oi => oi.Quantity) ?? 0;
    public bool IsOverdue => ExpectedDeliveryDate.HasValue && 
                             ExpectedDeliveryDate < DateTime.UtcNow && 
                             Status != OrderStatus.Delivered && 
                             Status != OrderStatus.Cancelled;
    public int DaysSinceOrder => (DateTime.UtcNow.Date - OrderDate.Date).Days;
    public bool RequiresAttention => IsOverdue || 
                                     (Status == OrderStatus.Pending && DaysSinceOrder > 3) ||
                                     (Status == OrderStatus.Processing && DaysSinceOrder > 7);

    // Méthodes
    public void UpdateStatus(OrderStatus newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;

        if (newStatus == OrderStatus.Delivered && !DeliveryDate.HasValue)
        {
            DeliveryDate = DateTime.UtcNow;
        }
    }

    public void AddItem(OrderItem item)
    {
        OrderItems.Add(item);
        RecalculateTotal();
    }

    public void RemoveItem(int productId)
    {
        var item = OrderItems.FirstOrDefault(oi => oi.ProductId == productId);
        if (item != null)
        {
            OrderItems.Remove(item);
            RecalculateTotal();
        }
    }

    private void RecalculateTotal()
    {
        var itemsTotal = OrderItems.Sum(oi => oi.LineTotal);
        TotalAmount = itemsTotal + TaxAmount + ShippingCost - DiscountAmount;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsPaid(string paymentMethod = "")
    {
        IsPaid = true;
        PaymentDate = DateTime.UtcNow;
        if (!string.IsNullOrEmpty(paymentMethod))
            PaymentMethod = paymentMethod;
        UpdatedAt = DateTime.UtcNow;
    }

    // IStockManagement methods
    public void UpdateQuantity(int newQuantity)
    {
        // For orders, this doesn't really apply, but we implement it for interface compliance
        UpdatedAt = DateTime.UtcNow;
    }

    public void AdjustStock(int adjustment)
    {
        // For orders, this doesn't really apply, but we implement it for interface compliance
        UpdatedAt = DateTime.UtcNow;
    }

    public bool NeedsRestock()
    {
        // Orders don't need restocking, but we implement it for interface compliance
        return false;
    }

}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public string ProductSKU { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public string Notes { get; set; } = string.Empty;

    // Navigation properties
    public virtual Order Order { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;

    // Propriétés calculées
    public decimal LineTotal => (UnitPrice * Quantity) - DiscountAmount;
    public decimal LineTotalWithoutDiscount => UnitPrice * Quantity;
    public decimal DiscountPercentage => LineTotalWithoutDiscount > 0 
        ? (DiscountAmount / LineTotalWithoutDiscount) * 100 
        : 0;
}

// Données de résumé pour le dashboard
public record OrderSummaryData(
    int TotalOrders,
    int PendingOrders,
    int ProcessingOrders,
    int DeliveredOrders,
    int CancelledOrders,
    decimal TotalRevenue,
    decimal AverageOrderValue,
    double AverageDeliveryTime,
    List<Order> RecentOrders,
    Dictionary<DateTime, int> OrdersByDate,
    Dictionary<DateTime, decimal> RevenueByDate,
    Dictionary<OrderStatus, int> OrdersByStatus,
    List<OrderTrendData> MonthlyTrends
);

public record OrderTrendData(
    string Period,
    int OrderedCount,
    int DeliveredCount,
    decimal Revenue,
    double DeliveryRate
);

public record OrderAnalytics(
    string Period,
    int TotalOrders,
    int DeliveredOrders,
    decimal Revenue,
    double ConversionRate,
    double AverageOrderValue
);
