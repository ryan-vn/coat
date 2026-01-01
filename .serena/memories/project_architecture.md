# Project Architecture and Structure

## System Architecture

### Overall Structure
```
wow-item-graph/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── items/          # Item management module
│   │   ├── wago/           # Wago.tools integration
│   │   ├── database/       # Database utilities
│   │   └── scripts/        # Data import/sync scripts
│   ├── dist/               # Compiled JavaScript
│   ├── downloads/          # Downloaded CSV data files
│   └── uploads/            # File upload storage
├── frontend/               # Next.js web application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable components
│   │   ├── lib/          # Utility functions
│   │   ├── types/        # TypeScript definitions
│   │   └── data/         # Static profession data
│   └── public/           # Static assets
└── Root scripts and config files
```

## Backend Modules

### Items Module (`/backend/src/items/`)
- **Purpose**: Core item management functionality
- **Key Files**:
  - `items.service.ts` - Business logic for item operations
  - `items.controller.ts` - HTTP endpoints
  - `entities/` - TypeORM database entities
  - `dto/` - Data transfer objects for API

### Wago Module (`/backend/src/wago/`)
- **Purpose**: Integration with wago.tools for WoW data sync
- **Key Files**:
  - `wago.service.ts` - Wago API integration
  - `data-sync.service.ts` - Data synchronization logic
  - `change-log.service.ts` - Track data changes

### Database Module (`/backend/src/database/`)
- **Purpose**: Database utilities and import functionality
- **Key Files**:
  - `data-import.service.ts` - CSV data import logic
  - `table-schema.service.ts` - Dynamic schema handling

### Scripts (`/backend/src/scripts/`)
- **Purpose**: Utility scripts for data management
- **Key Scripts**:
  - `import-data.ts` - Import ItemSparse CSV data
  - `wago-downloader.ts` - Download data from wago.tools
  - `batch-import.ts` - Batch processing utilities

## Frontend Structure

### App Router (`/frontend/src/app/`)
- **Pages**:
  - `/` - Main search interface
  - `/items/[id]/` - Item detail pages
  - `/compare` - Item comparison tool
  - `/graph/[id]/` - Item relationship graphs
  - `/search` - Advanced search
  - `/version` - Data version management

### Components (`/frontend/src/components/`)
- **Core Components**:
  - `ItemCard.tsx` - Item display component
  - `SearchBar.tsx` - Search interface
  - `ItemGraphVisualization.tsx` - Graph rendering
  - `MaterialRelationGraph.tsx` - Material relationships
  - `CraftTree.tsx` - Crafting tree visualization

### Data Flow
1. **Data Import**: CSV files → Database via import scripts
2. **API Layer**: NestJS controllers expose RESTful endpoints
3. **Frontend**: Next.js app consumes API endpoints
4. **Visualization**: React Flow renders item relationships

## Database Schema (Key Entities)
- `Item` - Core item information
- `ItemSparse` - Extended item details
- `Recipe` - Crafting recipes
- `RecipeMaterial` - Recipe ingredients
- `ItemSet` - Item set information
- `LootItem` - Item drop sources