'use client';

import { ArrowLeft, Heart, MessageCircle, Share2, MapPin, Calendar, Users, Star, ExternalLink, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { useState, use } from 'react';
import Link from 'next/link';
// ❌ REMOVE: import PublicLayout from '../../public-layout';

export default function DeveloperProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const [isFollowing, setIsFollowing] = useState(false);
  const [copied, setCopied] = useState(false);

  const developerProfiles = [
    {
      username: 'sarahjohnson',
      name: 'Sarah Johnson',
      handle: '@sarahj',
      role: 'Senior Developer at TechCorp',
      location: 'San Francisco',
      joined: 'Dec 2023',
      projects: 15,
      followers: 45,
      stars: 89,
      skills: ['React', 'TypeScript', 'Node.js', 'Next.js'],
      github: 'https://github.com/sarahj',
      linkedin: 'https://linkedin.com/in/sarahj',
      portfolio: 'https://sarahj.dev',
      bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Love open source and helping others learn to code.',
      projectList: [
        { id: 1, title: 'AI Chat App', languages: ['React', 'TypeScript'], likes: 45 },
        { id: 2, title: 'DevPortfolio', languages: ['Next.js', 'TypeScript'], likes: 32 },
        { id: 3, title: 'React Dashboard', languages: ['React', 'Tailwind'], likes: 28 },
      ],
    },
    {
      username: 'mikechen',
      name: 'Mike Chen',
      handle: '@mikechen',
      role: 'Frontend Developer at StudioNorth',
      location: 'Seattle',
      joined: 'Mar 2022',
      projects: 10,
      followers: 28,
      stars: 54,
      skills: ['Next.js', 'Node.js', 'Docker'],
      github: 'https://github.com/mikechen',
      linkedin: 'https://linkedin.com/in/mikechen',
      portfolio: 'https://mikechen.dev',
      bio: 'I enjoy building polished web experiences and helping fellow developers ship useful products faster.',
      projectList: [
        { id: 2, title: 'DevPortfolio', languages: ['Next.js', 'TypeScript'], likes: 32 },
        { id: 4, title: 'Task Manager', languages: ['Vue', 'TypeScript'], likes: 21 },
      ],
    },
    {
      username: 'emilyrodriguez',
      name: 'Emily Rodriguez',
      handle: '@emilyrodriguez',
      role: 'UI/UX Designer & Developer',
      location: 'Miami',
      joined: 'Jun 2024',
      projects: 8,
      followers: 19,
      stars: 41,
      skills: ['Figma', 'TypeScript', 'React'],
      github: 'https://github.com/emilyrodriguez',
      linkedin: 'https://linkedin.com/in/emilyrodriguez',
      portfolio: 'https://emilyrodriguez.dev',
      bio: 'Design-first developer focused on thoughtful interfaces and accessible web products.',
      projectList: [
        { id: 3, title: 'React Dashboard', languages: ['React', 'Tailwind'], likes: 28 },
        { id: 5, title: 'Social Media App', languages: ['React Native', 'Firebase'], likes: 18 },
      ],
    },
  ];

  const developer = developerProfiles.find((profile) => profile.username === resolvedParams.username) ?? developerProfiles[0];
  const projects = developer.projectList;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // ❌ REMOVE: <PublicLayout>
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developers" className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Developers
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isFollowing ? 'bg-[#0070f3] text-white' : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-full flex items-center justify-center shrink-0">
              <span className="text-5xl">👤</span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{developer.name}</h1>
              <p className="text-gray-600 mb-4">{developer.handle} • {developer.role}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {developer.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {developer.joined}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm mb-4">
                <span className="flex items-center gap-1">
                  <span className="font-semibold">{developer.projects}</span> projects
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">{developer.followers}</span> followers
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">{developer.stars}</span> stars
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {developer.skills.map((skill) => (
                  <span key={skill} className="text-sm font-medium text-[#0070f3] bg-[#0070f3]/10 px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-gray-600" />
                  <button
                    onClick={() => copyToClipboard(developer.github)}
                    className="text-sm text-gray-600 hover:text-[#0070f3] transition-colors flex items-center gap-1"
                  >
                    {copied ? 'Copied!' : developer.github.replace('https://', '')}
                    {copied && <Check className="w-4 h-4 text-green-500" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-gray-600" />
                  <button
                    onClick={() => copyToClipboard(developer.linkedin)}
                    className="text-sm text-gray-600 hover:text-[#0070f3] transition-colors flex items-center gap-1"
                  >
                    {copied ? 'Copied!' : developer.linkedin.replace('https://', '')}
                    {copied && <Check className="w-4 h-4 text-green-500" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-gray-600" />
                  <button
                    onClick={() => copyToClipboard(developer.portfolio)}
                    className="text-sm text-gray-600 hover:text-[#0070f3] transition-colors flex items-center gap-1"
                  >
                    {copied ? 'Copied!' : developer.portfolio.replace('https://', '')}
                    {copied && <Check className="w-4 h-4 text-green-500" />}
                  </button>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 mt-4 max-w-2xl">{developer.bio}</p>
            </div>
          </div>
        </div>

        {/* All Projects */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Projects by {developer.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all block"
              >
                {/* Screenshot */}
                <div className="aspect-video bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 flex items-center justify-center">
                  <span className="text-4xl">📸</span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Languages */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.languages.map((lang) => (
                      <span key={lang} className="text-xs font-medium text-[#0070f3] bg-[#0070f3]/10 px-2 py-1 rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-[#0070f3] transition-colors">
                    {project.title}
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {project.likes} likes
                    </span>
                  </div>

                  {/* View Button */}
                  <button className="w-full mt-4 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    View
                  </button>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Load More Projects
            </button>
          </div>
        </div>
      </div>
    </div>
    // ❌ REMOVE: </PublicLayout>
  );
}