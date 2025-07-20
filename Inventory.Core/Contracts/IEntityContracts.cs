namespace Inventory.Core.Contracts;

public interface IIdentifiable<TKey> where TKey : notnull, IComparable<TKey>
{
    TKey Id { get; }
}

public interface ITrackable
{
    DateTime CreatedAt { get; set; }
    DateTime? UpdatedAt { get; set; }
}

public interface IValuable
{
    decimal Price { get; set; }
    int Quantity { get; set; }
    decimal TotalValue { get; }
}

public interface IStockManagement
{
    void UpdateQuantity(int newQuantity);
    void AdjustStock(int adjustment);
    bool NeedsRestock();
}

public interface IStatusProvider<TStatus> where TStatus : Enum
{
    TStatus Status { get; }
}

public interface IEntity<TKey> : IIdentifiable<TKey>, ITrackable
    where TKey : notnull, IComparable<TKey>
{
}

public interface IInventoryItem<TKey> : IEntity<TKey>, IValuable, IStockManagement
    where TKey : notnull, IComparable<TKey>
{
    string Name { get; set; }
    string Description { get; set; }
    string Category { get; set; }
}

public interface ICategorizable
{
    string Category { get; set; }
}

public interface ILocationTrackable
{
    string Location { get; set; }
}

public interface ISkuProvider
{
    string SKU { get; set; }
}
