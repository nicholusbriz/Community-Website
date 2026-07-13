'use client';

import Link from 'next/link';
import { CalendarDays, Mic2, Laptop2, Sparkles, Users2, ArrowRight } from 'lucide-react';
// ❌ REMOVE: import PublicLayout from '../public-layout';

export default function EventsPage() {
  const stats = [
    { label: 'Monthly events', value: '6' },
    { label: 'Workshop seats', value: '300+' },
    { label: 'Partner communities', value: '12' },
  ];

  const cards = [
    { title: 'Tech Talk Series', description: 'Live conversations with founders, engineers, and product leaders on current tech trends.', badge: 'Live', href: '/contact', icon: Mic2 },
    { title: 'Build Labs', description: 'Hands-on coding and prototyping sessions that turn ideas into working products.', href: '/programs', icon: Laptop2 },
    { title: 'Community Hackathons', description: 'Collaborative problem-solving challenges focused on real-world community needs.', href: '/join', icon: Sparkles },
    { title: 'Networking Nights', description: 'Meet peers and mentors in relaxed, welcoming spaces built for meaningful conversation.', href: '/community', icon: Users2 },
  ];

  return (
    // ❌ REMOVE: <PublicLayout>
    <div className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0070f3]">Upcoming experiences</p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Events designed to spark learning and connection
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            From industry talks to build sprints, our events give members a chance to learn, network, and grow in public.
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

        {/* Event Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
                {card.badge && (
                  <span className="mb-3 inline-flex rounded-full bg-[#0070f3]/10 px-2.5 py-1 text-xs font-medium text-[#0070f3]">
                    {card.badge}
                  </span>
                )}
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
            Reserve your place
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Ask about partnerships
          </Link>
        </div>
      </div>
    </div>
    // ❌ REMOVE: </PublicLayout>
  );
}