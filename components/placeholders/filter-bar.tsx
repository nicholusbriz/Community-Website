import { Filter, Search } from 'lucide-react';

type FilterBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters?: React.ReactNode;
};

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
}: FilterBarProps) {
  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20"
            />
          </div>

          {filters ? (
            <div className="flex flex-wrap gap-3">
              {filters}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
