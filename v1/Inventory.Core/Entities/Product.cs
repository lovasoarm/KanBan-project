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

    // Mise à jour du quantité
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

// Pour Global Product Inventory Dataset 2025
public class ProductCsvMap : ClassMap<Product>
{
    private static int _idCounter = 0;
    
    public ProductCsvMap()
    {
        // Mapping basé sur le CSV réel
        Map(m => m.SKU).Name("Product ID");
        Map(m => m.Name).Name("Product Name");
        Map(m => m.Category).Name("Product Category");
        Map(m => m.Description).Name("Product Description");
        Map(m => m.Price).Name("Price");
        Map(m => m.Quantity).Name("Stock Quantity");
        Map(m => m.LeadTimeDays).Name("Warranty Period");
        Map(m => m.StorageRequirements).Name("Product Dimensions");
        Map(m => m.CreatedAt).Name("Manufacturing Date");
        Map(m => m.ExpiryDate).Name("Expiration Date");
        Map(m => m.Barcode).Name("SKU");
        Map(m => m.SubCategory).Name("Product Tags");
        Map(m => m.Model).Name("Color/Size Variations");
        
  
        Map(m => m.Id).Convert(args => System.Threading.Interlocked.Increment(ref _idCounter));
        
     
        Map(m => m.SustainabilityScore).Name("Product Ratings");
    
        Map(m => m.Cost).Convert(args => 
        {
            if (decimal.TryParse(args.Row.GetField("Price"), out var price))
                return price * 0.7m; 
            return 0m;
        });
        
        Map(m => m.MinQuantity).Convert(args => 
        {
            if (int.TryParse(args.Row.GetField("Stock Quantity"), out var qty))
                return Math.Max(1, qty / 5); 
            return 1;
        });
        
        Map(m => m.MaxQuantity).Convert(args => 
        {
            if (int.TryParse(args.Row.GetField("Stock Quantity"), out var qty))
                return qty * 3;
            return 100;
        });
        

        Map(m => m.Location).Convert(args => 
        {
            var category = args.Row.GetField("Product Category");
            return category?.ToLower() switch
            {
                "electronics" => "Electronics Warehouse",
                "clothing" => "Fashion Center",
                "home appliances" => "Home & Garden Storage",
                _ => "General Warehouse"
            };
        });
        
        Map(m => m.Supplier).Convert(args => 
        {
            var category = args.Row.GetField("Product Category");
            return category?.ToLower() switch
            {
                "electronics" => "TechSupply Global",
                "clothing" => "Fashion Direct",
                "home appliances" => "HomeComfort Ltd",
                _ => "General Suppliers Inc"
            };
        });
        
     
        Map(m => m.IsActive).Convert(args => true);
        Map(m => m.TaxRate).Convert(args => 0.20m); 
    }
}
