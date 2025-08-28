# KanBan Project

Système de gestion d'inventaire moderne avec dashboard React interactif et API REST.

## Structure

- **Inventory.Core** - Couche métier avec collections avancées et services
- **Inventory.Import** - Service d'import CSV avec validation
- **Inventory.WebUI** - API REST ASP.NET Core avec dashboard React
  - **ClientApp** - Application React avec Vite, TypeScript et Bootstrap
  - **Controllers** - API REST controllers
  - **Models** - Modèles de données API
- **Data** - Données d'exemple et fichiers de configuration

## Démarrage rapide

### Backend API
```bash
dotnet build
dotnet run --project Inventory.WebUI
```

### Frontend Dashboard
```bash
cd Inventory.WebUI/ClientApp
npm install
npm run dev
```

Accès:
- API: https://localhost:7001/swagger
- Dashboard: http://localhost:3000

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

### Backend
- Collections génériques avec indexeurs multiples
- API REST avec architecture clean code
- Import CSV compatible Global Inventory Dataset 2025
- Injection de dépendances et services
- Calculs automatiques de marges et statuts
- Système d'alertes pour stock faible

### Frontend Dashboard
- Interface React moderne avec TypeScript
- Dashboard interactif avec graphiques Chart.js
- Pages principales:
  - Dashboard: métriques et graphiques temps réel
  - Products: gestion complète des produits avec filtres
  - Analytics: analyses avancées avec visualisations
  - Settings: configuration système et logs
- Composants réutilisables (StatsCard, Navigation)
- Hooks personnalisés pour la gestion d'état
- Styles CSS responsifs avec animations
- Architecture clean code avec séparation des responsabilités

## Données d'exemple

Fichier CSV avec 20 produits d'exemple dans `/Data/sample_inventory_2025.csv`
