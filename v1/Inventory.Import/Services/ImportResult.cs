namespace Inventory.Import.Services;

public class ImportResult<TEntity> where TEntity : class
{
    private readonly Dictionary<string, object> _metadata = new();
    private readonly List<string> _errors = new();
    private readonly List<string> _warnings = new();

    public IReadOnlyList<TEntity> ImportedEntities { get; init; } = new List<TEntity>();
    public int TotalProcessed { get; init; }
    public int SuccessCount { get; init; }
    public int ErrorCount { get; init; }
    public TimeSpan Duration { get; init; }
    public bool IsSuccess => ErrorCount == 0;
    
    // Indexer for metadata access
    public object? this[string key]
    {
        get => _metadata.TryGetValue(key, out var value) ? value : null;
        set => _metadata[key] = value ?? throw new ArgumentNullException(nameof(value));
    }

    public IReadOnlyList<string> Errors => _errors.AsReadOnly();
    public IReadOnlyList<string> Warnings => _warnings.AsReadOnly();

    // Add error with fluent API
    public ImportResult<TEntity> AddError(string error)
    {
        _errors.Add(error);
        return this;
    }

    // Add warning with fluent API
    public ImportResult<TEntity> AddWarning(string warning)
    {
        _warnings.Add(warning);
        return this;
    }
}

public class ValidationResult
{
    private readonly List<string> _issues = new();

    public bool IsValid => !_issues.Any();
    public IReadOnlyList<string> Issues => _issues.AsReadOnly();

    // Add validation issue
    public ValidationResult AddIssue(string issue)
    {
        _issues.Add(issue);
        return this;
    }

    // Static factory methods
    public static ValidationResult Valid() => new();
    public static ValidationResult Invalid(string issue) => new ValidationResult().AddIssue(issue);
}
