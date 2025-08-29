using Inventory.Core.Entities;

namespace Inventory.Import.Services;

public interface IImportService<TEntity> where TEntity : class, new()
{
  
    Task<ImportResult<TEntity>> ImportFromFileAsync(string filePath, CancellationToken cancellationToken = default);
    
   
    Task<ImportResult<TEntity>> ImportFromStreamAsync(Stream stream, CancellationToken cancellationToken = default);
    
  
    Task<ValidationResult> ValidateFileAsync(string filePath);
}

public interface IImportService : IImportService<Product>
{
    IReadOnlyCollection<string> SupportedExtensions { get; }
}
