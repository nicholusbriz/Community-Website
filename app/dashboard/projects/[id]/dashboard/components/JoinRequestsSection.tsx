'use client';

import { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { RequestCard } from './RequestCard';

interface JoinRequestsSectionProps {
  requests: any[];
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
  onRefresh: () => void;
}

export function JoinRequestsSection({ 
  requests, 
  onApprove, 
  onReject,
  onRefresh 
}: JoinRequestsSectionProps) {
  const [filter, setFilter] = useState<'PENDING' | 'ALL'>('PENDING');
  
  const filteredRequests = filter === 'PENDING' 
    ? requests.filter((r: any) => r.status === 'PENDING')
    : requests;

  const pendingCount = requests.filter((r: any) => r.status === 'PENDING').length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Join Requests</h3>
          <p className="text-sm text-gray-500 mt-0.5">Manage requests to join your project</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'PENDING' 
                ? 'bg-[#1B2A56] text-white' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pending {pendingCount > 0 && `(${pendingCount})`}
          </button>
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'ALL' 
                ? 'bg-[#1B2A56] text-white' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No join requests found</p>
            <p className="text-gray-400 text-sm">There are no requests to review</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
            {filteredRequests.map((request: any) => (
              <RequestCard 
                key={request.id}
                request={request}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
