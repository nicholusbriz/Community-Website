# Auth & Role Checking Guide

## How It Works Globally

Your auth system has **3 layers** that all use the same database-driven role hierarchy:

### 1. Middleware (Route Level) - `proxy.ts`
- Runs before every page load
- Checks if user is authenticated
- Checks if user has required role level
- Redirects unauthorized users

### 2. Client Components - `useAuth` hook
- Used in React components
- Checks user role from session
- Example: `actions.hasRole('ADMIN')`

### 3. Server Components/APIs - `server.ts`
- Used in API routes and server components
- Server-side role checking
- Example: `requireRole('ADMIN')`

## Role Flow

```
Database (roles table) 
    ↓
Role Cache (initialized on app startup)
    ↓
All role checks use cached hierarchy
```

## Adding New Roles

When you add a new role to the database:

1. **Insert into database:**
```sql
INSERT INTO roles (id, name, level, description, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'METEOR', 5, 'Special elevated role', NOW(), NOW());
```

2. **Restart your app** - Role cache will automatically load the new role

3. **Use it immediately:**
```tsx
// In components
const { actions } = useAuth()
if (actions.hasRole('METEOR')) {
  // Show meteor-only content
}

// In APIs
import { requireRole } from '@/app/lib/auth/server'
const session = await requireRole('METEOR')
```

## Usage Examples

### Client Components (React)
```tsx
'use client'
import { useAuth } from '@/app/lib/auth/useAuth'

export default function AdminPanel() {
  const { user, actions } = useAuth()
  
  // Check if user has ADMIN role or higher
  if (!actions.isAdmin()) {
    return <div>Access Denied</div>
  }
  
  // Check for specific role
  if (actions.hasExactRole('SUPERADMIN')) {
    return <SuperAdminPanel />
  }
  
  // Check for custom role
  if (actions.hasRole('METEOR')) {
    return <MeteorPanel />
  }
  
  return <AdminDashboard />
}
```

### Server Components
```tsx
import { requireRole, requireAuth } from '@/app/lib/auth/server'

export default async function AdminPage() {
  const session = await requireRole('ADMIN')
  
  // session.user contains user data with role
  return <div>Welcome {session.user.name}</div>
}
```

### API Routes
```tsx
import { NextResponse } from 'next/server'
import { requireRole, requireAuth } from '@/app/lib/auth/server'

export async function GET() {
  try {
    const session = await requireRole('ADMIN')
    
    // User is admin, proceed with API logic
    return NextResponse.json({ data: 'sensitive data' })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
```

### Middleware (Route Protection)
```tsx
// proxy.ts - Already configured
// Routes are protected by role level in middleware/routes/*.ts
```

## Role Hierarchy

The `level` field in the database determines hierarchy:
- Level 1: USER (lowest)
- Level 2: MENTOR
- Level 3: MODERATOR  
- Level 4: ADMIN
- Level 5: SUPERADMIN
- Level 6+: Custom roles (e.g., METEOR)

Higher levels can access everything lower levels can access.

## Important Notes

1. **Run seed-roles.sql first** - Before the app can work, you must seed the roles table
2. **Restart after adding roles** - Role cache loads on app startup
3. **No fallback** - If roles don't exist in database, auth will fail
4. **Default role** - New users automatically get USER role
