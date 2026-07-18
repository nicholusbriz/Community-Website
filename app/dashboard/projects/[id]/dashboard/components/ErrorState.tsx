'use client';

import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: any;
  onRetry: () => void;
  projectId: string;
}

export function ErrorState({ error, onRetry, projectId }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          {error?.message || 'Failed to load project dashboard. Please try again.'}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
