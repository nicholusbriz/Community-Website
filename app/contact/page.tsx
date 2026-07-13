'use client';

import { Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import Link from 'next/link';
// ❌ REMOVE: import PublicLayout from '../public-layout';

export default function ContactPage() {
  return (
    // ❌ REMOVE: <PublicLayout>
    <div className="min-h-screen bg-white py-16 text-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-[#0070f3]/8 to-[#7928ca]/8 p-8 sm:p-12">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
              <MessageSquare className="h-4 w-4 text-[#0070f3]" />
              Stay connected
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Tech Rise Africa</h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              Share questions, partnerships, support requests, or ideas with the team and the wider community.
            </p>
          </div>
        </section>

        {/* Contact Details */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column - Contact Info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-900">Reach the team</h2>
            <div className="mt-6 space-y-4">
              {[
                { icon: Mail, title: 'Email', detail: 'hello@techriseafrica.org', href: 'mailto:hello@techriseafrica.org' },
                { icon: Phone, title: 'Phone', detail: '+234 800 000 0000', href: 'tel:+2348000000000' },
                { icon: MapPin, title: 'Location', detail: 'Accra, Lagos, Nairobi and online', href: '#' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
                    <div className="rounded-lg bg-[#0070f3]/10 p-2 text-[#0070f3]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      {item.href && item.href.startsWith('mailto:') ? (
                        <a href={item.href} className="text-sm text-gray-600 hover:text-[#0070f3] transition-colors">
                          {item.detail}
                        </a>
                      ) : item.href && item.href.startsWith('tel:') ? (
                        <a href={item.href} className="text-sm text-gray-600 hover:text-[#0070f3] transition-colors">
                          {item.detail}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-600">{item.detail}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Preferred Channels */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-900">Preferred channels</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-gray-600">
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <p className="font-medium text-gray-900 mb-1">🤝 Partnerships</p>
                <p>For partnerships, please email us with your organization, goals, and preferred timeline.</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <p className="font-medium text-gray-900 mb-1">💬 Member Support</p>
                <p>For member support, use the community chat or contact the team directly and we will follow up within 48 hours.</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <p className="font-medium text-gray-900 mb-1">🎪 Event Collaboration</p>
                <p>For event collaboration, tell us your location, audience, and the kind of experience you want to host.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    // ❌ REMOVE: </PublicLayout>
  );
}