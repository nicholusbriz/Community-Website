import type { ReactNode } from 'react';

type AuthGatedSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthGatedSection({ title, description, children }: AuthGatedSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}
