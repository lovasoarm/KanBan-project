using Inventory.Core.Contracts;
using Inventory.Core.Enums;
using CsvHelper.Configuration;

namespace Inventory.Core.Entities;

public class Product : IInventoryItem<int>, IStatusProvider<ProductStatus>, ISkuProvider, ILocationTrackable
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public int MinQuantity { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public bool IsOutOfStock => Quantity == 0;
    public bool IsLowStock => Quantity <= MinQuantity && Quantity > 0;
    public decimal TotalValue => Price * Quantity;
    public ProductStatus Status => DetermineStatus();

    private ProductStatus DetermineStatus()
    {
        if (IsOutOfStock) return ProductStatus.OutOfStock;
        if (IsLowStock) return ProductStatus.LowStock;
        return ProductStatus.Available;
    }

    public void UpdateQuantity(int newQuantity)
    {
        Quantity = Math.Max(0, newQuantity);
        UpdatedAt = DateTime.UtcNow;
    }

    public void AdjustStock(int adjustment)
    {
        UpdateQuantity(Quantity + adjustment);
    }

    public bool NeedsRestock() => IsLowStock || IsOutOfStock;
}

public class ProductCsvMap : ClassMap<Product>
{
    public ProductCsvMap()
    {
        Map(m => m.Id).Name("ID");
        Map(m => m.Name).Name("Product Name");
        Map(m => m.SKU).Name("SKU");
        Map(m => m.Description).Name("Description");
        Map(m => m.Price).Name("Price");
        Map(m => m.Quantity).Name("Quantity");
        Map(m => m.MinQuantity).Name("Min Quantity");
        Map(m => m.Category).Name("Category");
        Map(m => m.Location).Name("Location");
        Map(m => m.CreatedAt).Name("Created At");
        Map(m => m.UpdatedAt).Name("Updated At");
    }
}
