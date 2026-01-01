# Task Completion Checklist

## When a Development Task is Completed

### Code Quality Checks (Required)
1. **Backend Linting and Formatting**
   ```bash
   cd backend
   pnpm run lint      # ESLint check and auto-fix
   pnpm run format    # Prettier formatting
   ```

2. **Frontend Linting**
   ```bash
   cd frontend
   pnpm run lint      # Next.js ESLint check
   ```

3. **Build Verification**
   ```bash
   npm run build      # Ensure both backend and frontend build successfully
   ```

### Testing (If Applicable)
1. **Backend Tests**
   ```bash
   cd backend
   pnpm run test      # Unit tests
   pnpm run test:e2e  # End-to-end tests (if applicable)
   ```

2. **Manual Testing**
   - Start development servers: `npm run dev`
   - Test affected functionality in browser
   - Verify API endpoints work correctly
   - Check console for errors

### Database Changes (If Applicable)
- Ensure database migrations are created if schema changed
- Test data import/export functionality if modified
- Verify wago.tools synchronization still works

### Documentation Updates (If Required)
- Update README.md if new features added
- Update API documentation if endpoints changed
- Update setup instructions if installation process changed

### Git Best Practices
- Use descriptive commit messages
- Consider squashing related commits
- Ensure no sensitive data (credentials, keys) in commits
- Check `.gitignore` covers generated files

### Pre-Deployment Checks
1. Environment variables properly configured
2. Database connection settings verified
3. CORS settings appropriate for deployment
4. Production build works correctly
5. All tests pass

## Critical Files to Check After Changes
- `/backend/.env.example` - If environment variables added
- `/backend/src/main.ts` - If CORS or global settings changed
- Package.json files - If dependencies added/modified
- Database entity files - If data model changed