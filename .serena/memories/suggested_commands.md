# Development Commands and Scripts

## Main Development Commands

### Development Server
```bash
npm run dev                 # Start both backend and frontend in development mode
npm run dev:backend         # Start only backend (cd backend && pnpm run start:dev)
npm run dev:frontend        # Start only frontend (cd frontend && pnpm run dev)
```

### Build Commands
```bash
npm run build               # Build both backend and frontend
npm run build:backend       # Build backend only
npm run build:frontend      # Build frontend only
```

### Production
```bash
npm run start               # Start backend in production mode
npm run start:backend       # Same as above
```

### Setup and Installation
```bash
npm run install:all         # Install dependencies for root, backend, and frontend
npm run setup              # Install all dependencies and show setup instructions
```

### Data Management
```bash
npm run import:data         # Import WoW item data from CSV files
npm run wago:download       # Download data from wago.tools
npm run wago:list          # List available downloads from wago.tools
npm run wago:recommended   # List recommended downloads
npm run wago:latest        # Download latest recommended data
npm run batch:import       # Batch import multiple data files
npm run batch:analyze      # Analyze batch import files
npm run batch:list         # List batch import files
```

## Backend-Specific Commands
```bash
cd backend
pnpm run start:dev          # Development server with watch mode
pnpm run start:debug        # Debug mode with watch
pnpm run start:prod         # Production server
pnpm run build             # Build the backend
pnpm run format            # Format code with Prettier
pnpm run lint              # Lint and fix TypeScript files
pnpm run test              # Run unit tests
pnpm run test:watch        # Run tests in watch mode
pnpm run test:cov          # Run tests with coverage
pnpm run test:e2e          # Run end-to-end tests
```

## Frontend-Specific Commands
```bash
cd frontend
pnpm run dev               # Development server with turbopack on port 3000
pnpm run build             # Build for production
pnpm run start             # Start production server
pnpm run lint              # Lint with Next.js ESLint config
```

## Quick Start Scripts
- **Windows**: `start.bat` (auto-installs deps and checks config)
- **Linux/Mac**: `./start.sh` (requires chmod +x first)
- **Data Import**: `import-data.bat` (Windows) or `./import-data.sh` (Linux/Mac)

## Application URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs