'use client';

import { useState } from 'react';

interface TextAreaProps {
  className?: string;
  // TODO: Add props
}

export function TextArea({ className = '' }: TextAreaProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={`${className} bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm p-4 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]`}>
      {/* TODO: Implement TextArea */}
      <p className="text-[#5f6368] dark:text-[#9aa0a6]">TextArea component</p>
    </div>
  );
}
