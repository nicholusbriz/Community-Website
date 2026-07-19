'use client';

import { Mail, MapPin, MessageSquare, Phone, Users, Globe, Clock, ArrowRight, Send } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const contactInfo = [
    { 
      icon: Mail, 
      title: 'Email', 
      detail: 'atbriz256@gmail.com', 
      href: 'mailto:atbriz256@gmail.com',
      description: 'Send us an email and we\'ll respond within 24 hours'
    },
    { 
      icon: Phone, 
      title: 'WhatsApp', 
      detail: '+256 761 996 296', 
      href: 'https://wa.me/256761996296',
      description: 'Chat with us directly on WhatsApp'
    },
    { 
      icon: MapPin, 
      title: 'Locations', 
      detail: 'Nairobi & Lagos',
      href: '#',
      description: 'We have community hubs in both cities'
    },
    { 
      icon: Globe, 
      title: 'Online', 
      detail: 'Global Community',
      href: '#',
      description: 'Join our virtual events from anywhere'
    },
  ];

  const quickLinks = [
    {
      title: 'Join the Community',
      description: 'Become a member and start collaborating',
      href: '/join',
      icon: Users
    },
    {
      title: 'FAQ',
      description: 'Find answers to common questions',
      href: '/faq',
      icon: MessageSquare
    },
    {
      title: 'Community Guidelines',
      description: 'Learn how we work together',
      href: '/faq',
      icon: Globe
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 mb-16">
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <MessageSquare className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Get in touch</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let's connect
            </h1>
            <p className="mt-5 text-lg leading-8 text-blue-100 max-w-2xl">
              Have questions, ideas, or want to collaborate? Reach out to us through any of the channels below.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {contactInfo.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-6 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                {item.href && (item.href.startsWith('mailto:') || item.href.startsWith('https://')) ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('https://') ? '_blank' : undefined}
                    rel={item.href.startsWith('https://') ? 'noopener noreferrer' : undefined}
                    className="mt-1 block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {item.detail}
                  </a>
                ) : (
                  <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.detail}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Main Content - Two Column Layout */}
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left Column - Get in Touch */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Get in touch</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We'd love to hear from you! Whether you have questions about joining, 
                want to collaborate, or just want to say hello, don't hesitate to reach out.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email</p>
                    <a href="mailto:atbriz256@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                      atbriz256@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800">
                  <Phone className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">WhatsApp</p>
                    <a href="https://wa.me/256761996296" target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:underline">
                      +256 761 996 296
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800">
                  <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Locations</p>
                    <p className="text-gray-600 dark:text-gray-400">Nairobi, Kenya & Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Links */}
          <aside className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick links
              </h2>
              <div className="space-y-3">
                {quickLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block group rounded-xl bg-white dark:bg-[#1a1a1a] p-4 hover:shadow-md transition-all hover:-translate-y-0.5 border border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-2.5 group-hover:scale-110 transition-transform">
                          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Hours Card */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Response times</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center justify-between">
                  <span>Email</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Within 24 hours</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>WhatsApp</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Within 2 hours</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Community chat</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">Real-time</span>
                </p>
              </div>
            </div>

            {/* Social/Community CTA */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
              <Users className="h-8 w-8 text-white/80 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">
                Join our community
              </h3>
              <p className="text-sm text-blue-100 mb-4">
                Connect with developers from around the world
              </p>
              <Link
                href="/join"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 transition-all hover:scale-105 hover:shadow-lg"
              >
                Join now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}