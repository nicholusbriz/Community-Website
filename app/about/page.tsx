'use client';

import { Users, FolderGit2, MessageCircle, BarChart3, Sparkles, Zap, Shield, Globe2, Users as UsersIcon, Briefcase, Rocket, Target, Code2, UsersRound } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const features = [
    { icon: Users, title: "User Authentication", desc: "Secure registration and login system" },
    { icon: FolderGit2, title: "Project Management", desc: "Create and manage community projects" },
    { icon: MessageCircle, title: "Community Forum", desc: "Discussion boards and community posts" },
    { icon: BarChart3, title: "Analytics", desc: "Data insights and reporting" },
    { icon: Sparkles, title: "Learning Resources", desc: "Share educational content and resources" },
    { icon: Zap, title: "Real-time Chat", desc: "Instant communication with team members" },
  ];

  const values = [
    { icon: Shield, title: "Security First", desc: "Your data is protected with enterprise-grade security" },
    { icon: Globe2, title: "Global Community", desc: "Connect with developers from around the world" },
    { icon: Sparkles, title: "Innovation", desc: "Constantly improving with new features and updates" },
  ];

  const teamMembers = [
    { id: 1, name: "Alex Rivera", role: "Founder & Lead Developer", bio: "Passionate about building developer communities" },
    { id: 2, name: "Sarah Chen", role: "Community Manager", bio: "Connecting developers worldwide" },
    { id: 3, name: "Marcus Johnson", role: "Lead Mentor", bio: "Helping developers grow their skills" },
  ];

  const ecosystemBenefits = [
    {
      icon: Code2,
      title: "Real-World Projects",
      desc: "Work on actual projects submitted by community members that have real impact and use cases."
    },
    {
      icon: UsersRound,
      title: "Collaborative Development",
      desc: "Team up with developers from diverse backgrounds and skill levels to build something meaningful together."
    },
    {
      icon: Rocket,
      title: "Portfolio Building",
      desc: "Gain practical experience and build a portfolio of real projects that showcase your skills to employers."
    },
    {
      icon: Target,
      title: "Skill Growth",
      desc: "Learn new technologies and methodologies by working on challenges that push your boundaries."
    }
  ];

  return (
    <div className="font-sans bg-white text-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== HEADER SECTION ===== */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Community Ecosystem</h1>
          <p className="text-lg text-gray-600">
            A comprehensive platform where members can collaborate, learn, communicate, manage projects, 
            share knowledge, and participate in community activities.
          </p>
        </div>

        {/* ===== ECOSYSTEM SECTION ===== */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-10 mb-8 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Developers Building Together
            </h2>
            <p className="text-xl text-blue-50 max-w-3xl mx-auto">
              This is an ecosystem where developers get hands-on experience working on 
              <span className="font-semibold text-white"> real-world projects</span> from the community.
              No more toy apps — build solutions that actually matter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ecosystemBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-xl hover:border-blue-400 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/projects" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:scale-105"
            >
              <FolderGit2 className="w-5 h-5" />
              Explore Available Projects
            </Link>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-600 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== VALUES SECTION ===== */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 rounded-xl p-8 text-center hover:shadow-lg transition-shadow hover:border-blue-600"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== MISSION SECTION ===== */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white hover:shadow-xl transition-shadow">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              To empower developers worldwide by providing a platform where they can showcase their work, 
              find collaborators, learn from each other, and build amazing projects together.
            </p>
          </div>
        </section>

        {/* ===== TEAM SECTION ===== */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-xl hover:border-blue-600 transition-all">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-blue-600 font-medium">{member.role}</p>
                <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FOR DEVELOPERS SECTION ===== */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Built For Developers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl hover:border-blue-600 transition-all">
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-blue-600" />
                For Individuals
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Showcase your portfolio
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Connect with other developers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Find collaboration opportunities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Learn from the community
                </li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl hover:border-blue-600 transition-all">
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                For Teams
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Manage team projects
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Real-time collaboration
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Track progress and tasks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Share knowledge internally
                </li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}