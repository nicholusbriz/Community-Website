// MembersSection.tsx
'use client';

import { useState } from 'react';
import { Users, Search, Crown, UserCheck } from 'lucide-react';
import { MemberCard } from './MemberCard';

interface MembersSectionProps {
  members: any[];
  owner: any;
  isOwner: boolean;
  projectId: string;
  onRemoveMember: (userId: string) => Promise<void>;
  onMakeProjectLead: (userId: string) => Promise<void>; // New prop
}

export function MembersSection({ 
  members, 
  owner, 
  isOwner, 
  projectId,
  onRemoveMember,
  onMakeProjectLead 
}: MembersSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members.filter((m: any) => 
    m.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate project leads and regular members
  const projectLeads = filteredMembers.filter((m: any) => m.role === 'LEAD');
  const regularMembers = filteredMembers.filter((m: any) => m.role !== 'LEAD');

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {isOwner ? 'Manage your project team and assign leads' : 'View project team members'}
          </p>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span>You can make members project leads</span>
          </div>
        )}
      </div>

      {/* Owner Card */}
      {owner && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 flex items-center gap-4 hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {owner.image ? (
              <img src={owner.image} alt={owner.name || 'Owner'} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium text-lg">
                {owner.name?.charAt(0) || 'O'}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-gray-900">{owner.name || 'Unknown'}</h3>
              <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                <span className="text-yellow-500">👑</span>
                Project Owner
              </span>
            </div>
            <p className="text-sm text-gray-500">{owner.email}</p>
          </div>
        </div>
      )}

      {/* Search Members */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
        />
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No members found</p>
            {searchQuery && (
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {/* Project Leads Section */}
            {projectLeads.length > 0 && (
              <>
                <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-blue-900">Project Leads</h4>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                      {projectLeads.length}
                    </span>
                  </div>
                </div>
                {projectLeads.map((member: any) => (
                  <MemberCard 
                    key={member.userId}
                    member={member}
                    isOwner={isOwner}
                    projectOwnerId={owner?.id}
                    onRemove={onRemoveMember}
                    onMakeLead={onMakeProjectLead}
                    isLead={true}
                  />
                ))}
              </>
            )}

            {/* Regular Members Section */}
            {regularMembers.length > 0 && (
              <>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-700">Members</h4>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                      {regularMembers.length}
                    </span>
                  </div>
                </div>
                {regularMembers.map((member: any) => (
                  <MemberCard 
                    key={member.userId}
                    member={member}
                    isOwner={isOwner}
                    projectOwnerId={owner?.id}
                    onRemove={onRemoveMember}
                    onMakeLead={onMakeProjectLead}
                    isLead={false}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}