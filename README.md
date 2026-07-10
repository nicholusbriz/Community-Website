# 🌐 Community Website

A community platform where developers can showcase their projects, connect with peers, and explore innovative work. Public users can browse projects without authentication, while registered users enjoy full CRUD functionality and personalized dashboards.

---

## 🚀 Features

- **Authentication**
  - Email/Password
  - Google OAuth
  - GitHub OAuth
- **Project Showcase**
  - Upload project images with descriptions and external URLs
  - Optimized image hosting via Supabase Storage
- **Developer Profiles**
  - Display all projects by a developer
  - Bio, GitHub, and website links
- **Public Browsing**
  - Explore and search projects without login
- **Dashboard**
  - Manage personal projects (Create, Read, Update, Delete)
  - View statistics (total projects, views, published/drafts)
- **Feedback**
  - Likes and comments on projects
- **UI Enhancements**
  - Smooth animations, toast notifications, reusable components

---

## 🛠️ Tech Stack

### Core
- **Next.js** v16+
- **TypeScript** v5+
- **Node.js** v20+

### Frontend Libraries
- React
- Tailwind CSS
- Framer Motion
- React Hook Form + Zod
- Shadcn/ui (Radix UI components)
- React Query
- Sonner (toast notifications)
- Lucide React (icons)

### Backend & Database
- Prisma (ORM)
- NextAuth.js (Auth.js)
- Supabase Client
- bcryptjs
- Supabase PostgreSQL (database)
- Supabase Storage (image hosting)
- Supavisor (connection pooling)

---

## 📂 Project Structure

devshowcase-community/
├── prisma/              # Database schema & seed
├── public/              # Static assets (images, fonts, favicon)
├── src/
│   ├── app/             # App Router pages
│   ├── components/      # UI, forms, auth, shared components
│   ├── lib/             # Config (auth, prisma, supabase, utils)
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript definitions
│   └── middleware/      # Auth middleware
└── docker-compose.yml   # Local development (optional)

Code

---

## 🗄️ Database Models

- **User**: profile, auth data, relations to projects, likes, comments
- **Account**: OAuth provider connections
- **Project**: title, description, image, URL, views, published/draft
- **Like**: tracks user likes per project
- **Comment**: user feedback and discussion
- **Session & VerificationToken**: managed by NextAuth

---

## 📑 Pages Overview

- `/` – Homepage with featured projects
- `/projects` – Browse/search all projects
- `/project/[id]` – Single project details
- `/developer/[username]` – Developer profile
- `/dashboard` – User dashboard (protected)
- `/dashboard/projects` – Manage projects
- `/dashboard/projects/new` – Create project
- `/dashboard/projects/[id]/edit` – Edit project

---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/community-website.git
   cd community-website
Install dependencies

bash
npm install
Configure environment variables

Create .env.local file

Add Supabase keys, NextAuth secrets, database URL

Run database migrations

bash
npx prisma migrate dev
Start development server

bash
npm run dev
🔒 Authentication
Email/password with secure hashing (bcryptjs)

OAuth via Google & GitHub

Supabase adapter for NextAuth.js

📸 Image Hosting
Supabase Storage with automatic optimization

CDN delivery and resizing for performance

🤝 Contributing
Contributions are welcome!

Fork the repo

Create a feature branch

Submit a pull request

📜 License
This project is licensed under the MIT License.
