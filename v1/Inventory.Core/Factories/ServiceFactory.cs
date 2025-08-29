using Inventory.Core.Collections;
using Inventory.Core.Entities;
using Inventory.Core.Repositories;
using Inventory.Core.Services;

namespace Inventory.Core.Factories;

public static class ProductServiceFactory
{
    public static IProductService CreateProductService()
    {
        var repository = CreateProductRepository();
        var csvService = CreateProductCsvService();
        return new ProductService(repository, csvService);
    }

    public static IGenericRepository<Product, int> CreateProductRepository()
    {
        return new InMemoryRepository<Product, int>(p => p.Id);
    }

    public static CsvService<Product, int> CreateProductCsvService()
    {
        return new CsvService<Product, int>(p => p.Id, new Entities.ProductCsvMap());
    }
}
