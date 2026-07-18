'use client';

interface ProgressSectionProps {
  project: any;
}

export function ProgressSection({ project }: ProgressSectionProps) {
  const taskCount = project._count?.tasks || 0;
  const completedTasks = project.tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0;
  const progress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
          <p className="text-sm text-gray-500 mt-0.5">Track your project's completion status</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">{progress}% Complete</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {completedTasks} / {taskCount} tasks
          </span>
        </div>
      </div>
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
