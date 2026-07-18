// app/developers/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePublicUser } from '@/app/lib/hooks/useUsersDirectory';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { 
  ArrowLeft,
  MapPin, 
  GitBranch, 
  Link2, 
  Globe, 
  Calendar, 
  FolderGit2, 
  Users,
  Shield,
  Code,
  Mail,
  Briefcase,
  User,
  Crown,
  Award,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2
} from 'lucide-react';

export default function DeveloperProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data, isLoading, error } = usePublicUser(userId);

  // Redirect if no ID
  useEffect(() => {
    if (!userId || userId === 'null') {
      router.push('/developers');
    }
  }, [userId, router]);

  if (!userId || userId === 'null') {
    return null;
  }

  // Handle loading state with animation
  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#1B2A56] dark:text-[#8CA0DE] mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error?.message || 'The developer you\'re looking for doesn\'t exist.'}
          </p>
          <Link
            href="/developers"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Developers
          </Link>
        </div>
      </div>
    );
  }

  const user = data.user;
  const projects = user.projects || [];
  const projectCount = user._count?.projectsCreated || 0;
  const membershipCount = user._count?.memberships || 0;

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      'OPEN': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'IN_PROGRESS': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'REVIEW': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'COMPLETED': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'ON_HOLD': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'CANCELLED': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'ARCHIVED': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'DRAFT': 'Draft',
      'OPEN': 'Open',
      'IN_PROGRESS': 'In Progress',
      'REVIEW': 'Review',
      'COMPLETED': 'Completed',
      'ON_HOLD': 'On Hold',
      'CANCELLED': 'Cancelled',
      'ARCHIVED': 'Archived',
    };
    return labels[status] || status;
  };

  // Get role badge
  const getRoleBadge = (roleName: string) => {
    const badges: Record<string, { icon: any; color: string; label: string }> = {
      'SUPERADMIN': { icon: Crown, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', label: 'Super Admin' },
      'ADMIN': { icon: Shield, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Admin' },
      'PROJECT_LEAD': { icon: Star, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Project Lead' },
      'MENTOR': { icon: Award, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Mentor' },
    };
    return badges[roleName] || { icon: User, color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', label: roleName || 'Member' };
  };

  const roleBadge = getRoleBadge(user.role?.name || 'USER');
  const RoleIcon = roleBadge.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/developers" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Developers
        </Link>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-xl overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-[#0B0F1A] via-[#16223F] to-[#1B2A56] relative">
            <div className="absolute bottom-0 left-8 transform translate-y-1/2">
              <div className="w-24 h-24 rounded-full ring-4 ring-white dark:ring-gray-800 bg-gradient-to-br from-[#0B0F1A] via-[#16223F] to-[#1B2A56] flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-xl">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'User'}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials()}</span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 pb-8 px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name || 'Unknown User'}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color} flex items-center gap-1.5`}>
                    <RoleIcon className="h-3.5 w-3.5" />
                    {roleBadge.label}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Active
                  </span>
                </div>

                {user.username && (
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    @{user.username}
                  </p>
                )}

                {user.bio && (
                  <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                    {user.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 mt-4">
                  {user.location && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  {user.email && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${user.email}`} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                        {user.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {user.github && (
                    <a 
                      href={user.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <GitBranch className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                  {user.linkedin && (
                    <a 
                      href={user.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Link2 className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {user.portfolio && (
                    <a 
                      href={user.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <FolderGit2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{projectCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Projects Created</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{membershipCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Project Memberships</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.skills?.length || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Skills</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {user.skills && user.skills.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Code className="h-5 w-5 text-[#1B2A56] dark:text-[#8CA0DE]" />
              Skills & Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill: string) => (
                <span 
                  key={skill} 
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-800/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#1B2A56] dark:text-[#8CA0DE]" />
              Projects
              {projectCount > 0 && (
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({projectCount})
                </span>
              )}
            </h2>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project: any) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 hover:shadow-lg hover:border-[#1B2A56]/30 dark:hover:border-[#8CA0DE]/30 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-[#1B2A56] dark:group-hover:text-[#8CA0DE] transition-colors truncate">
                          {project.title}
                        </h3>
                        {project.techStack && project.techStack.length > 0 && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                            {project.techStack[0]}
                            {project.techStack.length > 1 && ` +${project.techStack.length - 1}`}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                        {project.difficulty && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            project.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            project.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {project.difficulty.toLowerCase()}
                          </span>
                        )}
                        <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {project._count?.members || 0}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-[#1B2A56] dark:group-hover:text-[#8CA0DE] transition-colors flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-12 text-center">
              <FolderGit2 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No projects yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                This developer hasn't created any projects yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}