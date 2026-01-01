# WoW Item Graph Tool - Project Overview

## Purpose
This is a comprehensive World of Warcraft (魔兽世界) item visualization and analysis tool that provides:
- Item search and filtering capabilities
- Item comparison and analysis
- Relationship graph visualization showing item connections
- Craft tree visualization for item creation paths
- Data synchronization with WoW game databases via wago.tools

## Main Features
- **Multi-dimensional Search**: Search by item name, ID, type, quality, class restrictions
- **Item Details**: Complete item attributes, icons, quality information
- **Item Comparison**: Multi-item attribute comparison analysis
- **Relationship Graphs**: Visual display of item relationships (basic version)
- **Responsive Design**: Desktop and mobile device support
- **Advanced Features (in development)**: Craft materials, production relationships, task relationships, export functionality, dark mode, user system

## Tech Stack
- **Frontend**: Next.js 15.4.0-canary.51 + TypeScript + Tailwind CSS v4
- **Backend**: NestJS + TypeORM + MySQL
- **Visualization**: React Flow for graph visualization
- **Data Source**: WoW ItemSparse.db2 data via wago.tools API
- **Package Management**: pnpm (workspaces)
- **Development**: Concurrent development with turbopack

## Project Structure
- `backend/` - NestJS backend API server
- `frontend/` - Next.js frontend application
- Root level contains orchestration scripts and configuration