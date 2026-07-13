'use client';

import { useState } from 'react';
import { Upload, X, Plus, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState('');
  const [lookingForCollaborators, setLookingForCollaborators] = useState(false);
  const [skillsNeeded, setSkillsNeeded] = useState('');
  const [liveDemo, setLiveDemo] = useState('');
  const [github, setGithub] = useState('');
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const addLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter((l) => l !== lang));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Project data:', {
      title,
      shortDescription,
      fullDescription,
      languages,
      lookingForCollaborators,
      skillsNeeded,
      liveDemo,
      github,
      publishImmediately,
      allowComments,
      screenshots,
    });
    // Redirect to projects page
    router.push('/dashboard/projects');
  };

  const commonLanguages = ['React', 'TypeScript', 'Next.js', 'Vue', 'Python', 'Node.js', 'Django', 'Go', 'Rust', 'Swift'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-1">Upload and showcase your project to the community</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-8">
        {/* Project Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Project Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief description of your project (max 160 characters)"
              maxLength={160}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              {shortDescription.length}/160 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detailed description of your project (Markdown supported)"
              rows={6}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Screenshots */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Screenshots</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-1">Drag & Drop or Click to Upload</p>
            <p className="text-xs text-gray-500">JPEG, PNG, WebP (Max 5MB each)</p>
          </div>

          {screenshots.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {screenshots.map((screenshot, index) => (
                <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-blue-50 to-purple-50">
                    📸
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreenshots(screenshots.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Languages */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Languages & Technologies</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
              placeholder="Add a language or technology"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={addLanguage}
              className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {commonLanguages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => !languages.includes(lang) && setLanguages([...languages, lang])}
                disabled={languages.includes(lang)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  languages.includes(lang)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {languages.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className="hover:text-blue-900 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Collaboration */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Collaboration</h3>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="lookingForCollaborators"
              checked={lookingForCollaborators}
              onChange={(e) => setLookingForCollaborators(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="lookingForCollaborators" className="text-sm text-gray-700">
              Looking for collaborators
            </label>
          </div>

          {lookingForCollaborators && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills needed
              </label>
              <input
                type="text"
                value={skillsNeeded}
                onChange={(e) => setSkillsNeeded(e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Project Links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Project Links</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Live Demo
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={liveDemo}
                onChange={(e) => setLiveDemo(e.target.value)}
                placeholder="https://your-project.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Repository
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Publishing Options */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Publishing Options</h3>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="publishImmediately"
              checked={publishImmediately}
              onChange={(e) => setPublishImmediately(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="publishImmediately" className="text-sm text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="allowComments"
              checked={allowComments}
              onChange={(e) => setAllowComments(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="allowComments" className="text-sm text-gray-700">
              Allow comments
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <Link
            href="/dashboard/projects"
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="button"
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-600/25 transition-all"
          >
            Publish Project
          </button>
        </div>
      </form>
    </div>
  );
}