'use client';

import { Users, FolderGit2, MessageCircle, BarChart3, Sparkles, Zap, Shield, Globe2, Database, Table, Users as UsersIcon, Briefcase } from 'lucide-react';
import Link from 'next/link';
// ❌ REMOVE: import PublicLayout from '../public-layout';

export default function AboutPage() {
  // ============================================================
  // 📊 DATA SOURCE: Static content - No database fetch needed
  // These features are defined in code and displayed statically
  // ============================================================
  const features = [
    { icon: Users, title: "User Authentication", desc: "Secure registration and login system" },
    { icon: FolderGit2, title: "Project Management", desc: "Create and manage community projects" },
    { icon: MessageCircle, title: "Community Forum", desc: "Discussion boards and community posts" },
    { icon: BarChart3, title: "Analytics", desc: "Data insights and reporting" },
    { icon: Sparkles, title: "Learning Resources", desc: "Share educational content and resources" },
    { icon: Zap, title: "Real-time Chat", desc: "Instant communication with team members" },
  ];

  // ============================================================
  // 📊 DATA SOURCE: Static content - No database fetch needed
  // Values are defined in code and displayed statically
  // ============================================================
  const values = [
    { icon: Shield, title: "Security First", desc: "Your data is protected with enterprise-grade security" },
    { icon: Globe2, title: "Global Community", desc: "Connect with developers from around the world" },
    { icon: Sparkles, title: "Innovation", desc: "Constantly improving with new features and updates" },
  ];

  // ============================================================
  // 📊 DATA SOURCE: users table (for team members)
  // 🔗 API: GET /api/team
  // 📋 FIELDS: id, name, role, bio, avatar, socialLinks
  // 🔍 QUERY: SELECT id, name, role, bio, avatar, socialLinks 
  //          FROM users WHERE role IN ('admin', 'mentor', 'leader') 
  //          AND is_active = true ORDER BY role ASC
  // ============================================================
  const teamMembers = [
    { id: 1, name: "Alex Rivera", role: "Founder & Lead Developer", bio: "Passionate about building developer communities", avatar: "/avatars/alex.jpg" },
    { id: 2, name: "Sarah Chen", role: "Community Manager", bio: "Connecting developers worldwide", avatar: "/avatars/sarah-chen.jpg" },
    { id: 3, name: "Marcus Johnson", role: "Lead Mentor", bio: "Helping developers grow their skills", avatar: "/avatars/marcus.jpg" },
  ];

  // ============================================================
  // 📊 DATA SOURCE: stats table / computed from users table
  // 🔗 API: GET /api/stats
  // 📋 FIELDS: totalMembers, totalProjects, countriesRepresented, mentors
  // ============================================================
  const communityStats = {
    totalMembers: 1234,
    totalProjects: 456,
    countriesRepresented: 45,
    mentors: 12
  };

  return (
    // ❌ REMOVE: <PublicLayout>
    <div className="font-sans bg-white text-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== HEADER SECTION ===== */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Static Content</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">No API fetch required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Community Ecosystem</h1>
          <p className="text-lg text-gray-600">
            A comprehensive platform where members can collaborate, learn, communicate, manage projects, 
            share knowledge, and participate in community activities.
          </p>
        </div>

        {/* ===== COMMUNITY STATS SECTION ===== */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Data Source: stats table / users + projects</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">GET /api/stats</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-blue-600">{communityStats.totalMembers.toLocaleString()}</div>
              <p className="text-sm text-gray-600 mt-1">Total Members</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-green-600">{communityStats.totalProjects.toLocaleString()}</div>
              <p className="text-sm text-gray-600 mt-1">Total Projects</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-purple-600">{communityStats.countriesRepresented}</div>
              <p className="text-sm text-gray-600 mt-1">Countries</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-orange-600">{communityStats.mentors}</div>
              <p className="text-sm text-gray-600 mt-1">Mentors</p>
            </div>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Static Content</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">Defined in code - No API fetch</span>
          </div>
          <h2 className="text-3xl font-bold mb-8 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-[#0070f3] transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#0070f3]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-[#0070f3] transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== VALUES SECTION ===== */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Static Content</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">Defined in code - No API fetch</span>
          </div>
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-[#0070f3]/5 to-[#7928ca]/5 border border-gray-200 rounded-xl p-8 text-center hover:shadow-lg transition-shadow hover:border-[#0070f3]"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-[#0070f3]" />
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xs font-medium text-white/70 bg-white/20 px-3 py-1 rounded-full">Static Content</span>
            <span className="text-xs text-white/50">|</span>
            <span className="text-xs text-white/50">No API fetch required</span>
          </div>
          <div className="bg-gradient-to-r from-[#0070f3] to-[#7928ca] rounded-2xl p-12 text-center text-white hover:shadow-xl transition-shadow">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              To empower developers worldwide by providing a platform where they can showcase their work, 
              find collaborators, learn from each other, and build amazing projects together.
            </p>
          </div>
        </section>

        {/* ===== TEAM SECTION ===== */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <Table className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Data Source: users table</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">GET /api/team</span>
          </div>
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-xl hover:border-[#0070f3] transition-all">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0070f3] to-[#7928ca] mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-[#0070f3] font-medium">{member.role}</p>
                <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FOR DEVELOPERS SECTION ===== */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Static Content</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">No API fetch required</span>
          </div>
          <h2 className="text-3xl font-bold mb-8 text-center">Built For Developers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl hover:border-[#0070f3] transition-all">
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-[#0070f3]" />
                For Individuals
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#0070f3] mt-1">✓</span>
                  Showcase your portfolio
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0070f3] mt-1">✓</span>
                  Connect with other developers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0070f3] mt-1">✓</span>
                  Find collaboration opportunities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0070f3] mt-1">✓</span>
                  Learn from the community
                </li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl hover:border-[#0070f3] transition-all">
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#0070f3]" />
                For Teams
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#0070f3] mt-1">✓</span>
                  Manage team projects
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0070f3] mt-1">✓</span>
                  Real-time collaboration
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0070f3] mt-1">✓</span>
                  Track progress and tasks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0070f3] mt-1">✓</span>
                  Share knowledge internally
                </li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
    // ❌ REMOVE: </PublicLayout>
  );
}