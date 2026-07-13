'use client';

import { ArrowRight, ClipboardList, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';
// ❌ REMOVE: import PublicLayout from '../public-layout';

export default function JoinPage() {
  const steps = [
    { title: 'Sign up', text: 'Create your profile and tell us what you want to learn or build.' },
    { title: 'Choose your path', text: 'Pick a learning track, event, or mentorship opportunity.' },
    { title: 'Join the community', text: 'Get invited into peer circles, activities, and collaborative projects.' },
  ];

  return (
    // ❌ REMOVE: <PublicLayout>
    <div className="min-h-screen bg-white py-16 text-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-[#0070f3]/8 to-[#7928ca]/8 p-8 sm:p-12">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
              <Users className="h-4 w-4 text-[#0070f3]" />
              Join the movement
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Become part of Tech Rise Africa</h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              Join an active community of learners, builders, mentors, and volunteers who are creating real solutions together.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column - Membership Details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-900">What membership includes</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Open membership', value: 'Always' },
                { label: 'Community guidelines', value: 'Ready' },
                { label: 'Welcome support', value: 'Included' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0070f3] text-sm font-semibold text-white flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-gray-600">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 text-[#0070f3]">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-semibold text-gray-900">Community guidelines</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Respect, collaboration, growth, and inclusion are the foundation of everything we do together.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 text-[#0070f3]">
                <ClipboardList className="h-5 w-5" />
                <h3 className="font-semibold text-gray-900">Get involved</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Learn, build, mentor, volunteer, or support community projects at your own pace.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Contact the team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>
      </div>
    </div>
    // ❌ REMOVE: </PublicLayout>
  );
}