namespace Inventory.Core.Enums;

public enum ProductStatus
{
    Available,
    LowStock,
    OutOfStock,
    Overstocked,
    Discontinued,
    Damaged
}

public enum ValidationLevel
{
    Error,
    Warning,
    Info
}

public enum OrderStatus
{
    Pending,
    Confirmed,
    Processing,
    Shipped,
    Delivered,
    Cancelled,
    Returned,
    Refunded,
    PartiallyFulfilled
}

public enum OrderType
{
    Sale,
    Purchase,
    Return,
    Exchange,
    Subscription,
    PreOrder
}

