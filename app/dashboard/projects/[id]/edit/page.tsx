'use client';

import { useState, use } from 'react';
import { Upload, X, Plus, Link as LinkIcon, Archive, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [title, setTitle] = useState('AI Chat App');
  const [shortDescription, setShortDescription] = useState('A powerful AI-powered chat application');
  const [fullDescription, setFullDescription] = useState(`A powerful AI-powered chat application that leverages OpenAI's GPT-4 to provide intelligent conversations. Built with React and TypeScript, featuring a modern UI with real-time messaging, conversation history, and customizable AI personalities.

Key features include:
- Real-time AI responses powered by GPT-4
- Conversation history and persistence
- Multiple AI personalities to choose from
- Dark mode support
- Responsive design for all devices
- Export conversations to various formats`);
  const [languages, setLanguages] = useState<string[]>(['React', 'TypeScript', 'Tailwind', 'OpenAI']);
  const [newLanguage, setNewLanguage] = useState('');
  const [lookingForCollaborators, setLookingForCollaborators] = useState(true);
  const [skillsNeeded, setSkillsNeeded] = useState('React, Node.js, MongoDB');
  const [liveDemo, setLiveDemo] = useState('https://ai-chat-app.example.com');
  const [github, setGithub] = useState('https://github.com/sarahj/ai-chat-app');
  const [screenshots, setScreenshots] = useState<string[]>(['📸', '📸', '📸']);

  const addLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter((l) => l !== lang));
  };

  const commonLanguages = ['React', 'TypeScript', 'Next.js', 'Vue', 'Python', 'Node.js', 'Django', 'Go', 'Rust', 'Swift'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Edit Project: {title}</h2>
          <p className="text-gray-500 text-sm mt-1">Update your project details</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-8">
        {/* Project Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Project Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief description of your project"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Description *</label>
            <textarea
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detailed description of your project (Markdown supported)"
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3] resize-none"
            />
          </div>
        </div>

        {/* Current Screenshots */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Current Screenshots</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {screenshots.map((screenshot, index) => (
              <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-4xl">{screenshot}</div>
                <button
                  onClick={() => setScreenshots(screenshots.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#0070f3] transition-colors">
              <Plus className="w-8 h-8 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Languages & Technologies */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Languages & Technologies</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
              placeholder="Add a language or technology"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
            />
            <button
              onClick={addLanguage}
              className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {commonLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => !languages.includes(lang) && setLanguages([...languages, lang])}
                disabled={languages.includes(lang)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  languages.includes(lang)
                    ? 'bg-[#0070f3] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {languages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0070f3]/10 text-[#0070f3] rounded-full text-sm font-medium"
                >
                  {lang}
                  <button
                    onClick={() => removeLanguage(lang)}
                    className="hover:text-[#7928ca] transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Collaboration Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Collaboration Info</h3>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="lookingForCollaborators"
              checked={lookingForCollaborators}
              onChange={(e) => setLookingForCollaborators(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#0070f3] focus:ring-[#0070f3]"
            />
            <label htmlFor="lookingForCollaborators" className="text-sm font-medium text-gray-700">
              Looking for collaborators
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills needed (optional)</label>
            <input
              type="text"
              value={skillsNeeded}
              onChange={(e) => setSkillsNeeded(e.target.value)}
              placeholder="e.g., React, Node.js, MongoDB"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
            />
          </div>
        </div>

        {/* Project Links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Project Links (Copy Only)</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo (optional)</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={liveDemo}
                onChange={(e) => setLiveDemo(e.target.value)}
                placeholder="https://your-project.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GitHub (optional)</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-red-200 bg-red-50 rounded-xl p-6">
          <h3 className="font-semibold text-red-700 mb-4">⚠️ Danger Zone</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4" />
                Archive Project
              </div>
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Project
              </div>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <Link
            href="/dashboard/projects"
            className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0070f3] to-[#7928ca] text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#0070f3]/25 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
