import { 
  ArrowRight, 
  BookOpen, 
  Mic2, 
  Newspaper, 
  Sparkles, 
  Database, 
  Table, 
  Calendar, 
  User, 
  Tag, 
  Clock,
  Search
} from 'lucide-react';
import PublicLayout from '../public-layout';

export default function BlogPage() {
  // ============================================================
  // 📊 DATA SOURCE: blog_posts table
  // 🔗 API: GET /api/blog/posts?limit=10&page=1
  // 📋 FIELDS: id, title, excerpt, content, category, readTime, 
  //            author, authorId, publishedAt, slug, tags, featuredImage, status
  // ============================================================
  const posts = [
    {
      id: 1,
      title: 'How to start your first web project with confidence',
      excerpt: 'A beginner-friendly roadmap for turning ideas into a polished portfolio project.',
      category: 'Tutorials',
      readTime: '6 min read',
      author: 'Sarah Johnson',
      publishedAt: '2026-07-10',
      tags: ['Web Development', 'Beginner', 'Portfolio']
    },
    {
      id: 2,
      title: 'What we learned from our first community hackathon',
      excerpt: 'A reflection on teamwork, debugging, and building under pressure.',
      category: 'Community',
      readTime: '4 min read',
      author: 'Mike Chen',
      publishedAt: '2026-07-08',
      tags: ['Hackathon', 'Community', 'Teamwork']
    },
    {
      id: 3,
      title: 'Mentorship that actually helps early-career builders',
      excerpt: 'Why feedback loops and accountability matter more than endless tutorials.',
      category: 'Insights',
      readTime: '5 min read',
      author: 'Emily Rodriguez',
      publishedAt: '2026-07-05',
      tags: ['Mentorship', 'Career Growth', 'Learning']
    },
    {
      id: 4,
      title: 'Building accessible web applications',
      excerpt: 'A practical guide to making your web apps inclusive for all users.',
      category: 'Tutorials',
      readTime: '8 min read',
      author: 'David Kim',
      publishedAt: '2026-07-01',
      tags: ['Accessibility', 'Web Development', 'Inclusion']
    },
    {
      id: 5,
      title: 'The future of AI in software development',
      excerpt: 'How AI tools are changing the way we write code and build products.',
      category: 'Insights',
      readTime: '7 min read',
      author: 'Lisa Thompson',
      publishedAt: '2026-06-28',
      tags: ['AI', 'Future Trends', 'Development']
    },
  ];

  // ============================================================
  // 📊 DATA SOURCE: blog_posts table (for categories)
  // 🔗 API: GET /api/blog/categories
  // ============================================================
  const categories = [
    { name: 'Tutorials', count: 12 },
    { name: 'Insights', count: 8 },
    { name: 'Community', count: 6 },
    { name: 'News', count: 4 },
    { name: 'Events', count: 3 },
  ];

  // ============================================================
  // 📊 DATA SOURCE: blog_posts table (for total count)
  // 🔗 API: GET /api/blog/count
  // ============================================================
  const totalPosts = 33;

  // ============================================================
  // 📊 DATA SOURCE: blog_posts table (featured post)
  // 🔗 API: GET /api/blog/featured
  // ============================================================
  const featuredPost = {
    title: 'How to start your first web project with confidence',
    excerpt: 'A beginner-friendly roadmap for turning ideas into a polished portfolio project.',
    category: 'Tutorials',
    readTime: '6 min read',
    author: 'Sarah Johnson',
  };

  // ============================================================
  // 📊 DATA SOURCE: users table (for author names)
  // 🔗 API: GET /api/users?role=author
  // ============================================================
  const authors = [
    { name: 'Sarah Johnson', role: 'admin' },
    { name: 'Mike Chen', role: 'admin' },
    { name: 'Emily Rodriguez', role: 'admin' },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white py-16 text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          
          {/* ===== DATA SOURCE NOTE ===== */}
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Data Source: blog_posts table</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">GET /api/blog/featured</span>
          </div>

          {/* ===== FEATURED SECTION ===== */}
          <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-[#0070f3]/8 to-[#7928ca]/8 p-8 sm:p-12">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
                <Sparkles className="h-4 w-4 text-[#0070f3]" />
                Featured Post
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{featuredPost.title}</h1>
              <p className="mt-5 text-lg leading-8 text-gray-600">{featuredPost.excerpt}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {featuredPost.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {featuredPost.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {featuredPost.category}
                </span>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-white bg-[#0070f3] px-6 py-3 rounded-lg font-medium opacity-70 cursor-default">
                Read Featured Post
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </section>

          {/* ===== BLOG POSTS & SIDEBAR ===== */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            
            {/* ===== MAIN CONTENT ===== */}
            <div>
              {/* Data Source Label */}
              <div className="flex items-center gap-2 mb-4">
                <Table className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Data Source: blog_posts table</span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-500">GET /api/blog/posts?limit=10&page=1</span>
              </div>

              {/* Search Bar - Placeholder */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm cursor-default"
                  readOnly
                />
              </div>
              
              <div className="space-y-4">
                {posts.map((post) => (
                  <article key={post.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full bg-[#0070f3]/10 px-3 py-1 font-semibold text-[#0070f3]">
                        {post.category}
                      </span>
                      <span className="text-gray-500">{post.readTime}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{post.author}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-gray-600">{post.excerpt}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0070f3] opacity-70 cursor-default">
                      Read more
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </article>
                ))}
              </div>

              {/* ===== PAGINATION ===== */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Data Source: blog_posts table</span>
                  <span className="text-xs text-gray-400">|</span>
                  <span className="text-xs text-gray-500">GET /api/blog/count</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4].map((page) => (
                    <span
                      key={page}
                      className={`h-10 w-10 rounded-lg font-medium flex items-center justify-center cursor-default ${
                        page === 1
                          ? 'bg-[#0070f3] text-white'
                          : 'border border-gray-200 bg-white text-gray-600'
                      }`}
                    >
                      {page}
                    </span>
                  ))}
                  <span className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-gray-600 cursor-default">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <p className="text-sm text-gray-500">Showing 1-5 of {totalPosts} posts</p>
              </div>
            </div>

            {/* ===== SIDEBAR ===== */}
            <aside className="space-y-4">
              {/* Categories */}
              <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Table className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">Data Source: blog_posts table</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between rounded-lg bg-white p-3 border border-gray-100 cursor-default"
                    >
                      <span className="font-medium text-gray-700">{category.name}</span>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What You'll Find - Static */}
              <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-0.5 rounded">Static Content</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">What you will find</h2>
                <div className="space-y-3">
                  {[
                    { icon: Newspaper, title: 'Community updates', text: 'Fresh announcements and highlights from the ecosystem.' },
                    { icon: BookOpen, title: 'How-to guides', text: 'Step-by-step tutorials for beginner and intermediate builders.' },
                    { icon: Mic2, title: 'Interviews', text: 'Conversations with mentors, founders, and guest speakers.' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="flex items-center gap-3">
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
              </div>

              {/* Authors */}
              <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Table className="w-3 h-3 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Data Source: users table</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Our Authors</h2>
                <div className="space-y-2">
                  {authors.map((author) => (
                    <div key={author.name} className="flex items-center gap-3 rounded-lg bg-white p-3 border border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0070f3] to-[#7928ca] flex items-center justify-center text-white font-semibold text-sm">
                        {author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{author.name}</p>
                        <p className="text-xs text-gray-500">{author.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}