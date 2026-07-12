import { Users, FolderGit2, MessageCircle, BarChart3, Sparkles, Zap, Shield, Globe2 } from 'lucide-react';
import PublicLayout from '../public-layout';

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

  return (
    <PublicLayout>
      <div className="font-sans bg-white text-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Community Ecosystem</h1>
            <p className="text-lg text-gray-600">
              A comprehensive platform where members can collaborate, learn, communicate, manage projects, 
              share knowledge, and participate in community activities.
            </p>
          </div>

          {/* Features */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-gray-300 transition-all"
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
          </section>

          {/* Values */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-[#0070f3]/5 to-[#7928ca]/5 border border-gray-200 rounded-xl p-8 text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-[#0070f3]" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Mission */}
          <section className="mb-20">
            <div className="bg-gradient-to-r from-[#0070f3] to-[#7928ca] rounded-2xl p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-white/90 max-w-3xl mx-auto">
                To empower developers worldwide by providing a platform where they can showcase their work, 
                find collaborators, learn from each other, and build amazing projects together.
              </p>
            </div>
          </section>

          {/* Team */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Built For Developers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="font-semibold text-xl mb-4">For Individuals</h3>
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
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="font-semibold text-xl mb-4">For Teams</h3>
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
    </PublicLayout>
  );
}
