'use client';

import { useState, type ReactNode } from 'react';
import { Filter, ArrowRight, Star, Database, Table, Users, Search, Code2, Award, Shield, User, Crown } from 'lucide-react';
import PublicLayout from '../public-layout';

function PageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gray-50 text-black">{children}</div>;
}

function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{title}</h1>
      <p className="mt-2 max-w-2xl text-lg text-gray-600">{description}</p>
    </div>
  );
}

function FilterBar({ searchValue, onSearchChange, searchPlaceholder, filters }: { searchValue: string; onSearchChange: (value: string) => void; searchPlaceholder: string; filters: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none ring-0"
          />
        </div>
        <div className="flex flex-wrap gap-3">{filters}</div>
      </div>
    </div>
  );
}

function DeveloperCard({ name, role, skills, projects, stars, username, isActive }: { name: string; role: string; skills: string[]; projects: number; stars: number; username: string; isActive?: boolean }) {
  return (
    <a href={`/developer/${username}`} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0070f3] to-[#7928ca] font-semibold text-white">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>
        {isActive && <span className="text-sm text-green-600">● Active</span>}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
            {skill}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{projects} projects</span>
        <span>{stars} stars</span>
      </div>
    </a>
  );
}

export default function DevelopersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [sortBy, setSortBy] = useState('Most Active');

  // ============================================================
  // 📊 DATA SOURCE: users table (ALL USERS)
  // 🔗 API: GET /api/users?limit=20&page=1
  // 📋 FIELDS: id, name, role, skills, projects, stars, avatar, bio, github, linkedin, last_active, created_at
  // 🔍 QUERY: 
  //   SELECT u.id, u.name, u.role, u.skills, 
  //          COUNT(p.id) as projects, 
  //          COALESCE(SUM(p.stars), 0) as stars,
  //          u.avatar, u.bio, u.github, u.linkedin, u.last_active, u.created_at
  //   FROM users u
  //   LEFT JOIN projects p ON u.id = p.user_id AND p.status = 'published'
  //   WHERE u.is_active = true
  //   GROUP BY u.id, u.name, u.role, u.skills, u.avatar, u.bio, u.github, u.linkedin, u.last_active, u.created_at
  //   ORDER BY 
  //     CASE WHEN 'Most Active' THEN u.last_active DESC END,
  //     CASE WHEN 'Most Projects' THEN COUNT(p.id) DESC END,
  //     CASE WHEN 'Most Stars' THEN COALESCE(SUM(p.stars), 0) DESC END,
  //     CASE WHEN 'Newest' THEN u.created_at DESC END
  //   LIMIT 20 OFFSET 0
  // ============================================================
  const users = [
    // SUPER ADMIN (Role: superadmin)
    { id: 1, name: 'Alex Rivera', username: 'alexrivera', role: 'superadmin', skills: ['React', 'Next.js', 'Node.js', 'AWS'], projects: 15, stars: 89, isActive: true },
    // ADMINS (Role: admin)
    { id: 2, name: 'Sarah Johnson', username: 'sarahjohnson', role: 'admin', skills: ['React', 'TypeScript', 'Python'], projects: 12, stars: 45, isActive: true },
    { id: 3, name: 'Mike Chen', username: 'mikechen', role: 'admin', skills: ['Next.js', 'Node.js', 'Docker'], projects: 10, stars: 32, isActive: true },
    // REGULAR USERS (Role: user)
    { id: 4, name: 'Emily Rodriguez', username: 'emilyrodriguez', role: 'user', skills: ['Figma', 'TypeScript'], projects: 8, stars: 28, isActive: true },
    { id: 5, name: 'David Kim', username: 'davidkim', role: 'user', skills: ['Docker', 'AWS', 'Kubernetes'], projects: 6, stars: 21, isActive: true },
    { id: 6, name: 'Lisa Thompson', username: 'lisathompson', role: 'user', skills: ['Agile', 'Scrum', 'Jira'], projects: 10, stars: 18, isActive: true },
    { id: 7, name: 'James Wilson', username: 'jameswilson', role: 'user', skills: ['Vue', 'Python', 'Django'], projects: 4, stars: 15, isActive: true },
    { id: 8, name: 'Priya Patel', username: 'priyapatel', role: 'user', skills: ['React Native', 'Firebase'], projects: 7, stars: 24, isActive: true },
  ];

  // ============================================================
  // 📊 DATA SOURCE: users table (distinct roles)
  // 🔗 API: GET /api/users/roles
  // 📋 FIELDS: role, count
  // 🔍 QUERY: SELECT role, COUNT(*) as count FROM users 
  //          WHERE is_active = true GROUP BY role
  // ============================================================
  const roles = [
    'All Roles',
    'superadmin',
    'admin',
    'user'
  ];

  // ============================================================
  // 📊 DATA SOURCE: users table (distinct skills)
  // 🔗 API: GET /api/users/skills
  // 📋 FIELDS: skill, count
  // 🔍 QUERY: SELECT DISTINCT UNNEST(skills) as skill FROM users 
  //          WHERE is_active = true ORDER BY skill ASC
  // ============================================================
  const skills = ['All Skills', 'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Docker', 'AWS', 'Figma', 'Vue', 'Firebase'];

  // ============================================================
  // 📊 DATA SOURCE: Static - Defined in code
  // ============================================================
  const sortOptions = ['Most Active', 'Most Projects', 'Most Stars', 'Newest'];

  // ============================================================
  // 📊 DATA SOURCE: users table (for total count)
  // 🔗 API: GET /api/users/count
  // 📋 FIELDS: total, byRole
  // 🔍 QUERY: SELECT COUNT(*) as total, 
  //                 COUNT(CASE WHEN role = 'superadmin' THEN 1 END) as superadmin,
  //                 COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin,
  //                 COUNT(CASE WHEN role = 'user' THEN 1 END) as user
  //          FROM users WHERE is_active = true
  // ============================================================
  const totalStats = {
    total: 156,
    superadmin: 3,
    admin: 12,
    user: 141,
    newThisWeek: 12
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'superadmin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'user':
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'superadmin':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'admin':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'user':
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const totalPages = Math.ceil(totalStats.total / 20);

  return (
    <PublicLayout>
      <PageShell>
        {/* ===== HEADER SECTION ===== */}
        {/* 
          📝 DATA: Static content - No database fetch needed
        */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Static Content</span>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500">No API fetch required</span>
        </div>
        <PageHeader 
          title="Community Members" 
          description="Discover and connect with all members in our community" 
        />

        {/* ===== STATS SECTION ===== */}
        {/* 
          📊 DATA SOURCE: users table
          🔗 API: GET /api/users/stats
          📋 FIELDS: total, superadmin, admin, user, newThisWeek
          🔍 QUERY:
            - total: SELECT COUNT(*) FROM users WHERE is_active = true
            - superadmin: SELECT COUNT(*) FROM users WHERE role = 'superadmin' AND is_active = true
            - admin: SELECT COUNT(*) FROM users WHERE role = 'admin' AND is_active = true
            - user: SELECT COUNT(*) FROM users WHERE role = 'user' AND is_active = true
            - newThisWeek: SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL 7 DAYS
        */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Data Source: users table</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">GET /api/users/stats</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{totalStats.total}</div>
              <p className="text-xs text-gray-600">Total Members</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalStats.superadmin}</div>
              <p className="text-xs text-gray-600">Super Admins</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalStats.admin}</div>
              <p className="text-xs text-gray-600">Admins</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{totalStats.user}</div>
              <p className="text-xs text-gray-600">Users</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{totalStats.newThisWeek}</div>
              <p className="text-xs text-gray-600">New This Week</p>
            </div>
          </div>
        </div>

        {/* ===== FILTER BAR SECTION ===== */}
        {/* 
          📝 DATA: Filters are UI elements
          📊 DATA SOURCE: roles from users table (for role filter)
          📊 DATA SOURCE: skills from users table (for skill filter)
          🔗 API: GET /api/users/roles, GET /api/users/skills
        */}
        <div className="flex items-center gap-2 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4">
          <Table className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Data Source: users table (filter options)</span>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500">GET /api/users/roles & /api/users/skills</span>
        </div>
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search members by name, skills, or role..."
          filters={
            <>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value)}
                  className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role === 'All Roles' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
                <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value)}
                  className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20"
                >
                  {skills.map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
                <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>Sort: {option}</option>
                  ))}
                </select>
                <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </>
          }
        />

        {/* ===== USERS GRID SECTION ===== */}
        {/* 
          📊 DATA SOURCE: users table (ALL USERS)
          🔗 API: GET /api/users?limit=20&page=1&role=admin&skill=React&sort=most_active
          📋 FIELDS: id, name, role, skills, projects, stars, avatar, bio, isActive
          🔍 QUERY: See full query above
        */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Table className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Data Source: users table</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">GET /api/users?limit=20&page=1</span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0070f3] to-[#7928ca] flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <div className="flex items-center gap-1">
                        {getRoleIcon(user.role)}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {user.isActive && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Active
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {user.skills.map((skill) => (
                    <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Code2 className="w-4 h-4" />
                    {user.projects} projects
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {user.stars} stars
                  </span>
                </div>

                <a
                  href={`/developer/${user.username}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#0070f3] hover:text-[#7928ca] transition-colors"
                >
                  View Profile →
                </a>
              </div>
            ))}
          </div>

          {/* ===== PAGINATION SECTION ===== */}
          {/* 
            📊 DATA SOURCE: users table (for total count)
            🔗 API: GET /api/users/count
          */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Data Source: users table</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">GET /api/users/count</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`h-10 w-10 rounded-lg font-medium transition-colors ${
                    page === 1
                      ? 'bg-[#0070f3] text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-gray-600 transition-colors hover:bg-gray-50">
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500">Showing 1-20 of {totalStats.total} community members</p>
          </div>
        </div>
      </PageShell>
    </PublicLayout>
  );
}