type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageShell({ children, className = '' }: PageShellProps) {
  return <div className={`min-h-screen bg-white ${className}`.trim()}>{children}</div>;
}
