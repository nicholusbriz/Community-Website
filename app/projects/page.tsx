// app/projects/page.tsx
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Filter, Heart, MessageCircle, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

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
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 px-4 text-sm outline-none focus:border-[#0070f3] focus:ring-2 focus:ring-[#0070f3]/20"
          />
        </div>
        <div className="flex flex-wrap gap-3">{filters}</div>
      </div>
    </div>
  );
}

function ProjectCard({ title, tech, owner, likes, href, isLoading }: { title?: string; tech?: string; owner?: string; likes?: number; href?: string; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <Link href={href || '#'} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl block">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-[#0070f3]/10 px-3 py-1 text-sm font-medium text-[#0070f3]">{tech || 'Unknown'}</span>
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <Star className="h-4 w-4 text-yellow-400" />
          {likes || 0}
        </span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title || 'Untitled'}</h3>
      <p className="text-sm text-gray-600">By {owner || 'Unknown'}</p>
    </Link>
  );
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [sortBy, setSortBy] = useState('Newest');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        
        // Build query params
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedLanguage !== 'All Languages') params.append('language', selectedLanguage);
        if (selectedTag !== 'All Tags') params.append('tag', selectedTag);
        
        const response = await fetch(`/api/projects?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        
        // Transform API data to match your project card format
        const formattedProjects = data.projects.map((project: any) => ({
          id: project.id,
          title: project.title,
          tech: project.techStack && project.techStack.length > 0 ? project.techStack[0] : 'Unknown',
          owner: project.owner?.name || 'Unknown',
          likes: project._count?.members || 0,
          href: `/projects/${project.slug}`,
          // Keep original data for filtering
          languages: project.techStack || [],
          tags: project.tags || [],
          comments: project._count?.tasks || 0,
        }));
        
        setProjects(formattedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, [searchQuery, selectedLanguage, selectedTag]); // Re-fetch when filters change

  // Filter projects (already filtered by API, but we can do additional client-side filtering if needed)
  const filteredProjects = projects;

  const languages = ['All Languages', 'React', 'Next.js', 'Vue', 'Python', 'TypeScript', 'JavaScript', 'Django', 'Node.js'];
  const tags = ['All Tags', 'AI', 'Web', 'Mobile', 'Dashboard', 'SaaS', 'Data', 'Chat', 'Portfolio'];
  const sortOptions = ['Newest', 'Most Liked', 'Most Comments', 'Oldest'];

  return (
    <PageShell>
      <PageHeader title="All Projects" description="Browse and discover amazing projects from our community" />

      <FilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search projects..."
        filters={
          <>
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(event) => setSelectedLanguage(event.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={selectedTag}
                onChange={(event) => setSelectedTag(event.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20"
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProjectCard key={i} isLoading={true} />
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No projects found</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or create a new project</p>
                <Link 
                  href="/dashboard/projects/new" 
                  className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Project
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((page) => (
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
        )}
      </div>
    </PageShell>
  );
}