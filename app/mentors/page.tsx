import { Compass, HandHeart, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import Link from 'next/link';
import PublicLayout from '../public-layout';

export default function MentorsPage() {
  const mentors = [
    { name: 'Ada Okafor', role: 'Frontend mentor', focus: 'React, accessibility, portfolio design' },
    { name: 'Daniel Kabuye', role: 'Mobile mentor', focus: 'Flutter, product thinking, app architecture' },
    { name: 'Nia Moyo', role: 'AI mentor', focus: 'Prompt design, responsible AI, prototypes' },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white py-16 text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-gray-200 bg-linear-to-br from-[#0070f3]/8 to-[#7928ca]/8 p-8 sm:p-12">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
                <UserRound className="h-4 w-4 text-[#0070f3]" />
                Mentors and team
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Meet the people guiding the next generation of builders</h1>
              <p className="mt-5 text-lg leading-8 text-gray-600">Mentors, volunteers, and organizers are at the heart of Tech Rise Africa. They help new members learn, build, and connect with confidence.</p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              {mentors.map((mentor) => (
                <div key={mentor.name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-[#0070f3]/10 to-[#7928ca]/10 text-lg font-semibold text-[#0070f3]">
                      {mentor.name.split(' ').map((part) => part[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{mentor.name}</h2>
                      <p className="text-sm text-[#0070f3]">{mentor.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-gray-600">Focus area: {mentor.focus}</p>
                </div>
              ))}
            </div>

            <aside className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-xl font-semibold text-gray-900">How mentors support the community</h2>
              <div className="space-y-3">
                {[
                  { icon: HandHeart, title: 'Career guidance', text: 'Support for portfolios, interviews, and professional growth.' },
                  { icon: ShieldCheck, title: 'Technical feedback', text: 'Thoughtful reviews that improve design and implementation.' },
                  { icon: Sparkles, title: 'Community leadership', text: 'Help shape events, workshops, and program quality.' },
                  { icon: Compass, title: 'Partner connection', text: 'Open doors to opportunities, collaborators, and networks.' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-[#0070f3]/10 p-2 text-[#0070f3]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0070f3] hover:text-[#7928ca]">
                Become a mentor
                <Sparkles className="h-4 w-4" />
              </Link>
            </aside>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
