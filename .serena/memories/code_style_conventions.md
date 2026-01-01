# Code Style and Conventions

## Backend (NestJS + TypeScript)

### TypeScript Configuration
- Target: ES2023
- Strict null checks enabled
- Decorators enabled (experimentalDecorators: true)
- No implicit any: false (more permissive)
- Source maps enabled for debugging

### Code Style (Prettier)
```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

### ESLint Configuration
- Uses typescript-eslint
- Prettier integration
- NestJS-specific rules

### File Organization
- Modules: Each feature has its own module (items, wago, database)
- DTOs: Separate dto folder for data transfer objects
- Entities: TypeORM entities in entities folder
- Services: Business logic in service files
- Controllers: HTTP endpoints in controller files
- Scripts: Utility scripts in src/scripts/

### Naming Conventions
- Files: kebab-case (e.g., `data-sync.service.ts`)
- Classes: PascalCase (e.g., `DataSyncService`)
- Methods/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Database entities: Singular names (e.g., `Item`, not `Items`)

### Decorators Usage
- `@Injectable()` for services
- `@Controller()` for controllers
- `@Entity()` for database entities
- `@ApiProperty()` for Swagger documentation

## Frontend (Next.js + TypeScript)

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- JSX: preserve (handled by Next.js)
- Path mapping: `@/*` maps to `./src/*`

### File Organization
- App Router structure: `/app` directory
- Components: Reusable components in `/components`
- UI Components: Specific UI components in `/components/ui`
- Types: Type definitions in `/types`
- Utils: Helper functions in `/lib`
- Data: Static data files in `/data`

### Styling
- Tailwind CSS v4
- Component-level styling
- Responsive design patterns

### Naming Conventions
- Components: PascalCase (e.g., `ItemCard.tsx`)
- Pages: lowercase (e.g., `page.tsx`)
- Hooks: usePrefix (e.g., `useItems`)
- Types: PascalCase with descriptive names
- Utilities: camelCase

## Database Conventions
- Table names: snake_case (handled by TypeORM)
- Column names: snake_case
- Relationships properly defined with decorators
- Migrations for schema changes

## API Conventions
- RESTful endpoints
- Consistent response format
- Proper HTTP status codes
- Swagger documentation for all endpoints
- DTO validation with class-validator