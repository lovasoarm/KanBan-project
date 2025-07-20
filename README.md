# KanBan Project

Système de gestion d'inventaire avec dashboard analytique et API REST.

## Structure

- **Inventory.Core** - Couche métier avec collections avancées
- **Inventory.Import** - Import CSV
- **Inventory.WebUI** - API REST avec dashboard
- **Data** - Données d'exemple

## Démarrage rapide

```bash
dotnet build
dotnet run --project Inventory.WebUI
```

API disponible sur https://localhost:7000/swagger

## Endpoints API

### Produits
- GET /api/products - Liste paginée
- POST /api/products - Créer
- PUT /api/products/{id} - Modifier
- DELETE /api/products/{id} - Supprimer
- POST /api/products/import - Import CSV

### Dashboard
- GET /api/dashboard/metrics - Métriques générales
- GET /api/dashboard/analytics/categories - Analyse par catégorie
- GET /api/dashboard/analytics/locations - Analyse par localisation
- GET /api/dashboard/trends/value?days=30 - Tendances de valeur
- GET /api/dashboard/alerts/restock - Alertes de réapprovisionnement
- GET /api/dashboard/stats/summary - Résumé statistiques

## Fonctionnalités

- Collections génériques avec indexeurs multiples
- Dashboard avec métriques temps réel
- Import CSV compatible Global Inventory Dataset 2025
- Architecture clean code avec injection de dépendances
- Calculs automatiques de marges et statuts
- Système d'alertes pour stock faible

## Données d'exemple

Fichier CSV avec 20 produits d'exemple dans `/Data/sample_inventory_2025.csv`
