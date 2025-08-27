using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Inventory.Core.Contracts;
using Inventory.Core.Services;
using Inventory.Core.Repositories;
using Inventory.Import.Services;

namespace Inventory.Import;

class Program
{
    static async Task Main(string[] args)
    {
        Console.WriteLine("=== Inventory Import Tool ===");
        
        if (!ValidateArguments(args))
        {
            DisplayUsage();
            return;
        }

        var host = CreateHostBuilder(args).Build();
        await ProcessImportAsync(host, args[0]);
        
        Console.WriteLine("\nPress any key to exit...");
        Console.ReadKey();
    }

    // Validate command line arguments
    static bool ValidateArguments(string[] args) => args.Length > 0 && !string.IsNullOrWhiteSpace(args[0]);

    // Display usage information
    static void DisplayUsage()
    {
        Console.WriteLine("Usage: Inventory.Import <csv-file-path>");
        Console.WriteLine("Example: Inventory.Import products.csv");
    }

    // Process the import operation
    static async Task ProcessImportAsync(IHost host, string filePath)
    {
        try
        {
            var importService = host.Services.GetRequiredService<IImportService>();
            var result = await importService.ImportFromFileAsync(filePath);

            DisplayImportResults(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }

    // Display import results with statistics
    static void DisplayImportResults(ImportResult<Core.Entities.Product> result)
    {
        Console.WriteLine($"\n=== Import Results ===");
        Console.WriteLine($"Total Processed: {result.TotalProcessed}");
        Console.WriteLine($"Success: {result.SuccessCount}");
        Console.WriteLine($"Errors: {result.ErrorCount}");
        Console.WriteLine($"Duration: {result.Duration.TotalMilliseconds:F2}ms");

        if (result.Errors.Any())
        {
            Console.WriteLine("\nErrors:");
            foreach (var error in result.Errors)
                Console.WriteLine($"  - {error}");
        }

        if (result.Warnings.Any())
        {
            Console.WriteLine("\nWarnings:");
            foreach (var warning in result.Warnings)
                Console.WriteLine($"  - {warning}");
        }
    }

    // Configure dependency injection
    static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureServices(RegisterServices);

    // Register all services
    static void RegisterServices(HostBuilderContext context, IServiceCollection services)
    {
        services.AddScoped<ICsvService<Core.Entities.Product, int>>(provider => 
            new CsvService<Core.Entities.Product, int>(p => p.Id, new Core.Entities.ProductCsvMap()));
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IGenericRepository<Core.Entities.Product, int>>(provider => 
            new GenericRepository<Core.Entities.Product, int>(p => p.Id));
        services.AddScoped<IImportService, ImportService>();
    }
}
