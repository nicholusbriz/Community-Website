'use client';

import { CircleHelp, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
// ❌ REMOVE: import PublicLayout from '../public-layout';

export default function FAQPage() {
  const faqs = [
    {
      question: 'How do I join Tech Rise Africa?',
      answer: 'You can join by visiting the join page, creating your profile, and selecting the community path that fits you best.',
    },
    {
      question: 'What programs are available?',
      answer: 'We offer tracks in web development, mobile development, AI, cybersecurity, UI/UX, and data analytics.',
    },
    {
      question: 'Do I need experience to participate?',
      answer: 'No. Our programs welcome beginners, intermediate builders, and advanced members who want to contribute and grow.',
    },
    {
      question: 'How do I get help or ask questions?',
      answer: 'You can reach the team through the contact page or join our community discussions and events.',
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
              <CircleHelp className="h-4 w-4 text-[#0070f3]" />
              Questions answered
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Frequently asked questions about Tech Rise Africa
            </h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              A clear starting point for newcomers, members, mentors, and partners who want to understand how the community works.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column - FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details 
                key={faq.question} 
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <summary className="cursor-pointer text-lg font-semibold text-gray-900 hover:text-[#0070f3] transition-colors flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-[#0070f3] group-open:rotate-180 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Need direct support?</h2>
            <div className="space-y-3">
              {[
                { icon: MessageSquare, title: 'Contact us', text: 'Ask questions, share ideas, or request partner support.' },
                { icon: ShieldCheck, title: 'Community guidelines', text: 'Learn how members are expected to collaborate and contribute.' },
                { icon: Sparkles, title: 'Programs', text: 'Explore tracks, learning opportunities, and events in one place.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-[#0070f3]/10 p-2 text-[#0070f3]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{item.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0070f3] hover:text-[#7928ca] transition-colors"
            >
              Ask the team
              <CircleHelp className="h-4 w-4" />
            </Link>
          </aside>
        </section>
      </div>
    </div>
    // ❌ REMOVE: </PublicLayout>
  );
}