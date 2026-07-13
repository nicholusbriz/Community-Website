'use client';

import { useState } from 'react';
import { Camera, Plus, Link as LinkIcon, Bell, Shield, Lock, Mail, MapPin, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('Sarah Johnson');
  const [username, setUsername] = useState('sarahj');
  const [bio, setBio] = useState('Passionate full-stack developer with 5+ years of experience building scalable web applications.');
  const [location, setLocation] = useState('San Francisco');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js', 'Next.js']);
  const [newSkill, setNewSkill] = useState('');
  const [github, setGithub] = useState('https://github.com/sarahj');
  const [linkedin, setLinkedin] = useState('https://linkedin.com/in/sarahj');
  const [portfolio, setPortfolio] = useState('https://sarahj.dev');
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyJoinRequests, setNotifyJoinRequests] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyProjectUpdates, setNotifyProjectUpdates] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', {
      displayName,
      username,
      bio,
      location,
      skills,
      github,
      linkedin,
      portfolio,
      notifications: {
        comments: notifyComments,
        joinRequests: notifyJoinRequests,
        messages: notifyMessages,
        projectUpdates: notifyProjectUpdates,
      },
    });
    router.push('/dashboard');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Password updated');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Password updated successfully');
  };

  const commonSkills = ['React', 'TypeScript', 'Next.js', 'Vue', 'Python', 'Node.js', 'Django', 'Go', 'Rust', 'Swift', 'GraphQL', 'MongoDB', 'PostgreSQL'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-8">
        {/* Avatar */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Avatar</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center border-2 border-gray-200">
              <span className="text-4xl">👤</span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-4 h-4" />
              Change Photo
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Username must be unique and can only contain letters, numbers, and underscores</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{bio.length}/500 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Skills</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Add a skill"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {commonSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => !skills.includes(skill) && setSkills([...skills, skill])}
                disabled={skills.includes(skill)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  skills.includes(skill)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-blue-900 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Social Links</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://yourportfolio.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Notification Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Project comments</span>
              </div>
              <input
                type="checkbox"
                checked={notifyComments}
                onChange={(e) => setNotifyComments(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Join requests</span>
              </div>
              <input
                type="checkbox"
                checked={notifyJoinRequests}
                onChange={(e) => setNotifyJoinRequests(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Messages</span>
              </div>
              <input
                type="checkbox"
                checked={notifyMessages}
                onChange={(e) => setNotifyMessages(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Project updates</span>
              </div>
              <input
                type="checkbox"
                checked={notifyProjectUpdates}
                onChange={(e) => setNotifyProjectUpdates(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <Link
            href="/dashboard"
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-600/25 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Change Password Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
          <p className="text-gray-600 mt-1">Secure password updates for signed-in users</p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}