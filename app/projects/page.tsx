'use client';

import { useState } from 'react';
import { Filter, Heart, MessageCircle, ArrowRight } from 'lucide-react';
import PublicLayout from '../public-layout';
import { PageHeader } from '../../components/placeholders/page-header';
import { FilterBar } from '../../components/placeholders/filter-bar';
import { PageShell } from '../../components/placeholders/page-shell';
import { ProjectCard } from '../../components/placeholders/project-card';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [sortBy, setSortBy] = useState('Newest');

  const projects = [
    { id: 1, title: 'AI Chat App', languages: ['React', 'TypeScript'], tags: ['AI', 'Chat'], owner: 'Sarah', likes: 45, comments: 12, href: '/project/1' },
    { id: 2, title: 'DevPortfolio', languages: ['Next.js', 'TypeScript'], tags: ['Portfolio', 'Web'], owner: 'Mike', likes: 32, comments: 8, href: '/project/2' },
    { id: 3, title: 'React Dashboard', languages: ['React', 'Tailwind'], tags: ['Dashboard', 'UI'], owner: 'Emily', likes: 28, comments: 15, href: '/project/3' },
    { id: 4, title: 'EcoTracker', languages: ['Python', 'Django'], tags: ['Environment', 'Data'], owner: 'James', likes: 21, comments: 6, href: '/project/4' },
    { id: 5, title: 'Task Manager', languages: ['Vue', 'TypeScript'], tags: ['Productivity', 'SaaS'], owner: 'Lisa', likes: 18, comments: 9, href: '/project/5' },
    { id: 6, title: 'Social Media App', languages: ['React Native', 'Firebase'], tags: ['Mobile', 'Social'], owner: 'David', likes: 15, comments: 11, href: '/project/6' },
  ];

  const languages = ['All Languages', 'React', 'Next.js', 'Vue', 'Python', 'TypeScript', 'JavaScript'];
  const tags = ['All Tags', 'AI', 'Web', 'Mobile', 'Dashboard', 'SaaS', 'Data'];
  const sortOptions = ['Newest', 'Most Liked', 'Most Comments', 'Oldest'];

  return (
    <PublicLayout>
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} id={project.id} title={project.title} tech={project.languages[0]} owner={project.owner} likes={project.likes} href={project.href} />
            ))}
          </div>

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
        </div>
      </PageShell>
    </PublicLayout>
  );
}
