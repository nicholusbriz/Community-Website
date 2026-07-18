'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ListChecks, User, Calendar } from 'lucide-react';

interface RecentTasksProps {
  tasks: any[];
  projectId: string;
}

export function RecentTasks({ tasks, projectId }: RecentTasksProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
          <p className="text-sm text-gray-500 mt-0.5">Latest updates on your project tasks</p>
        </div>
        <Link
          href={`/dashboard/projects/${projectId}/tasks`}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          View All Tasks
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {tasks && tasks.length > 0 ? (
          tasks.slice(0, 5).map((task: any) => (
            <div
              key={task.id}
              onClick={() => router.push(`/dashboard/projects/${projectId}/tasks/${task.id}`)}
              className="cursor-pointer hover:bg-gray-50 transition-colors duration-150 group p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    task.status === 'COMPLETED' ? 'bg-emerald-500' :
                    task.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                    task.status === 'REVIEW' ? 'bg-amber-500' :
                    task.status === 'BLOCKED' ? 'bg-red-500' :
                    task.status === 'BACKLOG' ? 'bg-gray-400' :
                    'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap mt-0.5">
                      <span className="capitalize bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                        {task.status.replace('_', ' ').toLowerCase()}
                      </span>
                      {task.assignedTo && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {task.assignedTo.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <ListChecks className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No tasks created yet</p>
            <Link
              href={`/dashboard/projects/${projectId}/tasks/new`}
              className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your first task →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
