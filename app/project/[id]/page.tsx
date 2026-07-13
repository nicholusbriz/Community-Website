'use client';

import { ArrowLeft, Heart, MessageCircle, Share2, Flag, Copy, Check, User, Calendar, Eye, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { useState, use, type ReactNode } from 'react';
import Link from 'next/link';
// ❌ REMOVE: import PublicLayout from '../../public-layout';

function PageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gray-50 text-black">{children}</div>;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const projects = [
    {
      id: '1',
      title: 'AI Chat App',
      owner: 'Sarah Johnson',
      date: 'Dec 2024',
      views: '1.2K',
      likes: 45,
      comments: 12,
      languages: ['React', 'TypeScript', 'Tailwind', 'OpenAI'],
      description: `A powerful AI-powered chat application that leverages OpenAI's GPT-4 to provide intelligent conversations. Built with React and TypeScript, featuring a modern UI with real-time messaging, conversation history, and customizable AI personalities.

Key features include:
- Real-time AI responses powered by GPT-4
- Conversation history and persistence
- Multiple AI personalities to choose from
- Dark mode support
- Responsive design for all devices
- Export conversations to various formats`,
      screenshots: ['📸', '📸', '📸', '📸'],
      liveDemo: 'https://ai-chat-app.example.com',
      github: 'https://github.com/sarahj/ai-chat-app',
      lookingForCollaborators: true,
      skillsNeeded: ['React', 'Node.js', 'MongoDB'],
      ownerProjects: 12,
      ownerFollowers: 45,
    },
    {
      id: '2',
      title: 'DevPortfolio',
      owner: 'Mike Chen',
      date: 'Nov 2024',
      views: '840',
      likes: 32,
      comments: 8,
      languages: ['Next.js', 'TypeScript', 'Tailwind'],
      description: 'A polished portfolio builder tailored for developers who want to showcase their work and connect with collaborators.',
      screenshots: ['📸', '📸', '📸'],
      liveDemo: 'https://devportfolio.example.com',
      github: 'https://github.com/mikechen/devportfolio',
      lookingForCollaborators: false,
      skillsNeeded: ['Next.js', 'UI Design'],
      ownerProjects: 10,
      ownerFollowers: 28,
    },
    {
      id: '3',
      title: 'React Dashboard',
      owner: 'Emily Rodriguez',
      date: 'Oct 2024',
      views: '640',
      likes: 28,
      comments: 15,
      languages: ['React', 'Tailwind', 'Chart.js'],
      description: 'A modern analytics dashboard that helps teams track growth, performance, and delivery milestones.',
      screenshots: ['📸', '📸'],
      liveDemo: 'https://react-dashboard.example.com',
      github: 'https://github.com/emilyrodriguez/react-dashboard',
      lookingForCollaborators: true,
      skillsNeeded: ['React', 'Data Viz'],
      ownerProjects: 8,
      ownerFollowers: 19,
    },
  ];

  const project = projects.find((item) => item.id === resolvedParams.id) ?? projects[0];

  const comments = [
    { id: 1, user: 'Mike', text: 'Great project! Would love to help with the backend.', time: '2 hours ago' },
    { id: 2, user: 'Emily', text: 'Amazing work on the UI! The dark mode is perfect.', time: '5 hours ago' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // ❌ REMOVE: <PublicLayout>
    <PageShell>
      {/* Sticky Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/projects" className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isSaved ? 'bg-[#0070f3]/10 text-[#0070f3]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Flag className="w-4 h-4" />
                Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Main Screenshot */}
              <div className="aspect-video bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 flex items-center justify-center">
                <span className="text-6xl">📸</span>
              </div>

              <div className="p-6">
                {/* Title and Meta */}
                <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {project.owner}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {project.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {project.views} views
                  </span>
                </div>

                {/* Languages */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.languages.map((lang) => (
                    <span key={lang} className="text-sm font-medium text-[#0070f3] bg-[#0070f3]/10 px-3 py-1 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-4">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    {project.likes} Likes
                  </button>
                  <span className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    {project.comments} Comments
                  </span>
                </div>

                {/* Share Link */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(window.location.href)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0070f3] transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy Project Link'}
                    {copied && <Check className="w-4 h-4 text-green-500" />}
                  </button>
                </div>
              </div>
            </div>

            {/* About the Project */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">About the Project</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
              </div>

              {/* Screenshots Gallery */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Screenshots Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {project.screenshots.map((screenshot, index) => (
                    <div key={index} className="aspect-video bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{screenshot}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Links */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-5 h-5 text-[#0070f3]" />
                    <div>
                      <p className="font-medium">Live Demo</p>
                      <p className="text-sm text-gray-500">{project.liveDemo}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(project.liveDemo)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0070f3] transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <LinkIcon className="w-5 h-5 text-[#0070f3]" />
                    <div>
                      <p className="font-medium">GitHub</p>
                      <p className="text-sm text-gray-500">{project.github}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(project.github)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0070f3] transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Collaboration Info */}
              {project.lookingForCollaborators && (
                <div className="mt-6 p-4 bg-[#0070f3]/10 rounded-lg">
                  <h3 className="font-semibold text-[#0070f3] mb-2">👥 Looking for collaborators: Yes</h3>
                  <p className="text-sm text-gray-700 mb-2">Skills needed:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skillsNeeded.map((skill) => (
                      <span key={skill} className="text-sm bg-white px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Comments</h2>
              
              {/* Comment Input */}
              <div className="mb-6">
                <textarea
                  placeholder="Write a comment..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3] resize-none"
                  rows={3}
                />
                <button className="mt-2 bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Post Comment
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{comment.user}</span>
                      <span className="text-sm text-gray-500">{comment.time}</span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        Like
                      </button>
                      <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#0070f3] transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Owner */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Project Owner</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <p className="font-semibold">{project.owner}</p>
                  <p className="text-sm text-gray-600">Senior Developer at TechCorp</p>
                  <p className="text-sm text-gray-500">{project.ownerProjects} projects • {project.ownerFollowers} followers</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/developer/sarahj" className="block w-full text-center py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  View Profile
                </Link>
                <button className="block w-full text-center py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Follow
                </button>
                <button className="block w-full text-center py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Message
                </button>
              </div>
            </div>

            {/* Join Project */}
            {project.lookingForCollaborators && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Join Project</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Want to collaborate? The owner will be notified and can approve your request.
                </p>
                <button className="w-full bg-[#0070f3] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#0070f3]/90 transition-colors">
                  Request to Join
                </button>
              </div>
            )}

            {/* More Projects from Owner */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold mb-4">More Projects from {project.owner}</h3>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Link key={i} href={`/project/${i}`} className="group">
                    <div className="aspect-video bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-xl">📸</span>
                    </div>
                    <p className="text-sm font-medium group-hover:text-[#0070f3] transition-colors">Project {i}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
    // ❌ REMOVE: </PublicLayout>
  );
}