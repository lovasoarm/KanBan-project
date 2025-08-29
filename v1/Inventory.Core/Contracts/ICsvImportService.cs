using Inventory.Core.Collections;
using Inventory.Core.Services;

namespace Inventory.Core.Contracts;

public interface ICsvImportService<T> where T : class, new()
{
    Task<IGenericCollection<T, TKey>> ImportFromCsvAsync<TKey>(string filePath) where TKey : notnull;
    Task<IGenericCollection<T, TKey>> ImportFromCsvContentAsync<TKey>(string csvContent) where TKey : notnull;
    Task ExportToCsvAsync<TKey>(IGenericCollection<T, TKey> data, string filePath) where TKey : notnull;
}

