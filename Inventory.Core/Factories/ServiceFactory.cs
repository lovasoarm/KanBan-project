using Inventory.Core.Collections;
using Inventory.Core.Entities;
using Inventory.Core.Repositories;
using Inventory.Core.Services;

namespace Inventory.Core.Factories;

public interface IServiceFactory<T, TKey>
    where T : class
    where TKey : notnull
{
    IGenericRepository<T, TKey> CreateRepository(Func<T, TKey> keySelector);
    CsvService<T, TKey> CreateCsvService(Func<T, TKey> keySelector);
    IGenericCollection<T, TKey> CreateCollection(Func<T, TKey> keySelector);
}

public class ServiceFactory<T, TKey> : IServiceFactory<T, TKey>
    where T : class, new()
    where TKey : notnull, IComparable<TKey>
{
    public IGenericRepository<T, TKey> CreateRepository(Func<T, TKey> keySelector)
    {
        return new InMemoryRepository<T, TKey>(keySelector);
    }

    public CsvService<T, TKey> CreateCsvService(Func<T, TKey> keySelector)
    {
        return new CsvService<T, TKey>(keySelector);
    }

    public IGenericCollection<T, TKey> CreateCollection(Func<T, TKey> keySelector)
    {
        return new GenericCollection<T, TKey>(keySelector);
    }
}

public static class ProductServiceFactory
{
    public static IProductService CreateProductService()
    {
        var factory = new ServiceFactory<Product, int>();
        var repository = factory.CreateRepository(p => p.Id);
        return new ProductService(repository);
    }

    public static IGenericRepository<Product, int> CreateProductRepository()
    {
        return new InMemoryRepository<Product, int>(p => p.Id);
    }

    public static CsvService<Product, int> CreateProductCsvService()
    {
        return new CsvService<Product, int>(p => p.Id, new ProductCsvMap());
    }
}
