using System.Diagnostics;
using Inventory.Core.Contracts;
using Inventory.Core.Entities;

namespace Inventory.Import.Services;

public class ImportService : IImportService
{
    private readonly ICsvImportService _csvService;
    private readonly IProductService _productService;
    
    private static readonly HashSet<string> _supportedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".csv", ".txt"
    };

    public IReadOnlyCollection<string> SupportedExtensions => _supportedExtensions;

    public ImportService(ICsvImportService csvService, IProductService productService)
    {
        _csvService = csvService ?? throw new ArgumentNullException(nameof(csvService));
        _productService = productService ?? throw new ArgumentNullException(nameof(productService));
    }

    // Import products from file with performance tracking
    public async Task<ImportResult<Product>> ImportFromFileAsync(string filePath, CancellationToken cancellationToken = default)
    {
        var stopwatch = Stopwatch.StartNew();
        var result = new ImportResult<Product>();

        try
        {
            var validation = await ValidateFileAsync(filePath);
            if (!validation.IsValid)
            {
                foreach (var issue in validation.Issues)
                    result.AddError(issue);
                return result;
            }

            await using var stream = File.OpenRead(filePath);
            return await ImportFromStreamAsync(stream, cancellationToken);
        }
        catch (Exception ex)
        {
            result.AddError($"Import failed: {ex.Message}");
        }
        finally
        {
            stopwatch.Stop();
            result["Duration"] = stopwatch.Elapsed;
        }

        return result;
    }

    // Import products from stream with batch processing
    public async Task<ImportResult<Product>> ImportFromStreamAsync(Stream stream, CancellationToken cancellationToken = default)
    {
        var stopwatch = Stopwatch.StartNew();
        var importedProducts = new List<Product>();
        var result = new ImportResult<Product>();

        try
        {
            var products = await _csvService.ImportProductsAsync(stream);
            var totalCount = 0;
            var successCount = 0;

            foreach (var product in products)
            {
                totalCount++;
                
                if (cancellationToken.IsCancellationRequested)
                {
                    result.AddWarning($"Import cancelled after processing {successCount} items");
                    break;
                }

                try
                {
                    var savedProduct = await _productService.CreateAsync(product);
                    importedProducts.Add(savedProduct);
                    successCount++;
                }
                catch (Exception ex)
                {
                    result.AddError($"Failed to save product '{product.Name}': {ex.Message}");
                }
            }

            return new ImportResult<Product>
            {
                ImportedEntities = importedProducts,
                TotalProcessed = totalCount,
                SuccessCount = successCount,
                ErrorCount = result.Errors.Count,
                Duration = stopwatch.Elapsed
            };
        }
        catch (Exception ex)
        {
            result.AddError($"Stream processing failed: {ex.Message}");
        }

        return result;
    }

    // Validate file before processing
    public async Task<ValidationResult> ValidateFileAsync(string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
            return ValidationResult.Invalid("File path is required");

        if (!File.Exists(filePath))
            return ValidationResult.Invalid($"File not found: {filePath}");

        var extension = Path.GetExtension(filePath);
        if (!_supportedExtensions.Contains(extension))
            return ValidationResult.Invalid($"Unsupported file type: {extension}");

        var fileInfo = new FileInfo(filePath);
        if (fileInfo.Length == 0)
            return ValidationResult.Invalid("File is empty");

        if (fileInfo.Length > 100 * 1024 * 1024) // 100MB limit
            return ValidationResult.Invalid("File too large (max 100MB)");

        return await Task.FromResult(ValidationResult.Valid());
    }
}
