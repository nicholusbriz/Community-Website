// app/projects/page.tsx
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Filter, Heart, MessageCircle, ArrowRight, Star, User, MapPin, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

function ProjectCard({ 
  title, 
  tech, 
  owner, 
  ownerImage,
  ownerId,
  description,
  likes, 
  href, 
  isLoading 
}: { 
  title?: string; 
  tech?: string[]; 
  owner?: string; 
  ownerImage?: string;
  ownerId?: string;
  description?: string;
  likes?: number; 
  href?: string; 
  isLoading?: boolean 
}) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl overflow-hidden group">
      {/* Card Header - Clickable for project details */}
      <Link href={href || '#'} className="block p-6">
        {/* Tech Stack Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {tech && tech.length > 0 ? (
            tech.slice(0, 3).map((t, index) => (
              <span key={index} className="rounded-full bg-[#0070f3]/10 px-3 py-1 text-xs font-medium text-[#0070f3]">
                {t}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              Unknown
            </span>
          )}
          {tech && tech.length > 3 && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              +{tech.length - 3}
            </span>
          )}
        </div>

        {/* Project Title */}
        <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-[#0070f3] transition-colors">
          {title || 'Untitled Project'}
        </h3>

        {/* Project Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{likes || 0} members</span>
          </div>
        </div>
      </Link>

      {/* Card Footer - Owner Profile Section */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Owner Profile - Clickable */}
          <Link 
            href={`/developers/${ownerId}`}
            className="flex items-center gap-3 group/profile hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
          >
            {/* Owner Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              {ownerImage ? (
                <Image
                  src={ownerImage}
                  alt={owner || 'Owner avatar'}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                  {owner?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            {/* Owner Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-900 group-hover/profile:text-[#0070f3] transition-colors">
                  {owner || 'Unknown Owner'}
                </span>
                <User className="h-3 w-3 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">Project Owner</p>
            </div>

            {/* External Link Icon */}
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover/profile:text-[#0070f3] transition-colors" />
          </Link>

          {/* View Project Button */}
          <Link 
            href={href || '#'}
            className="text-sm font-medium text-[#0070f3] hover:text-[#0050d0] transition-colors flex items-center gap-1"
          >
            View Project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
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
          tech: project.techStack || [],
          owner: project.owner?.name || 'Unknown',
          ownerImage: project.owner?.image || null,
          ownerId: project.owner?.id || null,
          description: project.description || null,
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