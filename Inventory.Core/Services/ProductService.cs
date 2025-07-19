using CsvHelper.Configuration;
using Inventory.Core.Collections;
using Inventory.Core.Contracts;
using Inventory.Core.Entities;
using Inventory.Core.Enums;
using Inventory.Core.Repositories;

namespace Inventory.Core.Services;

public interface IProductService
{
    Task<IGenericCollection<Product, int>> ImportProductsAsync(string csvFilePath);
    Task<Product?> GetProductByIdAsync(int id);
    Task<IGenericCollection<Product, int>> GetProductsByCategoryAsync(string category);
    Task<IGenericCollection<Product, int>> GetLowStockProductsAsync();
    Task<Product> UpdateStockAsync(int productId, int newQuantity);
    Task ExportProductsAsync(IGenericCollection<Product, int> products, string filePath);
}

public class ProductService : IProductService
{
    private readonly IGenericRepository<Product, int> _repository;
    private readonly CsvService<Product, int> _csvService;

    public ProductService(IGenericRepository<Product, int> repository)
    {
        _repository = repository;
        _csvService = new CsvService<Product, int>(p => p.Id, new ProductCsvMap());
    }

    public async Task<IGenericCollection<Product, int>> ImportProductsAsync(string csvFilePath)
    {
        var importedProducts = await _csvService.ImportFromCsvAsync<int>(csvFilePath);
        
        foreach (var product in importedProducts)
        {
            await _repository.AddAsync(product);
        }
        
        await _repository.SaveChangesAsync();
        return importedProducts;
    }

    public Task<Product?> GetProductByIdAsync(int id)
    {
        return _repository.GetByIdAsync(id);
    }

    public async Task<IGenericCollection<Product, int>> GetProductsByCategoryAsync(string category)
    {
        var allProducts = await _repository.GetAllAsync();
        var categoryProducts = new GenericCollection<Product, int>(p => p.Id);
        
        foreach (var product in allProducts.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase)))
        {
            categoryProducts.Add(product);
        }
        
        return categoryProducts;
    }

    public async Task<IGenericCollection<Product, int>> GetLowStockProductsAsync()
    {
        var allProducts = await _repository.GetAllAsync();
        var lowStockProducts = new GenericCollection<Product, int>(p => p.Id);
        
        foreach (var product in allProducts.Where(p => p.IsLowStock || p.IsOutOfStock))
        {
            lowStockProducts.Add(product);
        }
        
        return lowStockProducts;
    }

    public async Task<Product> UpdateStockAsync(int productId, int newQuantity)
    {
        var product = await _repository.GetByIdAsync(productId) 
                     ?? throw new KeyNotFoundException($"Product with ID {productId} not found");
        
        product.UpdateQuantity(newQuantity);
        var updatedProduct = await _repository.UpdateAsync(product);
        await _repository.SaveChangesAsync();
        
        return updatedProduct;
    }

    public Task ExportProductsAsync(IGenericCollection<Product, int> products, string filePath)
    {
        return _csvService.ExportToCsvAsync(products, filePath);
    }
}

public class ProductCsvMap : ClassMap<Product>
{
    public ProductCsvMap()
    {
        Map(m => m.Id).Name("ID");
        Map(m => m.Name).Name("Name");
        Map(m => m.SKU).Name("SKU");
        Map(m => m.Description).Name("Description");
        Map(m => m.Price).Name("Price");
        Map(m => m.Quantity).Name("Quantity");
        Map(m => m.MinQuantity).Name("MinQuantity");
        Map(m => m.Category).Name("Category");
        Map(m => m.Location).Name("Location");
        Map(m => m.CreatedAt).Name("CreatedAt");
    }
}
