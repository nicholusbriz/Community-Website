# Community Website

A community platform where users showcase their projects. Users can create accounts, upload project images with descriptions and URLs, and explore projects from other developers. Public browsing is available without authentication, while full CRUD operations require authentication.

## Key Features

- **User authentication** (Email/Password, Google, GitHub)
- **Project showcase** with image uploads
- **Developer profiles** showing all their projects
- **Browse and search** public projects
- **Dashboard** for managing personal projects
- **Optimized image hosting** via Supabase Storage

## Technology Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | v16.0+ | Full-stack React framework with App Router, Server Components, and Server Actions |
| TypeScript | v5.0+ | Type-safe JavaScript for better development experience and code quality |
| Node.js | v20.0+ | JavaScript runtime environment |

### Frontend Libraries

| Library | Purpose |
|---------|---------|
| React | UI library for building component-based interfaces |
| Tailwind CSS | Utility-first CSS framework for rapid UI development without writing custom CSS |
| Framer Motion | Animation library for smooth transitions and micro-interactions |
| React Hook Form | Performant form handling with validation and minimal re-renders |
| Zod | Schema validation for forms and API inputs - ensures data integrity |
| Shadcn/ui | Reusable component library built on Radix UI - provides accessible components |
| React Query | Data fetching, caching, and state management - handles server state efficiently |
| Sonner | Toast notifications for user feedback - beautiful and accessible |
| Lucide React | Icon library with consistent design and lightweight icons |

### Backend & Database Libraries

| Library | Purpose |
|---------|---------|
| Prisma | Type-safe ORM for database operations - provides type-safe database queries |
| NextAuth.js (Auth.js) | Authentication framework with OAuth support - handles sessions and providers |
| Supabase Client | JavaScript client for Supabase services (Storage, Database) |
| bcryptjs | Password hashing for credential users - ensures secure password storage |
| @auth/supabase adapter | Supabase adapter for NextAuth.js - connects auth to Supabase database |

### Database & Storage

| Service | Purpose |
|---------|---------|
| Supabase PostgreSQL | Primary database for all application data - managed PostgreSQL database |
| Supabase Storage | Image storage with automatic optimization, CDN, and resizing |
| Supavisor | Connection pooling service for serverless deployment |

## Complete Package List

```json
{
  "dependencies": {
    // Core
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    // Database & ORM
    "@prisma/client": "^6.0.0",
    "prisma": "^6.0.0",
    // Authentication
    "next-auth": "^5.0.0-beta",
    "@auth/supabase-adapter": "^1.0.0",
    "bcryptjs": "^3.0.0",
    // Supabase
    "@supabase/supabase-js": "^2.0.0",
    // Forms & Validation
    "react-hook-form": "^7.54.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.24.0",
    // UI Components
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.468.0",
    // Data Fetching
    "@tanstack/react-query": "^5.66.0",
    // Utilities
    "framer-motion": "^12.0.0",
    "sonner": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  }
}
```

## Complete Folder Structure

```
devshowcase-community/
├── .env.local                     # Environment variables (never commit)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── postcss.config.js
├── middleware.ts                  # Auth middleware for route protection
├── prisma/
│   ├── schema.prisma              # Database schema definition
│   └── seed.ts                    # Seed data for development
├── public/
│   ├── images/                    # Static images
│   ├── fonts/                     # Custom fonts
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (auth)/                # Authentication routes group
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Login page
│   │   │   ├── register/
│   │   │   │   └── page.tsx      # Registration page
│   │   │   └── layout.tsx        # Auth layout (centered, no sidebar)
│   │   ├── (dashboard)/          # Dashboard routes group (protected)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx      # Dashboard home with statistics
│   │   │   ├── profile/
│   │   │   │   └── page.tsx      # Profile settings
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx      # My projects list (READ)
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # Create project (CREATE)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx  # Project details (dashboard view)
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx # Edit project (UPDATE)
│   │   │   └── layout.tsx        # Dashboard layout with sidebar
│   │   ├── (public)/             # Public routes group (no auth)
│   │   │   ├── page.tsx          # Homepage with featured projects
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx      # All projects with search
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Single project view
│   │   │   └── developer/
│   │   │       └── [username]/
│   │   │           └── page.tsx  # Developer profile with their projects
│   │   ├── api/                   # API routes (serverless functions)
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts  # NextAuth configuration endpoint
│   │   │   ├── projects/
│   │   │   │   ├── route.ts      # GET (list), POST (create)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # GET, PUT, DELETE
│   │   │   ├── upload/
│   │   │   │   └── route.ts      # Image upload to Supabase
│   │   │   └── profile/
│   │   │       └── route.ts      # Profile update endpoint
│   │   ├── layout.tsx            # Root layout wrapper
│   │   ├── globals.css           # Global styles
│   │   └── providers.tsx        # Context providers (React Query, Theme)
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── button.tsx        # Button component (variants)
│   │   │   ├── card.tsx          # Card container
│   │   │   ├── input.tsx         # Form input
│   │   │   ├── textarea.tsx      # Text area
│   │   │   ├── dialog.tsx        # Modal dialog
│   │   │   ├── dropdown-menu.tsx # Dropdown menu
│   │   │   ├── avatar.tsx        # Avatar display
│   │   │   ├── badge.tsx         # Status badge
│   │   │   └── ...              # Other UI components
│   │   ├── layout/
│   │   │   ├── sidebar.tsx       # Dashboard sidebar navigation
│   │   │   ├── navbar.tsx        # Top navigation bar
│   │   │   ├── footer.tsx        # Footer component
│   │   │   └── header.tsx        # Page header with actions
│   │   ├── projects/
│   │   │   ├── project-card.tsx  # Reusable project card (public)
│   │   │   ├── project-grid.tsx  # Grid of project cards
│   │   │   ├── project-form.tsx  # Create/Edit form (reusable)
│   │   │   ├── project-list.tsx  # List view for dashboard
│   │   │   └── project-actions.tsx # Edit/Delete buttons
│   │   ├── forms/
│   │   │   ├── login-form.tsx    # Email/password login
│   │   │   ├── register-form.tsx # Registration form
│   │   │   ├── profile-form.tsx  # Profile edit form
│   │   │   └── image-upload.tsx  # Drag & drop image uploader
│   │   ├── auth/
│   │   │   ├── oauth-buttons.tsx # Google/GitHub login buttons
│   │   │   └── auth-guard.tsx    # Protected route wrapper
│   │   └── shared/
│   │       ├── loading.tsx       # Loading skeletons
│   │       ├── empty-state.tsx   # Empty state display
│   │       ├── search-bar.tsx    # Search input with debounce
│   │       └── pagination.tsx    # Pagination controls
│   ├── lib/
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── supabase.ts           # Supabase client configuration
│   │   ├── utils.ts              # Utility functions (format, truncate)
│   │   ├── validations.ts        # Zod schemas for validation
│   │   └── constants.ts          # App constants
│   ├── hooks/
│   │   ├── use-projects.ts      # React Query hooks for projects
│   │   ├── use-auth.ts           # Authentication hooks
│   │   └── use-upload.ts         # Image upload hooks
│   ├── types/
│   │   ├── index.ts              # TypeScript type definitions
│   │   └── next-auth.d.ts        # NextAuth type extensions
│   └── middleware/
│       └── auth.ts               # Authentication middleware logic
└── docker-compose.yml           # Local development (optional)
```

## Database Models

### Core Models

#### User Model
Stores all user information including authentication data and profile details. Links to projects, accounts, sessions, likes, and comments.

**Fields:**
- id, name, email, emailVerified, image (profile picture)
- password (hashed, for email users)
- bio, githubUrl, website (profile details)
- createdAt, updatedAt (timestamps)
- Relations: accounts, sessions, projects, likes, comments

#### Account Model
Handles OAuth provider connections (Google, GitHub). Stores tokens and provider specific data for each user.

**Fields:**
- id, userId, type, provider, providerAccountId
- refresh_token, access_token, expires_at
- token_type, scope, id_token, session_state
- Relation: user

#### Project Model
Main content model storing all project information. Each project belongs to a user and can be published or kept as draft.

**Fields:**
- id, title, description (text)
- imagePath (Supabase storage path), imageUrl (full URL)
- projectUrl (external link)
- userId (owner), isPublished (boolean)
- views (counter), createdAt, updatedAt
- Relations: user, likes, comments

#### Like Model
Tracks user likes on projects. Ensures one like per user per project.

**Fields:**
- id, userId, projectId, createdAt
- Relations: user, project

#### Comment Model
Stores user comments on projects. Allows discussion and feedback.

**Fields:**
- id, content (text), userId, projectId
- createdAt, updatedAt
- Relations: user, project

#### Session Model & VerificationToken Model
Used by NextAuth for session management and email verification flows.

## Data Flow & Page Wireframes

### Page 1: Homepage (/) - Public
**Purpose:** Landing page showcasing featured projects and platform overview.

**Data Fetched:**
- 3-5 most recent published projects
- For each project: title, image, description, user name
- User authentication status

### Page 2: All Projects (/projects) - Public
**Purpose:** Browse and search through all published projects.

**Data Fetched:**
- Paginated list of published projects (9 per page)
- Search results filtered by title or developer name
- For each project: image, title, description, user info

### Page 3: Single Project (/project/[id]) - Public
**Purpose:** View detailed information about a specific project.

**Data Fetched:**
- Full project details with user info
- View count is incremented on each visit
- 4 other projects from the same developer
- Like status (if authenticated)

### Page 4: Developer Profile (/developer/[username]) - Public
**Purpose:** Show all projects by a specific developer.

**Data Fetched:**
- User profile information (name, bio, avatar)
- All published projects by this user
- Project statistics (total count)

### Page 5: Dashboard Home (/dashboard) - Protected
**Purpose:** Overview of user's activity and quick actions.

**Data Fetched:**
- Total projects count
- Published vs draft count
- Total views across all projects
- 5 most recent projects with edit actions
- User info for greeting

### Page 6: My Projects (/dashboard/projects) - Protected
**Purpose:** Manage all user projects with CRUD actions.

**Data Fetched:**
- All user projects with status indicators
- Each project shows: title, date, status, view count
- Action buttons: Edit, Delete, View
- Search functionality for filtering user projects

### Page 7: Create Project (/dashboard/projects/new) - Protected
**Purpose:** Upload and create a new project.

**Data Fetched:**
- User authentication status
- No existing data (new project)

**Data Submitted:**
- Title, Description, Image, Project URL, Publish status
- Image uploaded to Supabase Storage
- Project metadata saved to database

### Page 8: Edit Project (/dashboard/projects/[id]/edit) - Protected
**Purpose:** Update existing project details.

**Data Fetched:**
- Existing project data (pre-populated in form)
- Image path for display
- User ownership verification

**Data Submitted:**
- Updated Title, Description, Image, URL, Status
- Image replaced if new one uploaded (old image deleted from storage)
- Delete action removes from database and storage

### Page 9: Profile Settings (/dashboard/profile) - Protected
**Purpose:** Manage user profile and account settings.

**Data Fetched:**
- Current user profile data (name, email, bio, links)
- Avatar image URL
- Connected OAuth providers

**Data Submitted:**
- Updated profile information
- New avatar image (uploaded to Supabase)
- Password change (for credential users)

## Authentication Flow

### Login Flow
1. User visits /login
2. Options: Email/Password, Google, GitHub
3. For Email: Submit credentials
4. Server validates credentials with bcrypt
5. On success: Session created, redirect to /dashboard
6. For OAuth: Redirect to provider, callback creates/updates user

### Registration Flow
1. User visits /register
2. Fills: Name, Email, Password, Confirm Password
3. Password hashed with bcrypt (12 rounds)
4. User created in database
5. Auto-login: Session created, redirect to /dashboard

### Session Management
- JWT strategy for sessions
- Sessions stored in database via Supabase adapter
- Middleware checks authentication on protected routes
- Session includes user ID for authorization

## Image Upload Flow

### Upload Process
1. User selects image in form
2. Client validates: type (image/*), size (max 5MB)
3. Image uploaded to Supabase Storage bucket
4. Supabase returns storage path
5. Path saved to database (not the full URL)
6. On display: Generate public URL with transformations

### Storage Path Structure
```
project-images/
├── {userId}/
│   └── {timestamp}-{userId}.{ext}
avatars/
├── {userId}/
│   └── avatar-{timestamp}.{ext}
```

### Image Optimization
- All images stored as uploaded
- On retrieval: Use Supabase transformations
- Parameters: width, height, quality, format (webp), fit
- Automatic CDN caching

## Data Fetching Strategy

### Public Pages (No Auth)
- Server Components: Direct database queries
- Static generation where possible
- Incremental Static Regeneration (ISR) for dynamic content
- Client-side search with React Query

### Protected Pages (Auth Required)
- Server Components: Check auth, then query database
- React Query for client-side caching
- Server Actions for mutations (create, update, delete)
- Revalidation on data changes

### Real-time Updates
- Optional: Supabase Realtime subscriptions
- Can implement for comments and likes
- Not required for core functionality

## Authorization Rules

| Route/Page | Public Access | Auth Required | Owner Only |
|------------|---------------|---------------|------------|
| Homepage | ✅ | ❌ | ❌ |
| All Projects | ✅ | ❌ | ❌ |
| Single Project | ✅ | ❌ | ❌ |
| Developer Profile | ✅ | ❌ | ❌ |
| Dashboard Home | ❌ | ✅ | ✅ |
| My Projects | ❌ | ✅ | ✅ |
| Create Project | ❌ | ✅ | ✅ |
| Edit Project | ❌ | ✅ | ✅ |
| Delete Project | ❌ | ✅ | ✅ |
| Profile Settings | ❌ | ✅ | ✅ |

### Authorization Checks
1. Middleware: Routes protection (dashboard requires auth)
2. Server Actions: Ownership verification for edits/deletes
3. API Routes: Authentication and ownership checks

## Deployment on Render

### Steps to Deploy:
1. Push code to GitHub repository
2. Connect Render to GitHub
3. Select repository
4. Configure build settings:
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`
5. Set all environment variables
6. Deploy
7. Run database migrations (`npx prisma migrate deploy`)
8. Verify all features

### Environment Variables Required:
- Database URL (pooler and direct)
- Supabase credentials
- NextAuth secret and URL
- OAuth provider credentials
- App URL

## Security Measures

1. **Authentication:** JWT-based sessions with secure cookies
2. **Passwords:** Hashed with bcrypt (12 rounds)
3. **Input Validation:** Zod schemas on all inputs
4. **XSS Prevention:** Automatic escaping in React
5. **CSRF Protection:** NextAuth built-in protection
6. **File Upload:** Type checking, size limits
7. **SQL Injection:** Prisma parameterized queries
8. **Rate Limiting:** On API routes (optional but recommended)
9. **Security Headers:** Added via Next.js config

## Responsive Design

**Breakpoints:**
- Mobile: < 640px (stack layout, hamburger menu)
- Tablet: 640px - 1024px (grid with 2-3 columns)
- Desktop: > 1024px (full layout, 3-4 columns)

## Development Checklist

### Phase 1: Setup
- Initialize Next.js with TypeScript and Tailwind
- Install all dependencies
- Create Supabase project and configure
- Setup Prisma schema and database
- Configure NextAuth with providers

### Phase 2: Core Features
- Implement authentication (login, register, OAuth)
- Create database models and relations
- Build dashboard layout with sidebar
- Implement project CRUD operations
- Setup image upload to Supabase Storage

### Phase 3: Public Pages
- Build homepage with featured projects
- Create all projects page with search
- Implement single project view
- Build developer profile pages

### Phase 4: Dashboard Pages
- Create dashboard home with stats
- Build my projects list with actions
- Implement project creation form
- Create project edit page
- Build profile settings page

### Phase 5: Polish & Testing
- Add loading states and skeletons
- Implement toast notifications
- Create error handling
- Make fully responsive
- Test all authentication flows
- Test CRUD operations
- Performance optimization

### Phase 6: Deployment
- Set up production environment variables
- Deploy to Render
- Run database migrations
- Test in production
- Monitor and debug

## Resources

### Official Documentation
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [Supabase](https://supabase.com/docs)
- [NextAuth.js](https://authjs.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)

### Useful Tools
- [Shadcn UI](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Framer Motion](https://www.framer.com/motion)
- [Zod](https://zod.dev)
- [React Query](https://tanstack.com/query/latest)

## Next Steps for Team

1. **Team Lead:** Set up repository and project environment
2. **Frontend Team:** Implement pages and components from wireframes
3. **Backend Team:** Set up database, authentication, and API routes
4. **Design Team:** Create detailed UI mockups (if needed)
5. **QA Team:** Prepare test cases for all features

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account
- GitHub account (for OAuth)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Community-Website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file with:
- Database URL
- Supabase credentials
- NextAuth secret
- OAuth provider credentials

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Contributing

Let's work together, communicate regularly, and deliver a professional community platform that showcases our skills and teamwork.

## License

This project is developed for educational purposes as part of the System Analysis & Design course.
