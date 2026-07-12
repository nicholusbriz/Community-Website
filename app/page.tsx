import { ArrowRight, Sparkles, Users, FolderGit2, Heart, Star, MessageCircle, BarChart3, Zap } from 'lucide-react';
import Link from 'next/link';
import PublicLayout from './public-layout';

export default function Home() {

  const featuredProjects = [
    { id: 1, title: 'AI Chat App', tech: 'React', owner: 'Sarah', likes: 45 },
    { id: 2, title: 'DevPortfolio', tech: 'Next.js', owner: 'Mike', likes: 32 },
    { id: 3, title: 'React Dashboard', tech: 'React', owner: 'Emily', likes: 28 },
  ];

  const topDevelopers = [
    { name: 'Sarah Johnson', projects: 12 },
    { name: 'Mike Chen', projects: 10 },
    { name: 'Emily Rodriguez', projects: 8 },
  ];

  const recentActivity = [
    { action: 'Sarah created "AI Chat App"', time: '2 hours ago' },
    { action: 'Mike commented on "DevPortfolio"', time: '5 hours ago' },
    { action: 'Emily saved "React Dashboard"', time: '1 day ago' },
  ];

  return (
    <PublicLayout>
      <div className="font-sans bg-white text-black">

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-6">
              <Sparkles className="w-4 h-4" />
              Building the future of collaboration
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              🚀 Build Together, Create Amazing Projects
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Connect with developers, showcase your work, and find collaborators for your next big idea.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/projects" className="inline-flex items-center justify-center border border-gray-200 bg-white text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
                Explore Projects
              </Link>
              <Link href="/developers" className="inline-flex items-center justify-center border border-gray-200 bg-white text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
                Find Developers
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative gradient blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#0070f3]/5 to-[#7928ca]/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "1,234", label: "Total Projects", icon: FolderGit2 },
              { number: "456", label: "Active Developers", icon: Users },
              { number: "78", label: "Projects This Week", icon: Sparkles },
              { number: "89", label: "Members Online", icon: Zap },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-[#0070f3]" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
              <p className="text-gray-600">Discover amazing projects from our community</p>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-2 text-[#0070f3] hover:text-[#7928ca] font-medium transition-colors">
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer"
              >
                {/* Screenshot */}
                <div className="aspect-video bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 flex items-center justify-center">
                  <span className="text-4xl">📸</span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Languages */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-medium text-[#0070f3] bg-[#0070f3]/10 px-2 py-1 rounded-full">
                      🚀 {project.tech}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-[#0070f3] transition-colors">
                    {project.title}
                  </h3>

                  {/* Owner */}
                  <p className="text-sm text-gray-600 mb-4">👤 {project.owner}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {project.likes} likes
                    </span>
                  </div>

                  {/* View Button */}
                  <button className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    View
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Developers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Top Developers</h2>
              <p className="text-gray-600">Connect with talented developers in our community</p>
            </div>
            <Link href="/developers" className="inline-flex items-center gap-2 text-[#0070f3] hover:text-[#7928ca] font-medium transition-colors">
              View All Developers
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topDevelopers.map((dev, index) => (
              <Link
                key={index}
                href={`/developer/${dev.name.toLowerCase().replace(' ', '')}`}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-[#0070f3] transition-colors">{dev.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{dev.projects} projects</p>
                <button className="w-full border border-gray-200 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Follow
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity Feed */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Recent Activity</h2>
            <p className="text-gray-600">See what's happening in the community</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="text-xl">🔔</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">About Community Ecosystem</h2>
            <p className="text-gray-600 text-lg">
              A comprehensive platform where members can collaborate, learn, communicate, manage projects, 
              share knowledge, and participate in community activities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "User Authentication", desc: "Secure registration and login system" },
              { icon: FolderGit2, title: "Project Management", desc: "Create and manage community projects" },
              { icon: MessageCircle, title: "Community Forum", desc: "Discussion boards and community posts" },
              { icon: BarChart3, title: "Analytics", desc: "Data insights and reporting" },
              { icon: Sparkles, title: "Learning Resources", desc: "Share educational content and resources" },
              { icon: Zap, title: "Real-time Chat", desc: "Instant communication with team members" },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#0070f3]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0070f3] to-[#7928ca]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Build Your Community?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of communities already using our platform to collaborate and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg shadow-black/20">
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center border border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>
      </div>
    </PublicLayout>
  );
}
