'use client';

import { useState } from 'react';

interface CardProps {
  className?: string;
  // TODO: Add props
}

export function Card({ className = '' }: CardProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={`${className} bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm p-4 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]`}>
      {/* TODO: Implement Card */}
      <p className="text-[#5f6368] dark:text-[#9aa0a6]">Card component</p>
    </div>
  );
}
