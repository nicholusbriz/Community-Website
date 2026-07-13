'use client';

import Link from 'next/link';
import { Users2, Sparkles, MessageCircleHeart, Compass, HandHeart, ArrowRight } from 'lucide-react';
// ❌ REMOVE: import PublicLayout from '../public-layout';

export default function CommunityPage() {
  const stats = [
    { label: 'Member circles', value: '8' },
    { label: 'Peer sessions', value: '40+' },
    { label: 'Community impact', value: 'Growing' },
  ];

  const cards = [
    { title: 'Peer Support', description: 'Find accountability partners, teammates, and friends who share your technical goals.', badge: 'Support', href: '/join', icon: Users2 },
    { title: 'Showcase Nights', description: 'Share progress, pitch ideas, and discover what others are building.', href: '/events', icon: Sparkles },
    { title: 'Discussion Spaces', description: 'Ask questions, exchange resources, and learn from communities of practice.', href: '/blog', icon: MessageCircleHeart },
    { title: 'Mentorship Network', description: 'Connect with experienced guides who want to help you grow faster and smarter.', href: '/mentors', icon: HandHeart },
    { title: 'Local Impact', description: 'Work on initiatives that matter to schools, startups, nonprofits, and emerging regions.', href: '/projects', icon: Compass },
  ];

  return (
    // ❌ REMOVE: <PublicLayout>
    <div className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0070f3]">Community-first</p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            A collaborative space for builders, learners, and leaders
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Our community brings together young professionals, students, mentors, and volunteers who want to solve local and global problems through technology.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 hover:shadow-md transition-shadow">
              <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
              <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-[#0070f3]" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  {card.badge && (
                    <span className="rounded-full bg-[#0070f3]/10 px-2.5 py-1 text-xs font-medium text-[#0070f3]">
                      {card.badge}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">Community</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-[#0070f3] transition-colors">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600">{card.description}</p>
              </Link>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/join"
            className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Become a member
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/mentors"
            className="inline-flex items-center rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Explore mentors
          </Link>
        </div>
      </div>
    </div>
    // ❌ REMOVE: </PublicLayout>
  );
}