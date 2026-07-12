type AuthGatedSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AuthGatedSection({ title, description, children }: AuthGatedSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
