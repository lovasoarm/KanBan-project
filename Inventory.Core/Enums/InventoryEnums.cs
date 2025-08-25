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

public enum ImportStatus
{
    Pending,
    InProgress,
    Completed,
    Failed,
    PartialSuccess
}

public enum ValidationLevel
{
    Error,
    Warning,
    Info
}

public enum OperationType
{
    Create,
    Update,
    Delete,
    Import,
    Export
}

public enum StockMovementType
{
    Inbound,
    Outbound,
    Adjustment,
    Transfer,
    Damaged,
    Lost
}
