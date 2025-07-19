# KanBan Inventory Management System

Un système de gestion d'inventaire moderne utilisant une architecture basée sur des génériques et des indexeurs.

## Architecture

### Structure du Projet

```
KanBan-project/
├── Inventory.Core/              # Couche métier et services de base
│   ├── Collections/            # Collections génériques avec indexeurs
│   ├── Contracts/              # Interfaces et contrats
│   ├── Entities/               # Entités métier (Product)
│   ├── Enums/                  # Énumérations du domaine
│   ├── Repositories/           # Pattern Repository générique
│   ├── Services/               # Services métier (CsvService, ProductService)
│   ├── Factories/              # Pattern Factory
│   └── Examples/               # Exemples d'utilisation
├── Inventory.Import/           # Application console d'import CSV
│   ├── Services/               # Services d'import avec génériques
│   └── Program.cs              # Point d'entrée console
├── Inventory.WebUI/            # API Web ASP.NET Core
│   ├── Controllers/            # Contrôleurs REST API
│   ├── Models/                 # Modèles de réponse API
│   └── Program.cs              # Configuration API
├── frontend/                   # Application React (à développer)
└── KanBan-project.sln          # Solution .NET
```

## Fonctionnalités Principales

### Collections Génériques avec Indexeurs

- Accès par clé typée : `collection[key]`
- Accès par index : `collection[0]`
- Thread-safety avec `ConcurrentDictionary`
- Support LINQ intégré

### Services CSV Génériques

- Import/Export CSV avec validation
- Mapping personnalisable avec CsvHelper
- Gestion d'erreurs centralisée
- Support asynchrone

### Repository Pattern Générique

- CRUD operations typées
- Requêtes LINQ intégrées
- Implémentation en mémoire et persistante
- Interface uniforme pour tous les types d'entités

## Installation et Configuration

### Prérequis

- .NET 8.0 ou supérieur
- Node.js 16+ (pour le frontend React)
- Visual Studio 2022 ou VS Code

### Installation Backend

1. Cloner le repository

```bash
git clone <repository-url>
cd KanBan-project
```

2.Restaurer les packages NuGet

```bash
dotnet restore
```

3.Compiler la solution

```bash
dotnet build
```

### Installation Frontend

1.Naviguer vers le dossier frontend

```bash
cd frontend
```

2.Installer les dépendances

```bash
npm install
```

3.Démarrer le serveur de développement

```bash
npm start
```

## Utilisation

### Application d'Import (Console)

```bash
# Importer un fichier CSV
dotnet run --project Inventory.Import products.csv

# Exemple de sortie
=== Inventory Import Tool ===

=== Import Results ===
Total Processed: 150
Success: 147
Errors: 3
Duration: 245.67ms

Errors:
  - Failed to save product 'Invalid Product': Name is required
```

### API Web (WebUI)

```bash
# Démarrer l'API
dotnet run --project Inventory.WebUI

# Swagger UI disponible à :
# https://localhost:5001/swagger
```

### Création d'un Service Produit

```csharp
using Inventory.Core.Factories;

var productService = ProductServiceFactory.CreateProductService();
```

### Manipulation avec Indexeurs

```csharp
var products = new GenericCollection<Product, int>(p => p.Id);

// Ajouter un produit
products.Add(new Product { Id = 1, Name = "Laptop" });

// Accès par ID
var laptop = products[1];

// Accès par index
var firstProduct = products[0];

// Modification
products[1] = updatedLaptop;
```

### Import CSV

```csharp
var csvService = ProductServiceFactory.CreateProductCsvService();
var importedProducts = await csvService.ImportFromCsvAsync<int>("products.csv");

foreach (var product in importedProducts)
{
    Console.WriteLine($"Imported: {product.Name}");
}
```

### Requêtes avec Repository

```csharp
var repository = ProductServiceFactory.CreateProductRepository();

// Ajouter des produits
await repository.AddAsync(product);

// Recherche
var lowStockProducts = repository.Query(p => p.Quantity < p.MinQuantity);
var electronicsProducts = repository.Query(p => p.Category == "Electronics");
```

## Exemples d'Utilisation

### Service Métier Complet

```csharp
public class InventoryManager
{
    private readonly IProductService _productService;

    public InventoryManager()
    {
        _productService = ProductServiceFactory.CreateProductService();
    }

    public async Task ManageInventoryAsync()
    {
        // Import depuis CSV
        var products = await _productService.ImportProductsAsync("inventory.csv");

        // Vérifier les stocks faibles
        var lowStock = await _productService.GetLowStockProductsAsync();

        foreach (var product in lowStock)
        {
            await _productService.UpdateStockAsync(product.Id, product.MinQuantity * 2);
        }

        // Exporter le rapport
        await _productService.ExportProductsAsync(products, "updated_inventory.csv");
    }
}
```

### Création d'Entités Personnalisées

```csharp
public class CustomItem : IInventoryItem<string>, ILocationTrackable
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string Location { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public decimal TotalValue => Price * Quantity;

    public void UpdateQuantity(int newQuantity)
    {
        Quantity = Math.Max(0, newQuantity);
        UpdatedAt = DateTime.UtcNow;
    }

    public void AdjustStock(int adjustment) => UpdateQuantity(Quantity + adjustment);
    public bool NeedsRestock() => Quantity < 10;
}
```

## Tests

### Exécuter les Tests Unitaires

```bash
dotnet test
```

### Structure des Tests

```csharp
[Test]
public void GenericCollection_IndexerAccess_ReturnsCorrectItem()
{
    var collection = new GenericCollection<Product, int>(p => p.Id);
    var product = new Product { Id = 1, Name = "Test" };

    collection.Add(product);

    Assert.AreEqual(product, collection[1]);
    Assert.AreEqual(product, collection[0]);
}
```

## API Web

### Endpoints Principaux

```
GET    /api/products              # Tous les produits avec pagination
GET    /api/products/{id}         # Produit par ID
POST   /api/products              # Créer un produit
PUT    /api/products/{id}         # Mettre à jour un produit
DELETE /api/products/{id}         # Supprimer un produit
POST   /api/products/import       # Import CSV avec upload de fichier
```

### Exemples de Réponses API

#### GET /api/products?page=1&size=5
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": [
    {
      "id": 1,
      "name": "Laptop Dell",
      "description": "Ordinateur portable professionnel",
      "category": "Electronics",
      "price": 999.99,
      "quantity": 25
    }
  ],
  "timestamp": "2025-01-19T18:43:00Z",
  "metadata": {
    "TotalCount": 150,
    "Page": 1,
    "PageSize": 5
  }
}
```

#### POST /api/products/import
```json
{
  "success": true,
  "message": "Import completed",
  "data": {
    "totalProcessed": 100,
    "successCount": 97,
    "errorCount": 3,
    "duration": "00:00:01.245",
    "errors": [
      "Failed to save product 'Invalid Item': Name is required"
    ]
  },
  "metadata": {
    "FileName": "products.csv",
    "FileSize": 15420
  }
}
```

## Déploiement

### Configuration Production

1. Mettre à jour `appsettings.Production.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-production-connection-string"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  }
}
```

2.Compiler pour la production

```bash
dotnet publish -c Release -o publish
```

3.Déployer l'application

```bash
# Sur IIS, Azure App Service, ou serveur Linux
```

## Contributing

### Standards de Code

- Utiliser les conventions C# standards
- Respecter les principes SOLID
- Implémenter des tests unitaires pour chaque fonctionnalité
- Documenter les APIs publiques

### Process de Contribution

1. Fork le repository
2. Créer une branche feature
3. Committer les changements
4. Pousser vers la branche
5. Créer une Pull Request
