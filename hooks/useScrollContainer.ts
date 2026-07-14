// hooks/useScrollContainer.ts
'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollContainerContext {
  container: HTMLElement | null;
  setContainer: (element: HTMLElement | null) => void;
}

let scrollContainerInstance: HTMLElement | null = null;

export function useScrollContainer(): ScrollContainerContext {
  const [container, setContainerState] = useState<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const setContainer = (element: HTMLElement | null) => {
    containerRef.current = element;
    setContainerState(element);
    if (element) {
      scrollContainerInstance = element;
    }
  };

  useEffect(() => {
    // If there's a global instance, use it
    if (scrollContainerInstance && !containerRef.current) {
      setContainerState(scrollContainerInstance);
    }
  }, []);

  return { container, setContainer };
}

// Helper to get the scroll container from anywhere
export function getScrollContainer(): HTMLElement | null {
  return scrollContainerInstance;
}