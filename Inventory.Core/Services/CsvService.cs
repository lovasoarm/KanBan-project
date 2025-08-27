using System.Globalization;
using System.ComponentModel.DataAnnotations;
using CsvHelper;
using CsvHelper.Configuration;
using Inventory.Core.Collections;
using Inventory.Core.Contracts;
using Inventory.Core.Enums;

namespace Inventory.Core.Services;

public interface ICsvService<T, TKey> where T : class, new() where TKey : notnull, IComparable<TKey>
{
    Task<IGenericCollection<T, TKey>> ImportFromCsvAsync(string filePath);
    Task<IGenericCollection<T, TKey>> ImportFromCsvContentAsync(string csvContent);
    Task ExportToCsvAsync(IGenericCollection<T, TKey> data, string filePath);
    ValidationSummary ValidateData(IGenericCollection<T, TKey> data);
}

public class CsvService<T, TKey> : ICsvService<T, TKey>
    where T : class, new() 
    where TKey : notnull, IComparable<TKey>
{
    private readonly Func<T, TKey> _keySelector;
    private readonly ClassMap<T>? _csvMap;
    private readonly CsvConfiguration _configuration;

    public CsvService(Func<T, TKey> keySelector, ClassMap<T>? csvMap = null)
    {
        _keySelector = keySelector ?? throw new ArgumentNullException(nameof(keySelector));
        _csvMap = csvMap;
        _configuration = CreateConfiguration();
    }

    public async Task<IGenericCollection<T, TKey>> ImportFromCsvAsync(string filePath)
    {
        ValidateFilePath(filePath);
        var content = await File.ReadAllTextAsync(filePath);
        return await ImportFromCsvContentAsync(content);
    }

    public async Task<IGenericCollection<T, TKey>> ImportFromCsvContentAsync(string csvContent)
    {
        var collection = new GenericCollection<T, TKey>(_keySelector);
        
        using var reader = new StringReader(csvContent);
        using var csv = new CsvReader(reader, _configuration);
        
        RegisterClassMap(csv);
        
        await foreach (var record in ReadRecordsAsync(csv))
        {
            collection.Add(record);
        }

        return collection;
    }

    public async Task ExportToCsvAsync(IGenericCollection<T, TKey> data, string filePath)
    {
        CreateDirectoryIfNotExists(filePath);
        
        using var writer = new StreamWriter(filePath);
        using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
        
        RegisterClassMap(csv);
        await csv.WriteRecordsAsync(data);
        await writer.FlushAsync();
    }

    public ValidationSummary ValidateData(IGenericCollection<T, TKey> data)
    {
        var summary = new ValidationSummary();
        
        foreach (var item in data)
        {
            ValidateItem(item, summary);
        }
        
        return summary;
    }

    private CsvConfiguration CreateConfiguration()
    {
        return new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            MissingFieldFound = null,
            HeaderValidated = null,
            TrimOptions = TrimOptions.Trim,
            AllowComments = true,
            Comment = '#'
        };
    }

    private void RegisterClassMap(CsvReader csv)
    {
        if (_csvMap != null)
        {
            csv.Context.RegisterClassMap(_csvMap);
        }
    }

    private void RegisterClassMap(CsvWriter csv)
    {
        if (_csvMap != null)
        {
            csv.Context.RegisterClassMap(_csvMap);
        }
    }

    private async IAsyncEnumerable<T> ReadRecordsAsync(CsvReader csv)
    {
        await Task.Yield();
        
        foreach (var record in csv.GetRecords<T>())
        {
            yield return record;
        }
    }

    private static void ValidateFilePath(string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
            throw new ArgumentException("File path cannot be null or empty", nameof(filePath));
            
        if (!File.Exists(filePath))
            throw new FileNotFoundException($"File not found: {filePath}");
    }

    private static void CreateDirectoryIfNotExists(string filePath)
    {
        var directory = Path.GetDirectoryName(filePath);
        if (!string.IsNullOrWhiteSpace(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }
    }

    private static void ValidateItem(T item, ValidationSummary summary)
    {
        var context = new ValidationContext(item);
        var results = new List<ValidationResult>();
        
        if (!Validator.TryValidateObject(item, context, results, true))
        {
            summary.IsValid = false;
            foreach (var result in results)
            {
                summary.AddError(result.ErrorMessage ?? "Unknown validation error");
            }
        }
    }
}

public class ValidationSummary
{
    public bool IsValid { get; set; } = true;
    public List<ValidationMessage> Messages { get; } = new();

    public void AddError(string message) => 
        Messages.Add(new ValidationMessage(ValidationLevel.Error, message));
        
    public void AddWarning(string message) => 
        Messages.Add(new ValidationMessage(ValidationLevel.Warning, message));
        
    public void AddInfo(string message) => 
        Messages.Add(new ValidationMessage(ValidationLevel.Info, message));

    public IEnumerable<string> Errors => 
        Messages.Where(m => m.Level == ValidationLevel.Error).Select(m => m.Message);
        
    public IEnumerable<string> Warnings => 
        Messages.Where(m => m.Level == ValidationLevel.Warning).Select(m => m.Message);
}

public record ValidationMessage(ValidationLevel Level, string Message);
