'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface RequestCardProps {
  request: any;
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

export function RequestCard({ request, onApprove, onReject }: RequestCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-700',
      'APPROVED': 'bg-green-100 text-green-700',
      'REJECTED': 'bg-red-100 text-red-700',
      'CANCELLED': 'bg-gray-100 text-gray-700',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  };

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsProcessing(true);
    try {
      if (action === 'approve') {
        await onApprove(request.id);
      } else {
        await onReject(request.id);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {request.user.image ? (
              <img 
                src={request.user.image} 
                alt={request.user.name || 'User'} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium">
                {request.user.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-gray-900 truncate">
                {request.user.name || 'Unknown'}
              </h4>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">{request.user.email}</p>
            {request.message && (
              <p className="text-sm text-gray-600 mt-1 break-words">{request.message}</p>
            )}
            {request.skills && request.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {request.skills.slice(0, 3).map((skill: string) => (
                  <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
                {request.skills.length > 3 && (
                  <span className="text-xs text-gray-400">+{request.skills.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {request.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleAction('approve')}
                disabled={isProcessing}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-sm font-medium"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Approve
              </button>
              <button
                onClick={() => handleAction('reject')}
                disabled={isProcessing}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-sm font-medium"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Reject
              </button>
            </>
          )}
          {request.reviewedBy && (
            <span className="text-xs text-gray-400 ml-2">
              Reviewed by {request.reviewedBy.name || 'Unknown'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
