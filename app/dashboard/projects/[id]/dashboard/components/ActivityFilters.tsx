// app/dashboard/projects/[id]/dashboard/components/ActivityFilters.tsx
'use client';

import { Search } from 'lucide-react';

interface ActivityFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedAction: string;
  onActionChange: (value: string) => void;
  actionTypes?: string[]; // ✅ Added as optional prop
  isLoading?: boolean; // ✅ Added loading state
}

export function ActivityFilters({ 
  searchQuery, 
  onSearchChange, 
  selectedAction, 
  onActionChange,
  actionTypes = [], // ✅ Default to empty array
  isLoading = false,
}: ActivityFiltersProps) {
  // Format action name for display
  const formatActionName = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
          />
        </div>

        {/* Action Filter Dropdown */}
        <div className="flex gap-3">
          <select
            value={selectedAction}
            onChange={(e) => onActionChange(e.target.value)}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
          >
            <option value="">All Actions</option>
            {actionTypes.map((action) => (
              <option key={action} value={action}>
                {formatActionName(action)}
              </option>
            ))}
          </select>

          {/* ✅ Optional: Clear filters button */}
          {(searchQuery || selectedAction) && (
            <button
              onClick={() => {
                onSearchChange('');
                onActionChange('');
              }}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ✅ Optional: Show active filters count */}
      {(searchQuery || selectedAction) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
              Search: "{searchQuery}"
              <button
                onClick={() => onSearchChange('')}
                className="hover:text-blue-900 ml-1"
              >
                ×
              </button>
            </span>
          )}
          {selectedAction && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
              Action: {formatActionName(selectedAction)}
              <button
                onClick={() => onActionChange('')}
                className="hover:text-blue-900 ml-1"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}