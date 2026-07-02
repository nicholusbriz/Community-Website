import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/community-website-logo.png"
                alt="Community Ecosystem Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-semibold text-xl">Community Ecosystem</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button className="text-muted-foreground hover:text-foreground transition-colors">Features</button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">About</button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">Contact</button>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Build Stronger Communities
            <span className="block text-primary">Together</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            A comprehensive platform where members can collaborate, learn, communicate, manage projects, 
            share knowledge, and participate in community activities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Get Started
            </button>
            <button className="border border-border bg-card text-foreground px-8 py-3 rounded-lg font-medium hover:bg-muted transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            {[
              { icon: "👤", title: "User Authentication", desc: "Secure registration and login system" },
              { icon: "📋", title: "Project Management", desc: "Create and manage community projects" },
              { icon: "💬", title: "Community Forum", desc: "Discussion boards and community posts" },
              { icon: "📅", title: "Events Management", desc: "Organize and manage community events" },
              { icon: "📚", title: "Learning Resources", desc: "Share educational content and resources" },
              { icon: "💬", title: "Team Chat", desc: "Real-time communication tools" },
              { icon: "👥", title: "User Profiles", desc: "Personalized user profiles" },
              { icon: "✅", title: "Task Assignment", desc: "Assign and track tasks within teams" },
              { icon: "📊", title: "Admin Dashboard", desc: "Administrative control panel" },
              { icon: "📈", title: "Reports & Analytics", desc: "Data insights and reporting" },
            ].map((feature, index) => (
              <button
                key={index}
                className="bg-card border border-border rounded-xl p-6 text-left hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Actors Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Who Can Use Our Platform
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: "Visitor", desc: "Browse and explore community content" },
              { role: "Member", desc: "Full access to community features" },
              { role: "Team Leader", desc: "Manage projects and assign tasks" },
              { role: "Administrator", desc: "Full system control and oversight" },
            ].map((actor, index) => (
              <button
                key={index}
                className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {actor.role}
                </h3>
                <p className="text-muted-foreground text-sm">{actor.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Build Your Community?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join us in creating a professional community platform that showcases collaboration and teamwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-background text-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Register Now
            </button>
            <button className="border border-primary-foreground bg-transparent text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2026 Community Ecosystem Website. System Analysis & Design Project.</p>
        </div>
      </footer>
    </div>
  );
}
