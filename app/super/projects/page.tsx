import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Review Projects - DevCollab Hub',
  description: 'Project review queue',
};

export default function ReviewProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#202124] dark:text-[#e8eaed]">
        Projects
      </h1>
      <p className="text-[#5f6368] dark:text-[#9aa0a6] mt-2">
        Project
      </p>
      {/* TODO: Implement this page */}
    </div>
  );
}
