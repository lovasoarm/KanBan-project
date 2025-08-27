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
    Task<Product?> GetByIdAsync(int id);
    Task<IEnumerable<Product>> GetAllAsync();
    Task<IGenericCollection<Product, int>> GetProductsByCategoryAsync(string category);
    Task<IGenericCollection<Product, int>> GetLowStockProductsAsync();
    Task<Product> UpdateStockAsync(int productId, int newQuantity);
    Task<Product> CreateAsync(Product product);
    Task<Product> UpdateAsync(Product product);
    Task<bool> DeleteAsync(int id);
    Task ExportProductsAsync(IGenericCollection<Product, int> products, string filePath);
}

public class ProductService : IProductService
{
    private readonly IGenericRepository<Product, int> _repository;
    private readonly ICsvService<Product, int> _csvService;

    public ProductService(IGenericRepository<Product, int> repository, ICsvService<Product, int> csvService)
    {
        _repository = repository;
        _csvService = csvService;
    }

    public async Task<IGenericCollection<Product, int>> ImportProductsAsync(string csvFilePath)
    {
        var importedProducts = await _csvService.ImportFromCsvAsync(csvFilePath);
        
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

    public async Task<Product> CreateAsync(Product product)
    {
        if (product == null)
            throw new ArgumentNullException(nameof(product));
            
        var createdProduct = await _repository.AddAsync(product);
        await _repository.SaveChangesAsync();
        
        return createdProduct;
    }

    public Task<Product?> GetByIdAsync(int id)
    {
        return _repository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        var allProducts = await _repository.GetAllAsync();
        return allProducts.AsEnumerable();
    }

    public async Task<Product> UpdateAsync(Product product)
    {
        if (product == null)
            throw new ArgumentNullException(nameof(product));
            
        var updatedProduct = await _repository.UpdateAsync(product);
        await _repository.SaveChangesAsync();
        
        return updatedProduct;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var result = await _repository.DeleteAsync(id);
        await _repository.SaveChangesAsync();
        
        return result;
    }

    public Task ExportProductsAsync(IGenericCollection<Product, int> products, string filePath)
    {
        return _csvService.ExportToCsvAsync(products, filePath);
    }

    // Méthodes additionnelles pour l'API
    public async Task<IEnumerable<Product>> GetByCategoryAsync(string category)
    {
        var categoryProducts = await GetProductsByCategoryAsync(category);
        return categoryProducts.AsEnumerable();
    }

    public async Task<IEnumerable<Product>> GetLowStockAsync()
    {
        var lowStockProducts = await GetLowStockProductsAsync();
        return lowStockProducts.AsEnumerable();
    }

    public async Task<IEnumerable<Product>> SearchAsync(string query)
    {
        var allProducts = await _repository.GetAllAsync();
        var searchResults = allProducts.Where(p => 
            p.Name.Contains(query, StringComparison.OrdinalIgnoreCase) ||
            p.SKU.Contains(query, StringComparison.OrdinalIgnoreCase) ||
            p.Description.Contains(query, StringComparison.OrdinalIgnoreCase) ||
            p.Category.Contains(query, StringComparison.OrdinalIgnoreCase) ||
            p.Brand.Contains(query, StringComparison.OrdinalIgnoreCase)
        );
        
        return searchResults;
    }
}
