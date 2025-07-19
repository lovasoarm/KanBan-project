# KanBan Inventory Management System

Un système de gestion d'inventaire avec architecture générique et collections indexées.

## Architecture

- **Inventory.Core** : Couche métier avec collections génériques et repositories
- **Inventory.Import** : Application console pour import CSV
- **Inventory.WebUI** : API REST avec Swagger
- **frontend** : Interface React (à développer)

## Installation

```bash
git clone <repository-url>
cd KanBan-project
dotnet restore
dotnet build
```

## Utilisation

### Import CSV
```bash
dotnet run --project Inventory.Import products.csv
```

### API Web
```bash
dotnet run --project Inventory.WebUI
# Swagger: https://localhost:5001/swagger
```

## API Endpoints

- `GET /api/products` - Liste des produits avec pagination
- `POST /api/products` - Créer un produit
- `PUT /api/products/{id}` - Modifier un produit
- `DELETE /api/products/{id}` - Supprimer un produit
- `POST /api/products/import` - Import CSV
