import { Code2, Smartphone, BrainCircuit, ShieldCheck, Palette, BarChart3, Database, Table, Calendar, Users, BookOpen } from 'lucide-react';
import PublicLayout from '../public-layout';
import { PlaceholderPage } from '../../components/placeholders/placeholder-page';

export default function ProgramsPage() {
  // ============================================================
  // 📊 DATA SOURCE: programs table
  // 🔗 API: GET /api/programs
  // 📋 FIELDS: id, title, description, icon, badge, href, isActive, category
  // 🔍 QUERY: SELECT id, title, description, icon, badge, href, category 
  //          FROM programs WHERE isActive = true ORDER BY category ASC
  // ============================================================
  const programs = [
    { 
      id: 1,
      title: 'Web Development', 
      description: 'Frontend and backend foundations using modern tools and real-world projects.', 
      badge: 'Popular', 
      href: '/programs/web-development', 
      icon: Code2,
      category: 'Development'
    },
    { 
      id: 2,
      title: 'Mobile Development', 
      description: 'Build polished mobile apps with design systems, APIs, and test-driven workflows.', 
      badge: 'New', 
      href: '/programs/mobile-development', 
      icon: Smartphone,
      category: 'Development'
    },
    { 
      id: 3,
      title: 'AI & Machine Learning', 
      description: 'Learn prompt engineering, model workflows, and responsible AI experimentation.', 
      badge: null, 
      href: '/programs/ai-ml', 
      icon: BrainCircuit,
      category: 'Advanced'
    },
    { 
      id: 4,
      title: 'Cybersecurity', 
      description: 'Strengthen your security mindset through practical labs and defensive practices.', 
      badge: null, 
      href: '/programs/cybersecurity', 
      icon: ShieldCheck,
      category: 'Advanced'
    },
    { 
      id: 5,
      title: 'UI/UX Design', 
      description: 'Create accessible products with prototyping, journey mapping, and visual storytelling.', 
      badge: null, 
      href: '/programs/ui-ux', 
      icon: Palette,
      category: 'Design'
    },
    { 
      id: 6,
      title: 'Data Analytics', 
      description: 'Turn data into decision-ready insight with dashboards, storytelling, and analysis.', 
      badge: null, 
      href: '/programs/data-analytics', 
      icon: BarChart3,
      category: 'Data'
    },
  ];

  // ============================================================
  // 📊 DATA SOURCE: stats table / computed from programs & enrollments
  // 🔗 API: GET /api/stats
  // 📋 FIELDS: weeklySessions, skillTracks, mentorSupport
  // 🔍 QUERY: 
  //   - weeklySessions: SELECT COUNT(*) FROM sessions WHERE date > NOW() - INTERVAL 7 DAYS
  //   - skillTracks: SELECT COUNT(DISTINCT category) FROM programs WHERE isActive = true
  //   - mentorSupport: SELECT COUNT(*) FROM users WHERE role = 'mentor' AND isActive = true
  // ============================================================
  const stats = [
    { label: 'Weekly sessions', value: '12+' },
    { label: 'Skill tracks', value: '6' },
    { label: 'Mentor support', value: '24/7' },
  ];

  // ============================================================
  // 📊 DATA SOURCE: cohorts table
  // 🔗 API: GET /api/cohorts/upcoming
  // 📋 FIELDS: id, title, startDate, endDate, programId, status
  // 🔍 QUERY: SELECT id, title, startDate, endDate, programId 
  //          FROM cohorts WHERE startDate > NOW() AND status = 'open' 
  //          ORDER BY startDate ASC LIMIT 1
  // ============================================================
  const upcomingCohort = {
    id: 1,
    title: 'Summer Cohort 2026',
    startDate: '2026-08-01',
    endDate: '2026-10-15'
  };

  return (
    <PublicLayout>
      <div className="font-sans bg-white text-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ===== HEADER SECTION ===== */}
          {/* 
            📝 DATA: Static content - No database fetch needed
          */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Static Content</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">No API fetch required</span>
          </div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-semibold text-[#0070f3] uppercase tracking-wider mb-2">Learning tracks</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Programs for every stage of your tech journey</h1>
            <p className="text-lg text-gray-600">
              Tech Rise Africa offers practical learning tracks, mentorship, and hands-on support for aspiring developers, designers, and digital builders.
            </p>
          </div>

          {/* ===== STATS SECTION ===== */}
          {/* 
            📊 DATA SOURCE: stats table / computed from programs, sessions, users
            🔗 API: GET /api/stats
            📋 FIELDS: weeklySessions, skillTracks, mentorSupport
            🔍 QUERY: 
              - weeklySessions: COUNT(*) FROM sessions WHERE date > NOW() - INTERVAL 7 DAYS
              - skillTracks: COUNT(DISTINCT category) FROM programs WHERE isActive = true
              - mentorSupport: COUNT(*) FROM users WHERE role = 'mentor' AND isActive = true
          */}
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Data Source: stats table / sessions + programs + users</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">GET /api/stats</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-gradient-to-br from-[#0070f3]/5 to-[#7928ca]/5 border border-gray-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-[#0070f3]">{stat.value}</div>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ===== PROGRAMS GRID SECTION ===== */}
          {/* 
            📊 DATA SOURCE: programs table
            🔗 API: GET /api/programs
            📋 FIELDS: id, title, description, icon, badge, href, category, isActive
            🔍 QUERY: SELECT id, title, description, icon, badge, href, category 
                     FROM programs WHERE isActive = true ORDER BY category ASC
          */}
          <div className="flex items-center gap-2 mb-4">
            <Table className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Data Source: programs table</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">GET /api/programs</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {programs.map((program) => {
              const Icon = program.icon;
              return (
                <div
                  key={program.id}
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-[#0070f3] transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#0070f3]" />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{program.title}</h3>
                    {program.badge && (
                      <span className="text-xs font-medium px-2 py-1 bg-gradient-to-r from-[#0070f3]/10 to-[#7928ca]/10 text-[#0070f3] rounded-full">
                        {program.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{program.description}</p>
                  <a
                    href={program.href}
                    className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[#0070f3] hover:text-[#7928ca] transition-colors"
                  >
                    Learn more →
                  </a>
                </div>
              );
            })}
          </div>

          {/* ===== UPCOMING COHORT SECTION ===== */}
          {/* 
            📊 DATA SOURCE: cohorts table
            🔗 API: GET /api/cohorts/upcoming
            📋 FIELDS: id, title, startDate, endDate, programId, status
            🔍 QUERY: SELECT id, title, startDate, endDate, programId 
                     FROM cohorts WHERE startDate > NOW() AND status = 'open' 
                     ORDER BY startDate ASC LIMIT 1
          */}
          <div className="flex items-center gap-2 mb-4">
            <Table className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Data Source: cohorts table</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">GET /api/cohorts/upcoming</span>
          </div>
          <div className="bg-gradient-to-r from-[#0070f3] to-[#7928ca] rounded-2xl p-8 md:p-12 text-center text-white mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Upcoming Cohort</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{upcomingCohort.title}</h2>
            <p className="text-white/80 mb-6">
              Starts {new Date(upcomingCohort.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/join"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Join the next cohort
                <Users className="w-4 h-4" />
              </a>
              <a
                href="/events"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                See upcoming events
                <BookOpen className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ===== CTA SECTION ===== */}
          {/* 
            📝 DATA: Static content - No database fetch needed
          */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Static Content</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">No API fetch required</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Ready to start your journey?</h3>
            <p className="text-gray-600 mb-6">Join our community and get access to all programs, mentors, and resources.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/join"
                className="inline-flex items-center justify-center gap-2 bg-[#0070f3] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#005ed6] transition-colors"
              >
                Join the next cohort
                <Users className="w-4 h-4" />
              </a>
              <a
                href="/events"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                See upcoming events
                <BookOpen className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}