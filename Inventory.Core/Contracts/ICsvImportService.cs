using Inventory.Core.Collections;

namespace Inventory.Core.Contracts;

public interface ICsvImportService<T> where T : class, new()
{
    Task<IGenericCollection<T, TKey>> ImportFromCsvAsync<TKey>(string filePath) where TKey : notnull;
    Task<IGenericCollection<T, TKey>> ImportFromCsvContentAsync<TKey>(string csvContent) where TKey : notnull;
    Task ExportToCsvAsync<TKey>(IGenericCollection<T, TKey> data, string filePath) where TKey : notnull;
}

public interface IValidationService<T> where T : class
{
    ValidationSummary ValidateData<TKey>(IGenericCollection<T, TKey> data) where TKey : notnull;
}

public interface IDataProcessor<T, TKey>
    where T : class
    where TKey : notnull
{
    Task<IGenericCollection<T, TKey>> ProcessAsync(IGenericCollection<T, TKey> data);
    Task<T> ProcessSingleAsync(T item);
}

public interface IQueryable<T, TKey>
    where T : class
    where TKey : notnull
{
    IEnumerable<T> Query(Func<T, bool> predicate);
    T? FindByKey(TKey key);
    IEnumerable<T> FindAll(params TKey[] keys);
    IEnumerable<TResult> Project<TResult>(Func<T, TResult> selector);
}
