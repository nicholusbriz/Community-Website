// app/projects/[slug]/components/ProjectActions.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, 
  Settings, 
  Users, 
  MessageSquare, 
  XCircle, 
  Clock as ClockIcon,
  Share2,
  AlertCircle
} from 'lucide-react';

interface ProjectActionsProps {
  project: any;
  userId?: string;
  isAuthenticated: boolean;
  isMember: boolean;
  isOwner: boolean;
  joinRequestStatus: string | null;
  isAcceptingMembers: boolean;
  projectId: string;
}

export function ProjectActions({
  project,
  userId,
  isAuthenticated,
  isMember,
  isOwner,
  joinRequestStatus,
  isAcceptingMembers,
  projectId,
}: ProjectActionsProps) {
  const router = useRouter();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Project link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleJoinRequest = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send join request');
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Failed to send join request');
    }
  };

  return (
    <div className="space-y-3">
      {/* 📌 CASE 1: User is the OWNER */}
      {isOwner && (
        <>
          <Link
            href={`/dashboard/projects/${projectId}/dashboard`}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Manage Project
          </Link>
          <Link
            href={`/dashboard/projects/${projectId}/dashboard`}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <Users className="w-4 h-4" />
            Project Dashboard
          </Link>
        </>
      )}
      
      {/* 📌 CASE 2: User is a MEMBER */}
      {isMember && !isOwner && (
        <>
          <Link
            href={`/dashboard/projects/${projectId}/dashboard`}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            Project Dashboard
          </Link>
          <button
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
        </>
      )}
      
      {/* 📌 CASE 3: Not a member, but AUTHENTICATED */}
      {!isMember && isAuthenticated && (
        <>
          {isAcceptingMembers ? (
            <button
              onClick={handleJoinRequest}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-600/25 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Request to Join
            </button>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed"
            >
              <XCircle className="w-4 h-4" />
              {project.status === 'COMPLETED' ? 'Completed' : 'Not Accepting Members'}
            </button>
          )}
          
          {joinRequestStatus === 'PENDING' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
              <ClockIcon className="w-4 h-4 inline mr-2" />
              Your request to join this project has been sent to the project owner, 
            </div>
          )}
        </>
      )}
      
      {/* 📌 CASE 4: Not authenticated (Guest) */}
      {!isAuthenticated && (
        <>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Log in to Join
          </Link>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Log in to request to join this project
          </div>
        </>
      )}
      
      {/* Share Button (Always visible) */}
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share Project
      </button>
    </div>
  );
}