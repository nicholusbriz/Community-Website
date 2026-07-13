# Role-Based Access Control (RBAC) Plan

## Goal

This project should support three roles:
- user: default role for all new accounts
- admin: can manage normal users and protected content
- superadmin: can manage admins and other privileged operations

## Recommended database tables

### 1. users
Store the role on the user record.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 2. user_profiles (optional but recommended)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  github_url TEXT,
  linkedin_url TEXT
);
```

### 3. projects
Projects should belong to a user.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 4. permissions (optional future enhancement)
If you later want more granular access, add a permissions table.

```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);
```

## Role rules

### User
Can:
- view public pages
- create and manage their own projects
- view their own profile
- access user-scoped APIs

Cannot:
- manage other users
- promote users
- access admin-only endpoints

### Admin
Can:
- manage users (basic moderation)
- review projects
- access admin-only pages and APIs

Cannot:
- promote or demote another admin
- perform superadmin-only actions

### Superadmin
Can:
- promote users to admin
- demote admins
- manage admins and superadmins
- access all protected routes and endpoints

## Suggested route access pattern

Use role checks like this in your app:

```ts
import { hasMinimumRole } from '@/lib/rbac';

const userRole = 'admin';

if (!hasMinimumRole(userRole, 'admin')) {
  redirect('/dashboard');
}
```

## Suggested API access pattern

```ts
export async function GET(request: Request) {
  const role = request.headers.get('x-user-role');

  if (!hasMinimumRole(role, 'admin')) {
    return new Response('Forbidden', { status: 403 });
  }

  return Response.json({ ok: true });
}
```

## Navigation behavior

You can display links based on role like this:

```tsx
const canManageUsers = hasMinimumRole(userRole, 'admin');
const canManageAdmins = hasMinimumRole(userRole, 'superadmin');
```

Then render:
- Dashboard for all logged-in users
- Admin panel for admins and superadmins
- Superadmin panel for superadmins only

## Recommended implementation order

1. Add role column to users table
2. Create a simple auth layer that loads the current user role
3. Add helper functions for RBAC checks
4. Protect routes and APIs with role checks
5. Add an admin panel for user promotion and role changes

## Example role promotion flow

- superadmin promotes a user to admin
- admin manages regular users
- user remains default unless promoted

## Notes

For now, keep it simple:
- default role = user
- only superadmin can promote to admin
- admin can manage users and content
- all checks should be centralized in one RBAC helper file
