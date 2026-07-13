'use client';

import { BadgeCheck, HeartHandshake, MessageSquareQuote, Sparkles } from 'lucide-react';
// ❌ REMOVE: import PublicLayout from '../public-layout';
import Link from 'next/link';

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: 'Lina A.',
      role: 'Student member',
      quote: 'The community gave me structure, confidence, and a network that helped me turn my ideas into real projects.',
    },
    {
      name: 'Tariq B.',
      role: 'Volunteer mentor',
      quote: 'I have seen young builders gain clarity, momentum, and support by showing up consistently and learning together.',
    },
    {
      name: 'Mina K.',
      role: 'Community partner',
      quote: 'The energy in this community is practical, welcoming, and deeply focused on helping people grow.',
    },
  ];

  return (
    // ❌ REMOVE: <PublicLayout>
    <div className="min-h-screen bg-white py-16 text-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-[#0070f3]/8 to-[#7928ca]/8 p-8 sm:p-12">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-[#0070f3]" />
              Member voices
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Stories of growth, confidence, and impact</h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              These stories reflect the practical support, mentorship, and momentum that members experience inside Tech Rise Africa.
            </p>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex gap-2 text-[#0070f3]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Sparkles key={star} className="h-4 w-4" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-gray-600">“{testimonial.quote}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 text-sm font-semibold text-[#0070f3]">
                  {testimonial.name.split(' ').map((part) => part[0]).join('')}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{testimonial.name}</h2>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Share your story</h2>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                If you have grown through the community, we would love to feature your journey as part of our next highlight.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:hello@techriseafrica.org"
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                <BadgeCheck className="h-4 w-4" />
                Share your story
              </a>
              <Link
                href="/community"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <HeartHandshake className="h-4 w-4" />
                Explore community
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
    // ❌ REMOVE: </PublicLayout>
  );
}