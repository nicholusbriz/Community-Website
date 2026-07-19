'use client';

import Link from 'next/link';
import { Users2, Sparkles, MessageCircleHeart, Compass, HandHeart, ArrowRight, Users, Target, Award, Globe } from 'lucide-react';

export default function CommunityPage() {
  const stats = [
    { label: 'Active Members', value: '1,200+', icon: Users },
    { label: 'Community Projects', value: '45+', icon: Target },
    { label: 'Mentors Available', value: '20+', icon: Award },
    { label: 'Countries', value: '30+', icon: Globe },
  ];

  const cards = [
    { 
      title: 'Peer Support', 
      description: 'Find accountability partners, teammates, and friends who share your technical goals.', 
      badge: 'Support', 
      href: '/join', 
      icon: Users2,
      color: 'blue'
    },
    { 
      title: 'Showcase Nights', 
      description: 'Share progress, pitch ideas, and discover what others are building in our community.', 
      href: '/events', 
      icon: Sparkles,
      color: 'purple'
    },
    { 
      title: 'Discussion Spaces', 
      description: 'Ask questions, exchange resources, and learn from communities of practice.', 
      href: '/faq', 
      icon: MessageCircleHeart,
      color: 'green'
    },
    { 
      title: 'Mentorship Network', 
      description: 'Connect with experienced guides who want to help you grow faster and smarter.', 
      href: '/mentors', 
      icon: HandHeart,
      color: 'orange'
    },
    { 
      title: 'Local Impact', 
      description: 'Work on initiatives that matter to schools, startups, nonprofits, and emerging regions.', 
      href: '/projects', 
      icon: Compass,
      color: 'red'
    },
  ];

  const getGradient = (color: string) => {
    const gradients = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-emerald-600',
      orange: 'from-orange-500 to-amber-600',
      red: 'from-red-500 to-rose-600',
    };
    return gradients[color as keyof typeof gradients] || 'from-blue-500 to-blue-600';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Community-first</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            A collaborative space for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">builders, learners, and leaders</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
            Our community brings together young professionals, students, mentors, and volunteers who want to solve local and global problems through technology.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/5 dark:to-purple-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            const gradient = getGradient(card.color);
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  <div className="mb-2 flex items-center gap-2">
                    {card.badge && (
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium bg-${card.color}-100 text-${card.color}-700 dark:bg-${card.color}-900/20 dark:text-${card.color}-400`}>
                        {card.badge}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {card.title}
                  </h2>
                  
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {card.description}
                  </p>
                  
                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to join our community?
            </h2>
            <p className="mt-3 text-blue-100 text-lg">
              Become part of a growing network of developers making a difference.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/join"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-900 transition-all hover:scale-105 hover:shadow-lg"
              >
                Join the community
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/mentors"
                className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-white/20 hover:scale-105"
              >
                Find a mentor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}