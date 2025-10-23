import { useState, useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAnnouncement } from '@/hooks/useAnnouncement';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  showShortcut?: boolean;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search...',
  className,
  autoFocus = false,
  showShortcut = true
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { announce } = useAnnouncement();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsExpanded(true);
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      announce(`Searching for ${query}`, 'polite');
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
    announce('Search cleared', 'polite');
  };

  return (
    <div className={cn('relative', className)} role="search">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="pl-10 pr-20"
            aria-label="Search"
            aria-describedby={showShortcut ? 'search-shortcut' : undefined}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 w-7 p-0"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
            {showShortcut && !query && (
              <kbd
                id="search-shortcut"
                className="hidden sm:inline-flex h-7 items-center gap-1 rounded border bg-muted px-2 text-xs text-muted-foreground"
                aria-label="Keyboard shortcut: Command K or Control K"
              >
                <Command className="h-3 w-3" aria-hidden="true" />K
              </kbd>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

interface SearchResultsProps {
  results: any[];
  query: string;
  isLoading?: boolean;
  className?: string;
  renderResult?: (result: any, index: number) => React.ReactNode;
}

export function SearchResults({
  results,
  query,
  isLoading = false,
  className,
  renderResult
}: SearchResultsProps) {
  const { announce } = useAnnouncement();

  useEffect(() => {
    if (!isLoading && results) {
      const count = results.length;
      if (count === 0) {
        announce(`No results found for ${query}`, 'polite');
      } else {
        announce(`Found ${count} result${count !== 1 ? 's' : ''} for ${query}`, 'polite');
      }
    }
  }, [results, isLoading, query, announce]);

  return (
    <div
      className={cn('space-y-2', className)}
      role="region"
      aria-live="polite"
      aria-label="Search results"
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Searching...
        </p>
      ) : results.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No results found for "{query}"
        </p>
      ) : (
        <>
          <p className="sr-only">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
          <div className="space-y-2">
            {results.map((result, index) =>
              renderResult ? (
                renderResult(result, index)
              ) : (
                <div key={index} className="p-3 border rounded-lg hover:bg-accent">
                  {JSON.stringify(result)}
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
