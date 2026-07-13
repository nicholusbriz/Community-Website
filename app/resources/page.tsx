'use client';

import { BookOpen, Compass, FileText, Laptop2, Sparkles } from 'lucide-react';
import Link from 'next/link';
// ❌ REMOVE: import PublicLayout from '../public-layout';

export default function ResourcesPage() {
  const resourceGroups = [
    {
      title: 'Roadmaps',
      description: 'Clear learning paths for web development, mobile, AI, and data.',
      badge: 'Free',
      href: '/programs',
      icon: Compass,
    },
    {
      title: 'Templates',
      description: 'Project briefs, CV templates, and portfolio checklists to speed up your launch.',
      href: '/projects',
      icon: FileText,
    },
    {
      title: 'Learning library',
      description: 'Curated articles, videos, and reading lists from mentors and partners.',
      href: '/blog',
      icon: BookOpen,
    },
    {
      title: 'Recommended tools',
      description: 'Tools our members use for design, collaboration, coding, and delivery.',
      href: '/contact',
      icon: Laptop2,
    },
    {
      title: 'Starter kits',
      description: 'Ready-to-use starter files that help you begin faster and avoid setup friction.',
      href: '/projects',
      icon: Sparkles,
    },
  ];

  return (
    // ❌ REMOVE: <PublicLayout>
    <div className="min-h-screen bg-white py-16 text-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-[#0070f3]/8 to-[#7928ca]/8 p-8 sm:p-12">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
              <BookOpen className="h-4 w-4 text-[#0070f3]" />
              Knowledge hub
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Resources to help you learn faster and build smarter
            </h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              We are curating free guides, starter kits, roadmaps, and tools that support members at every level.
            </p>
          </div>
        </section>

        {/* Resource Cards Grid */}
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resourceGroups.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                {item.badge && (
                  <span className="mb-3 inline-flex rounded-full bg-[#0070f3]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0070f3]">
                    {item.badge}
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#0070f3]/10 p-2 text-[#0070f3]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                </div>
                <p className="mt-3 text-sm leading-7 text-gray-600">{item.description}</p>
                <Link
                  href={item.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0070f3] hover:text-[#7928ca] transition-colors"
                >
                  Browse resource
                  <BookOpen className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </section>
      </div>
    </div>
    // ❌ REMOVE: </PublicLayout>
  );
}