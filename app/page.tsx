// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Community Ecosystem
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We connect builders, learners, and changemakers in one thriving space to discover opportunities, share knowledge, and grow together.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/join"
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            Join the Community
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition-colors"
          >
            Explore Projects
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span className="px-4 py-2 bg-gray-100 rounded-full">Mentorship</span>
          <span className="px-4 py-2 bg-gray-100 rounded-full">Projects</span>
          <span className="px-4 py-2 bg-gray-100 rounded-full">Community events</span>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-3xl mx-auto">
        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">OUR MISSION</h2>
        <h3 className="text-2xl font-bold text-gray-900 mt-2">Build meaningful projects and lasting connections.</h3>
        <p className="text-gray-600 mt-4">
          From collaboration and learning to discovery and growth, this platform is designed to support every stage of your creative journey.
        </p>
      </section>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-gray-900">1k+</p>
          <p className="text-gray-600">Members and growing</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-gray-900">24/7</p>
          <p className="text-gray-600">Support and inspiration</p>
        </div>
      </div>
    </div>
  );
}