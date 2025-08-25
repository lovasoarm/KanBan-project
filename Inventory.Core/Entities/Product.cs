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
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal Cost { get; set; }
    public int Quantity { get; set; }
    public int MinQuantity { get; set; }
    public int MaxQuantity { get; set; }
    public string Category { get; set; } = string.Empty;
    public string SubCategory { get; set; } = string.Empty;
    public string Supplier { get; set; } = string.Empty;
    public string SupplierCode { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Warehouse { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public string Unit { get; set; } = "pcs";
    public decimal Weight { get; set; }
    public string WeightUnit { get; set; } = "kg";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? LastRestockedAt { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Global2025
    public string CountryOfOrigin { get; set; } = string.Empty;
    public string ManufacturerCode { get; set; } = string.Empty;
    public string HSCode { get; set; } = string.Empty;
    public decimal TaxRate { get; set; }
    public string CurrencyCode { get; set; } = "USD";
    public decimal LocalPrice { get; set; }
    public string LocalCurrencyCode { get; set; } = string.Empty;
    public decimal ExchangeRate { get; set; } = 1.0m;
    public string Certification { get; set; } = string.Empty;
    public bool IsEcoFriendly { get; set; }
    public bool IsHazardous { get; set; }
    public string StorageRequirements { get; set; } = string.Empty;
    public DateTime? ExpiryDate { get; set; }
    public int LeadTimeDays { get; set; }
    public decimal CO2Footprint { get; set; }
    public string SustainabilityScore { get; set; } = string.Empty;

    // Calculées
    public bool IsOutOfStock => Quantity == 0;
    public bool IsLowStock => Quantity <= MinQuantity && Quantity > 0;
    public bool IsOverstocked => Quantity > MaxQuantity;
    public decimal TotalValue => Price * Quantity;
    public decimal ProfitMargin => Price > 0 ? ((Price - Cost) / Price) * 100 : 0;
    public ProductStatus Status => CalculateStatus();
    public int DaysWithoutRestock => LastRestockedAt?.Date == null ? 0 : (DateTime.UtcNow.Date - LastRestockedAt.Value.Date).Days;

    // Calculé
    private ProductStatus CalculateStatus()
    {
        if (!IsActive) return ProductStatus.Discontinued;
        if (IsOutOfStock) return ProductStatus.OutOfStock;
        if (IsLowStock) return ProductStatus.LowStock;
        if (IsOverstocked) return ProductStatus.Overstocked;
        return ProductStatus.Available;
    }

    // Mise à jour quantité
    public void UpdateQuantity(int newQuantity)
    {
        var previousQuantity = Quantity;
        Quantity = Math.Max(0, newQuantity);
        UpdatedAt = DateTime.UtcNow;
        
        if (newQuantity > previousQuantity)
            LastRestockedAt = DateTime.UtcNow;
    }

    // Ajustement stock
    public void AdjustStock(int adjustment) => UpdateQuantity(Quantity + adjustment);

    // Activation/désactivation
    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    // Vérifications
    public bool NeedsRestock() => IsLowStock || IsOutOfStock;
    public bool NeedsAttention() => NeedsRestock() || IsOverstocked || !IsActive;
}

public class ProductCsvMap : ClassMap<Product>
{
    public ProductCsvMap()
    {
        Map(m => m.Id).Name("ID");
        Map(m => m.Name).Name("Name");
        Map(m => m.SKU).Name("SKU");
        Map(m => m.Description).Name("Description");
        Map(m => m.Brand).Name("Brand");
        Map(m => m.Model).Name("Model");
        Map(m => m.Price).Name("Price");
        Map(m => m.Cost).Name("Cost");
        Map(m => m.Quantity).Name("Quantity");
        Map(m => m.MinQuantity).Name("MinQuantity");
        Map(m => m.MaxQuantity).Name("MaxQuantity");
        Map(m => m.Category).Name("Category");
        Map(m => m.SubCategory).Name("SubCategory");
        Map(m => m.Supplier).Name("Supplier");
        Map(m => m.SupplierCode).Name("SupplierCode");
        Map(m => m.Location).Name("Location");
        Map(m => m.Warehouse).Name("Warehouse");
        Map(m => m.Barcode).Name("Barcode");
        Map(m => m.Unit).Name("Unit");
        Map(m => m.Weight).Name("Weight");
        Map(m => m.WeightUnit).Name("WeightUnit");
        Map(m => m.IsActive).Name("IsActive");
        
        // Global2025Fields
        Map(m => m.CountryOfOrigin).Name("CountryOfOrigin");
        Map(m => m.ManufacturerCode).Name("ManufacturerCode");
        Map(m => m.HSCode).Name("HSCode");
        Map(m => m.TaxRate).Name("TaxRate");
        Map(m => m.CurrencyCode).Name("CurrencyCode");
        Map(m => m.LocalPrice).Name("LocalPrice");
        Map(m => m.LocalCurrencyCode).Name("LocalCurrencyCode");
        Map(m => m.ExchangeRate).Name("ExchangeRate");
        Map(m => m.Certification).Name("Certification");
        Map(m => m.IsEcoFriendly).Name("IsEcoFriendly");
        Map(m => m.IsHazardous).Name("IsHazardous");
        Map(m => m.StorageRequirements).Name("StorageRequirements");
        Map(m => m.ExpiryDate).Name("ExpiryDate");
        Map(m => m.LeadTimeDays).Name("LeadTimeDays");
        Map(m => m.CO2Footprint).Name("CO2Footprint");
        Map(m => m.SustainabilityScore).Name("SustainabilityScore");
    }
}
