import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState([
    'Course Management',
    'Student Records',
    'Grade Reports',
    'Class Schedule',
  ]);
  const [searchFocused, setSearchFocused] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if (e.key === 'Escape' && searchFocused) {
        document.getElementById('search-input')?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchFocused]);

  return (
    <div className="flex-1 max-w-xl relative">
      <div className="relative">
        <input
          id="search-input"
          type="search"
          placeholder="Search..."
          className="input input-bordered w-full pl-10 pr-16 "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => {
            // Small delay to allow clicking on suggestions
            setTimeout(() => setSearchFocused(false), 200);
          }}
        />
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchQuery === '' ? (
            <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] font-medium opacity-60">
              <kbd className="h-5 select-none rounded border bg-base-200 px-1.5">ctrl</kbd>
              <kbd className="h-5 select-none rounded border bg-base-200 px-1.5">K</kbd>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-sm text-base-content/60"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {searchFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-xl shadow-lg border border-base-200 overflow-hidden">
          <div className="p-2">
            {searchQuery ? (
              <div className="space-y-2">
                <div className="text-sm font-medium text-base-content/60 px-2 py-1">
                  Search Results
                </div>
                <button className="flex items-center gap-2 w-full p-2 hover:bg-base-200 rounded-lg">
                  <Search className="w-4 h-4" />
                  <span>Results for `&quot;${searchQuery}&quot;`</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm font-medium text-base-content/60 px-2 py-1">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-2 w-full p-2 hover:bg-base-200 rounded-lg"
                    onClick={() => setSearchQuery(search)}
                  >
                    <Search className="w-4 h-4" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
