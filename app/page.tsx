'use client';

import { 
  ArrowRight, 
  Sparkles, 
  Users, 
  FolderGit2, 
  MessageCircle, 
  BarChart3, 
  Zap,
  CalendarDays,
  Star,
  Clock,
  MapPin,
  Database,
  Table,
  Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';
import PublicLayout from './public-layout';
import { SectionHeading } from '../components/ui/section-heading';
import { StatCard } from '../components/ui/stat-card';
import { FeatureCard } from '../components/ui/feature-card';
import { ProjectCard } from '../components/placeholders/project-card';
import { DeveloperCard } from '../components/placeholders/developer-card';

export default function Home() {
  // Mock data with clear source annotations
  const statsData = {
    totalProjects: 1234,
    activeDevelopers: 456,
    projectsThisWeek: 78,
    membersOnline: 89
  };

  const featuredProjects = [
    { id: 1, title: 'AI Chat App', tech: 'React', owner: 'Sarah Johnson', likes: 45, description: 'An AI-powered chat application with real-time responses', href: '/project/1' },
    { id: 2, title: 'DevPortfolio', tech: 'Next.js', owner: 'Mike Chen', likes: 32, description: 'A portfolio builder for developers', href: '/project/2' },
    { id: 3, title: 'React Dashboard', tech: 'React', owner: 'Emily Rodriguez', likes: 28, description: 'Analytics dashboard with real-time data', href: '/project/3' },
  ];

  const topDevelopers = [
    { id: 1, name: 'Sarah Johnson', role: 'Full Stack Developer', projectCount: 12, avatar: '/avatars/sarah.jpg', username: 'sarahjohnson' },
    { id: 2, name: 'Mike Chen', role: 'Frontend Developer', projectCount: 10, avatar: '/avatars/mike.jpg', username: 'mikechen' },
    { id: 3, name: 'Emily Rodriguez', role: 'UI/UX Designer', projectCount: 8, avatar: '/avatars/emily.jpg', username: 'emilyrodriguez' },
  ];

  const recentActivity = [
    { action: 'Sarah created "AI Chat App"', time: '2 hours ago', link: '/project/1', type: 'project' },
    { action: 'Mike commented on "DevPortfolio"', time: '5 hours ago', link: '/project/2', type: 'comment' },
    { action: 'Emily joined the community', time: '1 day ago', link: '/developer/emilyrodriguez', type: 'join' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Web Development Workshop', description: 'Learn modern web development with React and Next.js', date: '2026-07-20T14:00:00Z', type: 'Workshop', location: 'Online' },
    { id: 2, title: 'Community Hackathon', description: 'Build something amazing in 48 hours', date: '2026-07-25T09:00:00Z', type: 'Hackathon', location: 'Virtual' },
    { id: 3, title: 'AI in Development', description: 'Explore AI integration in modern applications', date: '2026-08-01T18:00:00Z', type: 'Webinar', location: 'Online' },
  ];

  const testimonials = [
    { id: 1, name: 'Alex Thompson', role: 'Software Engineer', message: 'This community helped me grow my skills and connect with amazing developers.', rating: 5, avatar: '/avatars/alex.jpg' },
    { id: 2, name: 'Priya Patel', role: 'Data Scientist', message: 'The resources and mentorship here are invaluable. I learned so much!', rating: 5, avatar: '/avatars/priya.jpg' },
    { id: 3, name: 'James Wilson', role: 'Tech Lead', message: 'Great platform for collaboration and knowledge sharing in tech.', rating: 5, avatar: '/avatars/james.jpg' },
  ];

  return (
    <PublicLayout>
      <div className="font-sans bg-white text-black">

        {/* ===== HERO SECTION ===== */}
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
                <Link href="/join" className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/programs" className="inline-flex items-center justify-center border border-gray-200 bg-white text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
                  Explore Programs
                </Link>
                <Link href="/events" className="inline-flex items-center justify-center border border-gray-200 bg-white text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
                  View Events
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-200 w-200 bg-gradient-to-r from-[#0070f3]/5 to-[#7928ca]/5 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* ===== STATS SECTION ===== */}
        {/* 
          📊 DATA SOURCE: stats table / computed from projects & users
          🔗 API: GET /api/stats
          📋 FIELDS: 
            - totalProjects: COUNT(*) FROM projects WHERE status = 'published'
            - activeDevelopers: COUNT(*) FROM users WHERE role = 'developer' AND last_active > NOW() - INTERVAL 30 DAYS
            - projectsThisWeek: COUNT(*) FROM projects WHERE created_at > NOW() - INTERVAL 7 DAYS
            - membersOnline: COUNT(*) FROM user_sessions WHERE last_activity > NOW() - INTERVAL 5 MINUTES
        */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Data Source: Stats Table / Computed</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">GET /api/stats</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard label="Total Projects" value={statsData.totalProjects.toLocaleString()} icon={FolderGit2} />
              <StatCard label="Active Developers" value={statsData.activeDevelopers.toLocaleString()} icon={Users} />
              <StatCard label="Projects This Week" value={statsData.projectsThisWeek.toLocaleString()} icon={Sparkles} />
              <StatCard label="Members Online" value={statsData.membersOnline.toLocaleString()} icon={Zap} />
            </div>
          </div>
        </section>

        {/* ===== FEATURED PROJECTS SECTION ===== */}
        {/* 
          📊 DATA SOURCE: projects table (with users join for owner name)
          🔗 API: GET /api/projects?featured=true&limit=3
          📋 FIELDS: id, title, tech, owner (from users.name), likes (count from likes table), description
          🔍 QUERY: SELECT p.*, u.name as owner, COUNT(l.id) as likes FROM projects p 
                   LEFT JOIN users u ON p.user_id = u.id 
                   LEFT JOIN likes l ON p.id = l.project_id 
                   WHERE p.is_featured = true AND p.status = 'published' 
                   GROUP BY p.id, u.name ORDER BY p.created_at DESC LIMIT 3
        */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Table className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Data Source: projects table + users + likes</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">GET /api/projects?featured=true&limit=3</span>
            </div>
            <SectionHeading
              title="Featured Projects"
              description="Discover amazing projects from our community"
              action={
                <Link href="/projects" className="inline-flex items-center gap-2 text-[#0070f3] hover:text-[#7928ca] font-medium transition-colors">
                  View All Projects
                  <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} {...project} href={project.href} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== UPCOMING EVENTS SECTION ===== */}
        {/* 
          📊 DATA SOURCE: events table
          🔗 API: GET /api/events?upcoming=true&limit=3
          📋 FIELDS: id, title, description, date, type, location
          🔍 QUERY: SELECT id, title, description, date, type, location 
                   FROM events WHERE date > NOW() AND status = 'published' 
                   ORDER BY date ASC LIMIT 3
        */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Table className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Data Source: events table</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">GET /api/events?upcoming=true&limit=3</span>
            </div>
            <SectionHeading
              title="Upcoming Events"
              description="Join our community events and workshops"
              action={
                <Link href="/events" className="inline-flex items-center gap-2 text-[#0070f3] hover:text-[#7928ca] font-medium transition-colors">
                  View All Events
                  <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{event.type}</span>
                  </div>
                  <Link href={`/events/${event.id}`} className="mt-4 inline-flex items-center gap-1 text-sm text-[#0070f3] hover:text-[#7928ca] transition-colors">
                    Learn More
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TOP DEVELOPERS SECTION ===== */}
        {/* 
          📊 DATA SOURCE: users table (joined with projects for count)
          🔗 API: GET /api/users?top=true&limit=3
          📋 FIELDS: id, name, role, projectCount (from projects count), avatar
          🔍 QUERY: SELECT u.id, u.name, u.role, u.avatar, COUNT(p.id) as projectCount 
                   FROM users u LEFT JOIN projects p ON u.id = p.user_id AND p.status = 'published' 
                   WHERE u.role = 'developer' GROUP BY u.id ORDER BY projectCount DESC LIMIT 3
        */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Table className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Data Source: users table + projects</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">GET /api/users?top=true&limit=3</span>
            </div>
            <SectionHeading
              title="Top Developers"
              description="Connect with talented developers in our community"
              action={
                <Link href="/developers" className="inline-flex items-center gap-2 text-[#0070f3] hover:text-[#7928ca] font-medium transition-colors">
                  View All Developers
                  <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topDevelopers.map((dev) => (
                <DeveloperCard key={dev.id} id={dev.id} name={dev.name} role={dev.role} projects={dev.projectCount} href={`/developer/${dev.username}`} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== RECENT ACTIVITY SECTION ===== */}
        {/* 
          📊 DATA SOURCE: activity_log table (or UNION of projects, comments, user_actions)
          🔗 API: GET /api/activity/recent?limit=3
          📋 FIELDS: action, time, link, type
          🔍 QUERY: UNION of recent projects, comments, and new users
                   (SELECT 'project' as type, CONCAT(u.name, ' created "', p.title, '"') as action, 
                    p.created_at as time, CONCAT('/projects/', p.id) as link FROM projects p 
                    JOIN users u ON p.user_id = u.id WHERE p.status = 'published' ORDER BY p.created_at DESC LIMIT 1)
                   UNION ALL
                   (SELECT 'comment' as type, CONCAT(u.name, ' commented on "', p.title, '"') as action,
                    c.created_at as time, CONCAT('/projects/', p.id) as link FROM comments c 
                    JOIN users u ON c.user_id = u.id JOIN projects p ON c.project_id = p.id 
                    ORDER BY c.created_at DESC LIMIT 1)
                   UNION ALL
                   (SELECT 'join' as type, CONCAT(u.name, ' joined the community') as action,
                    u.created_at as time, CONCAT('/developers/', u.id) as link FROM users u 
                    ORDER BY u.created_at DESC LIMIT 1)
                   ORDER BY time DESC LIMIT 3
        */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Table className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">Data Source: activity_log / projects + comments + users</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">GET /api/activity/recent?limit=3</span>
            </div>
            <SectionHeading
              title="Recent Activity"
              description="See what's happening in the community"
              action={
                <Link href="/community" className="inline-flex items-center gap-2 text-[#0070f3] hover:text-[#7928ca] font-medium transition-colors">
                  View Community
                  <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-xl">
                    {activity.type === 'project' && '🚀'}
                    {activity.type === 'comment' && '💬'}
                    {activity.type === 'join' && '👋'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                      <Clock className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                  {activity.link && (
                    <Link href={activity.link} className="text-sm text-[#0070f3] hover:text-[#7928ca] transition-colors">
                      View →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== ABOUT / FEATURES SECTION ===== */}
        {/* 
          📝 DATA: Static content - No database fetch needed
          🔗 LINKS: /join, /projects, /community, /dashboard, /resources
        */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full">Static Content</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">No API fetch required</span>
            </div>
            <SectionHeading
              title="About Community Ecosystem"
              description="A comprehensive platform where members can collaborate, learn, communicate, manage projects, share knowledge, and participate in community activities."
              align="center"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Users, title: "User Authentication", desc: "Secure registration and login system", link: "/join" },
                { icon: FolderGit2, title: "Project Management", desc: "Create and manage community projects", link: "/projects" },
                { icon: MessageCircle, title: "Community Forum", desc: "Discussion boards and community posts", link: "/community" },
                { icon: BarChart3, title: "Analytics", desc: "Data insights and reporting", link: "/dashboard" },
                { icon: Sparkles, title: "Learning Resources", desc: "Share educational content and resources", link: "/resources" },
                { icon: Zap, title: "Real-time Chat", desc: "Instant communication with team members", link: "/community" },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return <FeatureCard key={index} title={feature.title} description={feature.desc} icon={Icon} link={feature.link} />;
              })}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS SECTION ===== */}
        {/* 
          📊 DATA SOURCE: testimonials table
          🔗 API: GET /api/testimonials?featured=true&limit=3
          📋 FIELDS: id, name, message, role, rating, avatar
          🔍 QUERY: SELECT id, name, message, role, rating, avatar 
                   FROM testimonials WHERE is_featured = true AND status = 'published' 
                   ORDER BY rating DESC LIMIT 3
        */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Table className="w-4 h-4 text-yellow-600" />
              <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">Data Source: testimonials table</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">GET /api/testimonials?featured=true&limit=3</span>
            </div>
            <SectionHeading
              title="What Our Community Says"
              description="Real stories from real members"
              action={
                <Link href="/testimonials" className="inline-flex items-center gap-2 text-[#0070f3] hover:text-[#7928ca] font-medium transition-colors">
                  View All Testimonials
                  <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-4">"{testimonial.message}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0070f3] to-[#7928ca] flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA SECTION ===== */}
        {/* 
          📝 DATA: Static content - No database fetch needed
          🔗 LINKS: /join, /about
        */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0070f3] to-[#7928ca]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-xs font-medium text-white/70 bg-white/20 px-3 py-1 rounded-full">Static Content</span>
              <span className="text-xs text-white/50">|</span>
              <span className="text-xs text-white/50">No API fetch required</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Build Your Community?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join thousands of developers already using our platform to collaborate and grow together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join" className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg shadow-black/20">
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