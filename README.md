# KanBan Project

Système de gestion d'inventaire avec API REST et architecture en couches.

## Structure

- **Inventory.Core** - Couche métier
- **Inventory.Import** - Import CSV
- **Inventory.WebUI** - API REST
- **frontend** - Interface React

## Démarrage rapide

```bash
dotnet build
dotnet run --project Inventory.WebUI
```

API disponible sur https://localhost:5001/swagger

## Endpoints

- GET /api/products - Liste paginée
- POST /api/products - Créer
- PUT /api/products/{id} - Modifier
- DELETE /api/products/{id} - Supprimer
- POST /api/products/import - Import CSV
