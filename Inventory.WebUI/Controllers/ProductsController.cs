using Microsoft.AspNetCore.Mvc;
using Inventory.Core.Contracts;
using Inventory.Core.Entities;
using Inventory.Core.Services;
using Inventory.Import.Services;
using Inventory.WebUI.Models;

namespace Inventory.WebUI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IImportService _importService;

    public ProductsController(IProductService productService, IImportService importService)
    {
        _productService = productService ?? throw new ArgumentNullException(nameof(productService));
        _importService = importService ?? throw new ArgumentNullException(nameof(importService));
    }

    // Get all products with pagination
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<Product>>>> GetProducts(
        [FromQuery] int page = 1, 
        [FromQuery] int size = 10)
    {
        var products = await _productService.GetAllAsync();
        var pagedProducts = products.Skip((page - 1) * size).Take(size);
        
        var response = new ApiResponse<IEnumerable<Product>>(pagedProducts)
        {
            ["TotalCount"] = products.Count(),
            ["Page"] = page,
            ["PageSize"] = size
        };

        return Ok(response);
    }

    // Get product by ID
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<Product>>> GetProduct(int id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null)
            return NotFound(new ApiResponse<Product>(null, $"Product with ID {id} not found"));

        return Ok(new ApiResponse<Product>(product));
    }

    // Create new product
    [HttpPost]
    public async Task<ActionResult<ApiResponse<Product>>> CreateProduct(Product product)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ApiResponse<Product>(null, "Invalid product data"));

        var createdProduct = await _productService.CreateAsync(product);
        var response = new ApiResponse<Product>(createdProduct, "Product created successfully");
        
        return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, response);
    }

    // Update existing product
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<Product>>> UpdateProduct(int id, Product product)
    {
        if (id != product.Id)
            return BadRequest(new ApiResponse<Product>(null, "ID mismatch"));

        var updatedProduct = await _productService.UpdateAsync(product);
        return Ok(new ApiResponse<Product>(updatedProduct, "Product updated successfully"));
    }

    // Delete product
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteProduct(int id)
    {
        await _productService.DeleteAsync(id);
        return Ok(new ApiResponse<object>(null, "Product deleted successfully"));
    }

    // Import products from CSV file
    [HttpPost("import")]
    public async Task<ActionResult<ApiResponse<ImportResult<Product>>>> ImportProducts(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new ApiResponse<ImportResult<Product>>(null, "No file uploaded"));

        try
        {
            using var stream = file.OpenReadStream();
            var result = await _importService.ImportFromStreamAsync(stream);
            
            var response = new ApiResponse<ImportResult<Product>>(result, "Import completed")
            {
                ["FileName"] = file.FileName,
                ["FileSize"] = file.Length
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<ImportResult<Product>>(null, $"Import failed: {ex.Message}"));
        }
    }
}
