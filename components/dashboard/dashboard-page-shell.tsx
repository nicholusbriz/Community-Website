import type { ReactNode } from 'react';

type DashboardPageShellProps = {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
};

export function DashboardPageShell({ title, description, action, children }: DashboardPageShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{title}</h1>
            <p className="mt-2 text-lg text-gray-600">{description}</p>
          </div>
          {action}
        </div>

        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
