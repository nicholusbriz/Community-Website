'use client';

import { Loader2 } from 'lucide-react';

export function DashboardSkeleton() {
  return (
    // ✅ Remove outer container with max-w-7xl - let parent handle it
    <div className="w-full space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-48 bg-gray-200 rounded"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 rounded mt-1.5"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-2.5 w-full bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2 mb-3">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Members & Join Requests Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between mb-4">
            <div>
              <div className="h-6 w-40 bg-gray-200 rounded"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mt-1"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 w-full bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-48 bg-gray-200 rounded mt-1"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between mb-4">
            <div>
              <div className="h-6 w-40 bg-gray-200 rounded"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mt-1"></div>
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-48 bg-gray-200 rounded mt-1"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between">
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mt-1"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}