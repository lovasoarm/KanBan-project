namespace Inventory.WebUI.Models;

public class ApiResponse<TData>
{
    private readonly Dictionary<string, object> _metadata = new();

    public bool Success { get; init; }
    public string Message { get; init; }
    public TData? Data { get; init; }
    public DateTime Timestamp { get; init; }

    // Indexer for dynamic metadata
    public object? this[string key]
    {
        get => _metadata.TryGetValue(key, out var value) ? value : null;
        set => _metadata[key] = value ?? throw new ArgumentNullException(nameof(value));
    }

    public IReadOnlyDictionary<string, object> Metadata => _metadata;

    public ApiResponse(TData? data, string message = "Operation completed successfully", bool success = true)
    {
        Success = success;
        Message = message;
        Data = data;
        Timestamp = DateTime.UtcNow;
    }

    public static ApiResponse<TData> Error(string message, TData? data = default)
    {
        return new ApiResponse<TData>(data, message, false);
    }


    public static ApiResponse<TData> Ok(TData data, string message = "Success")
    {
        return new ApiResponse<TData>(data, message);
    }
}
