import Link from 'next/link';
import { Heart } from 'lucide-react';

type ProjectCardProps = {
  id: number;
  title: string;
  tech: string;
  owner: string;
  likes: number;
  href?: string;
};

export function ProjectCard({ id, title, tech, owner, likes, href }: ProjectCardProps) {
  const destination = href ?? `/project/${id}`;

  return (
    <Link
      href={destination}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 text-4xl">
        📸
      </div>
      <div className="p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#0070f3]/10 px-2 py-1 text-xs font-medium text-[#0070f3]">
            🚀 {tech}
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-[#0070f3]">
          {title}
        </h3>
        <p className="mb-4 text-sm text-gray-600">👤 {owner}</p>
        <div className="mb-4 flex items-center gap-1 text-sm text-gray-500">
          <Heart className="h-4 w-4" />
          <span>{likes} likes</span>
        </div>
        <span className="inline-flex w-full items-center justify-center rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
          View
        </span>
      </div>
    </Link>
  );
}
