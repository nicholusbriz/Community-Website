// app/dashboard/projects/[id]/dashboard/components/ActivityItem.tsx
'use client';

import { 
  Plus, 
  Settings, 
  XCircle, 
  CheckCircle, 
  UserPlus, 
  UserMinus, 
  Activity,
  Clock,
  MessageSquare,
  Users,
  Crown,
  Shield,
  FileText,
  User
} from 'lucide-react';

interface ActivityItemProps {
  activity: any;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const getActionIcon = (action: string) => {
    const actionUpper = action.toUpperCase();
    
    // Project actions
    if (actionUpper.includes('PROJECT_CREATED')) return <Plus className="w-4 h-4 text-green-500" />;
    if (actionUpper.includes('PROJECT_UPDATED')) return <Settings className="w-4 h-4 text-blue-500" />;
    
    // Member actions
    if (actionUpper.includes('MEMBER_JOINED')) return <UserPlus className="w-4 h-4 text-purple-500" />;
    if (actionUpper.includes('MEMBER_LEFT') || actionUpper.includes('MEMBER_REMOVED')) 
      return <UserMinus className="w-4 h-4 text-orange-500" />;
    
    // Lead actions
    if (actionUpper.includes('LEAD_ASSIGNED')) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (actionUpper.includes('LEAD_REMOVED')) return <Shield className="w-4 h-4 text-gray-500" />;
    
    // Task actions
    if (actionUpper.includes('TASK_CREATED')) return <FileText className="w-4 h-4 text-blue-500" />;
    if (actionUpper.includes('TASK_ASSIGNED')) return <UserPlus className="w-4 h-4 text-indigo-500" />;
    if (actionUpper.includes('TASK_UNASSIGNED')) return <UserMinus className="w-4 h-4 text-gray-500" />;
    if (actionUpper.includes('TASK_COMPLETED')) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (actionUpper.includes('TASK_STATUS_CHANGED')) return <Settings className="w-4 h-4 text-yellow-500" />;
    
    // Request actions
    if (actionUpper.includes('REQUEST_APPROVED')) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (actionUpper.includes('REQUEST_REJECTED')) return <XCircle className="w-4 h-4 text-red-500" />;
    
    // Message actions
    if (actionUpper.includes('MESSAGE_SENT')) return <MessageSquare className="w-4 h-4 text-blue-500" />;
    
    // User admin actions
    if (actionUpper.includes('USER_ROLE_UPDATED')) return <Users className="w-4 h-4 text-purple-500" />;
    if (actionUpper.includes('USER_DELETED')) return <XCircle className="w-4 h-4 text-red-500" />;
    
    // Default
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  // ✅ Get color for action type badge
  const getActionColor = (action: string) => {
    const actionUpper = action.toUpperCase();
    if (actionUpper.includes('CREATE') || actionUpper.includes('JOIN') || actionUpper.includes('APPROVE')) 
      return 'bg-green-50 border-green-200';
    if (actionUpper.includes('UPDATE') || actionUpper.includes('CHANGE') || actionUpper.includes('ASSIGN')) 
      return 'bg-blue-50 border-blue-200';
    if (actionUpper.includes('DELETE') || actionUpper.includes('REMOVE') || actionUpper.includes('REJECT') || actionUpper.includes('LEAVE')) 
      return 'bg-red-50 border-red-200';
    if (actionUpper.includes('LEAD')) 
      return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  // ✅ Format action name for display
  const formatActionName = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // ✅ Get a preview of details
  const getDetailsPreview = (details: any) => {
    if (!details) return null;
    
    // Check for common detail fields
    if (details.taskTitle) return `Task: ${details.taskTitle}`;
    if (details.userName) return `User: ${details.userName}`;
    if (details.reason) return `Reason: ${details.reason}`;
    if (details.message) return `Message: ${details.message}`;
    
    // If details is an object, try to get a readable string
    const entries = Object.entries(details);
    if (entries.length === 1) {
      const [key, value] = entries[0];
      return `${key}: ${value}`;
    }
    
    return null;
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {activity.user?.image ? (
            <img 
              src={activity.user.image} 
              alt={activity.user?.name || 'User'} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium">
              {activity.user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>

        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-900">
              {activity.user?.name || 'Unknown User'}
            </span>
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${getActionColor(activity.action)}`}>
              {getActionIcon(activity.action)}
              <span className="text-gray-700">
                {formatActionName(activity.action)}
              </span>
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3" />
              {new Date(activity.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Details Preview */}
          {activity.details && (
            <div className="mt-2 text-sm text-gray-600">
              {getDetailsPreview(activity.details) ? (
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <p className="text-gray-700">{getDetailsPreview(activity.details)}</p>
                </div>
              ) : (
                <details className="mt-1">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                    View details
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-50 p-2 rounded-lg border border-gray-100 overflow-x-auto whitespace-pre-wrap font-sans">
                    {JSON.stringify(activity.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}