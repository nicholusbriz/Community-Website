// app/dashboard/projects/[id]/dashboard/components/MemberCard.tsx
'use client';

import { useState } from 'react';
import { Trash2, Crown, UserCheck, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';

interface MemberCardProps {
  member: any;
  isOwner: boolean;
  projectOwnerId: string;
  onRemove: (userId: string) => Promise<void>;
  onMakeLead?: (userId: string) => Promise<void>;
  onRemoveLead?: (userId: string) => Promise<void>;
  isLead?: boolean;
}

export function MemberCard({ 
  member, 
  isOwner, 
  projectOwnerId, 
  onRemove,
  onMakeLead,
  onRemoveLead,
  isLead = false
}: MemberCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLeadLoading, setIsLeadLoading] = useState(false);

  const handleRemove = async () => {
    if (!confirm(`Are you sure you want to remove ${member.user.name} from this project?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await onRemove(member.userId);
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error('Failed to remove member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeLead = async () => {
    if (!onMakeLead) return;
    
    setIsLeadLoading(true);
    try {
      await onMakeLead(member.userId);
      toast.success(`${member.user.name} is now a project lead`);
    } catch (error) {
      toast.error('Failed to make member a project lead');
    } finally {
      setIsLeadLoading(false);
    }
  };

  const handleRemoveLead = async () => {
    if (!onRemoveLead) return;
    
    setIsLeadLoading(true);
    try {
      await onRemoveLead(member.userId);
      toast.success(`${member.user.name} is no longer a project lead`);
    } catch (error) {
      toast.error('Failed to remove project lead status');
    } finally {
      setIsLeadLoading(false);
    }
  };

  // Don't show actions for project owner
  const isProjectOwner = member.userId === projectOwnerId;

  return (
    <div className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
        {member.user.image ? (
          <img src={member.user.image} alt={member.user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium">
            {member.user.name?.charAt(0) || 'U'}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-medium text-gray-900 truncate">
            {member.user.name || 'Unknown User'}
          </h3>
          {isLead && (
            <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              <Crown className="w-3 h-3" />
              Project Lead
            </span>
          )}
          {isProjectOwner && (
            <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
              <span className="text-yellow-500">👑</span>
              Owner
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{member.user.email}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Make Lead Button - Only show for owners, not for project owner, not for existing leads */}
        {isOwner && !isProjectOwner && !isLead && onMakeLead && (
          <button
            onClick={handleMakeLead}
            disabled={isLeadLoading}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            title="Make Project Lead"
          >
            <Crown className="w-4 h-4" />
          </button>
        )}

        {/* Remove Lead Button - Only show for owners, not for project owner, for existing leads */}
        {isOwner && !isProjectOwner && isLead && onRemoveLead && (
          <button
            onClick={handleRemoveLead}
            disabled={isLeadLoading}
            className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
            title="Remove as Project Lead"
          >
            <UserMinus className="w-4 h-4" />
          </button>
        )}

        {/* Remove Button - Only show for project owner, not for project owner themselves */}
        {isOwner && !isProjectOwner && (
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Remove from project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}