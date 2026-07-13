'use client';

import { BadgeCheck, Camera, ImageIcon, Sparkles, Video, Database, Table } from 'lucide-react';
// ❌ REMOVE: import PublicLayout from '../public-layout';
import Link from 'next/link';

export default function GalleryPage() {
  // ============================================================
  // 📊 DATA SOURCE: gallery table
  // 🔗 API: GET /api/gallery?limit=10&page=1
  // 📋 FIELDS: id, title, description, imageUrl, type, category, 
  //            uploadedBy, uploadedAt, likes, views
  // 🔍 QUERY: 
  //   SELECT id, title, description, image_url, type, category,
  //          uploaded_by, uploaded_at, likes, views
  //   FROM gallery 
  //   WHERE status = 'published' 
  //   ORDER BY uploaded_at DESC 
  //   LIMIT 10 OFFSET 0
  // ============================================================
  const galleryItems = [
    { title: 'Bootcamp highlights', description: 'Hands-on workshops and demo day moments from recent cohorts.', icon: Camera },
    { title: 'Community showcases', description: 'Member projects displayed in vibrant, collaborative spaces.', icon: ImageIcon },
    { title: 'Workshop recaps', description: 'Snapshots from sessions that helped members build confidence.', icon: Video },
    { title: 'Milestones', description: 'Celebrations of growth, awards, and impact stories.', icon: BadgeCheck },
  ];

  // ============================================================
  // 📊 DATA SOURCE: gallery table (for total count)
  // 🔗 API: GET /api/gallery/count
  // 📋 FIELDS: total
  // 🔍 QUERY: SELECT COUNT(*) as total FROM gallery 
  //          WHERE status = 'published'
  // ============================================================
  const totalItems = 48;

  return (
    // ❌ REMOVE: <PublicLayout>
    <div className="min-h-screen bg-white py-16 text-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* ===== DATA SOURCE NOTE ===== */}
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Data Source: gallery table</span>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500">GET /api/gallery?limit=10&page=1</span>
        </div>

        {/* ===== HEADER SECTION ===== */}
        <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-[#0070f3]/8 to-[#7928ca]/8 p-8 sm:p-12">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-[#0070f3]" />
              Moments and milestones
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">A visual story of community growth</h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              This gallery highlights the energy, outcomes, and connections that make Tech Rise Africa a vibrant place to learn and build.
            </p>
          </div>
        </section>

        {/* ===== GALLERY GRID ===== */}
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Data Source: gallery table</span>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500">GET /api/gallery</span>
        </div>
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {galleryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0070f3]/10 text-[#0070f3]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </section>

        {/* ===== PAGINATION ===== */}
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Data Source: gallery table</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">GET /api/gallery/count</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`h-10 w-10 rounded-lg font-medium flex items-center justify-center transition-colors ${
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
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500">Showing 1-8 of {totalItems} gallery items</p>
        </div>
      </div>
    </div>
    // ❌ REMOVE: </PublicLayout>
  );
}