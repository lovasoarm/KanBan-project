using Inventory.Core.Entities;

namespace Inventory.Import.Services;

public interface IImportService<TEntity> where TEntity : class, new()
{
    // Import entities from file
    Task<ImportResult<TEntity>> ImportFromFileAsync(string filePath, CancellationToken cancellationToken = default);
    
    // Import entities from stream
    Task<ImportResult<TEntity>> ImportFromStreamAsync(Stream stream, CancellationToken cancellationToken = default);
    
    // Validate file format before import
    Task<ValidationResult> ValidateFileAsync(string filePath);
}

public interface IImportService : IImportService<Product>
{
    IReadOnlyCollection<string> SupportedExtensions { get; }
}
