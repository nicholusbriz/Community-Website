'use client';

interface TaskDistributionProps {
  tasks: any[];
}

export function TaskDistribution({ tasks }: TaskDistributionProps) {
  const totalTasks = tasks.reduce((sum, s) => sum + s._count, 0);

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
        <p className="text-gray-500 text-sm text-center py-4">No tasks available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
      <div className="space-y-3">
        {tasks.map((stat: any) => (
          <div key={stat.status}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{stat.status.replace('_', ' ')}</span>
              <span className="font-medium text-gray-900">{stat._count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: totalTasks > 0 ? (stat._count / totalTasks * 100) + '%' : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
