import Link from 'next/link';

type DeveloperCardProps = {
  id: number;
  name: string;
  role: string;
  projects: number;
  href?: string;
};

export function DeveloperCard({ id, name, role, projects, href }: DeveloperCardProps) {
  const destination = href ?? `/developer/${name.toLowerCase().replace(/\s+/g, '')}`;

  return (
    <Link
      href={destination}
      className="group rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 transition-transform group-hover:scale-110">
        <span className="text-3xl">👤</span>
      </div>
      <h3 className="mb-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-[#0070f3]">
        {name}
      </h3>
      <p className="mb-2 text-sm text-gray-600">{role}</p>
      <p className="mb-4 text-sm text-gray-500">{projects} projects</p>
      <span className="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
        View profile
      </span>
    </Link>
  );
}
