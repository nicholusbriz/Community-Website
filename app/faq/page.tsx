'use client';

import { CircleHelp, MessageSquare, ShieldCheck, Sparkles, Users, BookOpen, ArrowRight, Mail, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      question: 'How do I join the community?',
      answer: 'You can join by visiting the join page, creating your profile, and selecting the community path that fits you best. It takes just a few minutes to get started.',
    },
    {
      question: 'What programs are available?',
      answer: 'We offer tracks in web development, mobile development, AI, cybersecurity, UI/UX, and data analytics. Each program is designed to help you grow at your own pace.',
    },
    {
      question: 'Do I need experience to participate?',
      answer: 'No. Our programs welcome beginners, intermediate builders, and advanced members who want to contribute and grow. Everyone has something to learn and share.',
    },
    {
      question: 'How do I get help or ask questions?',
      answer: 'You can reach the team through the contact page, join our community discussions, or attend our regular events and office hours.',
    },
    {
      question: 'Can I contribute as a mentor?',
      answer: 'Absolutely! We\'re always looking for experienced professionals to guide and support our community members. Reach out to learn more about our mentorship program.',
    },
    {
      question: 'What\'s the time commitment?',
      answer: 'The time commitment is flexible. You can participate as much or as little as you want, whether it\'s a few hours a week or daily engagement.',
    },
  ];

  const supportItems = [
    { 
      icon: MessageSquare, 
      title: 'Contact Support', 
      text: 'Have questions? Our team is here to help you get started.',
      href: '/contact'
    },
    { 
      icon: Shield, 
      title: 'Community Guidelines', 
      text: 'Learn how members are expected to collaborate and contribute.',
      href: '/projects'
    },
    { 
      icon: BookOpen, 
      title: 'Programs Overview', 
      text: 'Explore tracks, learning opportunities, and events in one place.',
      href: '/developers'
    },
    { 
      icon: Users, 
      title: 'Join Discussions', 
      text: 'Connect with other members in our community forums.',
      href: '/projects'
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
              <CircleHelp className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">FAQ</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Frequently asked questions
            </h1>
            <p className="mt-5 text-lg leading-8 text-blue-100 max-w-2xl">
              Everything you need to know about getting started, participating, and growing with our community.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left Column - FAQ List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Top Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details 
                  key={index} 
                  className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] shadow-sm hover:shadow-md transition-all"
                >
                  <summary className="cursor-pointer px-6 py-4 text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      {faq.question}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 group-open:rotate-180 transition-transform duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-4 pt-1">
                    <p className="text-sm leading-7 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Get Support
              </h2>
              <div className="space-y-3">
                {supportItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block group rounded-xl bg-white dark:bg-[#1a1a1a] p-4 hover:shadow-md transition-all hover:-translate-y-0.5 border border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-2.5 group-hover:scale-110 transition-transform">
                          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Card */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
              <Mail className="h-8 w-8 text-white/80 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">
                Still have questions?
              </h3>
              <p className="text-sm text-blue-100 mb-4">
                Our team is ready to help you out
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 transition-all hover:scale-105 hover:shadow-lg"
              >
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-4 text-center">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">24/7</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Support available</p>
              </div>
              <div className="rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-4 text-center">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">100+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Active members</p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}