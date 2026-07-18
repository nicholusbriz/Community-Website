// app/dashboard/projects/[id]/dashboard/components/ActivitySection.tsx
'use client';

import { useState, useMemo } from 'react';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { ActivityItem } from './ActivityItem';
import { ActivityFilters } from './ActivityFilters';

interface ActivitySectionProps {
  activities: any[];
  onRefresh: () => void;
  actionTypes?: string[]; // ✅ Added for filter dropdown
  isLoading?: boolean; // ✅ Added loading state
}

export function ActivitySection({ 
  activities, 
  onRefresh,
  actionTypes = [],
  isLoading = false,
}: ActivitySectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  // ✅ Filter activities based on search and action filter
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((activity) => {
        // Search in user name
        const userName = activity.user?.name?.toLowerCase() || '';
        // Search in action
        const actionName = activity.action?.toLowerCase() || '';
        // Search in details (if any)
        const detailsString = activity.details ? JSON.stringify(activity.details).toLowerCase() : '';
        
        return userName.includes(query) || 
               actionName.includes(query) || 
               detailsString.includes(query);
      });
    }

    // Filter by selected action
    if (selectedAction) {
      filtered = filtered.filter((activity) => activity.action === selectedAction);
    }

    return filtered;
  }, [activities, searchQuery, selectedAction]);

  // ✅ Determine which activities to display
  const displayActivities = showAll ? filteredActivities : filteredActivities.slice(0, 5);

  // ✅ Get unique action types from activities
  const availableActionTypes = useMemo(() => {
    if (actionTypes.length > 0) return actionTypes;
    // Fallback: extract from activities
    const types = new Set<string>();
    activities.forEach((activity) => {
      if (activity.action) types.add(activity.action);
    });
    return Array.from(types);
  }, [activities, actionTypes]);

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Track all project activity
            {filteredActivities.length !== activities.length && (
              <span className="ml-1 text-gray-400">
                ({filteredActivities.length} of {activities.length} shown)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* ✅ Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            {showAll ? 'Show Less' : 'View All'}
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filters */}
      <ActivityFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAction={selectedAction}
        onActionChange={setSelectedAction}
        actionTypes={availableActionTypes}
        isLoading={isLoading}
      />

      {/* Activity List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1B2A56] border-t-transparent"></div>
          </div>
        ) : displayActivities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchQuery || selectedAction ? 'No matching activity found' : 'No activity yet'}
            </p>
            <p className="text-gray-400 text-sm">
              {searchQuery || selectedAction 
                ? 'Try adjusting your filters' 
                : 'Activity will appear here as actions are taken'}
            </p>
            {/* ✅ Clear filters button when filters are active */}
            {(searchQuery || selectedAction) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedAction('');
                }}
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {displayActivities.map((activity: any) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>

      {/* ✅ Show count if filtered */}
      {filteredActivities.length > 5 && !showAll && (
        <div className="text-center mt-3">
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Show {filteredActivities.length - 5} more activities
          </button>
        </div>
      )}
    </div>
  );
}