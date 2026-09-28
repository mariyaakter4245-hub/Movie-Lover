import React, { useState, useRef, useEffect } from 'react';
import { Search, Film, Bookmark, Send, Shield, Menu, X, Star, ExternalLink } from 'lucide-react';
import { Movie } from '../types';

interface NavbarProps {
  movies: Movie[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onOpenRequests: () => void;
  onOpenBookmarks: () => void;
  onOpenAdmin: () => void;
  bookmarkCount: number;
  telegramUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  movies,
  selectedCategory,
  onSelectCategory,
  onSelectMovie,
  onOpenRequests,
  onOpenBookmarks,
  onOpenAdmin,
  bookmarkCount,
  telegramUrl
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All',
    'South Hindi Dubbed',
    'Bollywood',
    'Hollywood Dual Audio',
    'Bengali Movies',
    'Web Series'
  ];

  // Filter movies for autocomplete
  const searchResults = searchQuery.trim() === '' ? [] : movies.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
    m.cast.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.year.toString().includes(searchQuery)
  ).slice(0, 6);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-[#0e1017]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectCategory('All')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 text-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Film className="h-5 w-5 fill-black stroke-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Cabinet_Grotesk'] text-xl font-extrabold tracking-tight text-white flex items-center">
                MOVIE<span className="text-amber-400">BAAZ</span>
                <span className="ml-1.5 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                  .BABY
                </span>
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500/15 text-amber-400 font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>

        {/* Zone 3: Actions & Search */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Instant Search Bar */}
          <div className="relative" ref={searchRef}>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search movies, series..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-36 sm:w-56 md:w-64 rounded-lg border border-neutral-800 bg-neutral-900/90 py-1.5 pl-8 pr-3 text-xs text-white placeholder-neutral-500 transition-all focus:border-amber-500 focus:w-64 sm:focus:w-72 focus:outline-none"
              />
              <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-neutral-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-neutral-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Autocomplete Results */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border border-neutral-800 bg-[#12141c] p-2 shadow-2xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Search Results ({searchResults.length})
                </div>
                <div className="divide-y divide-neutral-800/60">
                  {searchResults.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectMovie(m);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex w-full items-center gap-3 p-2 text-left rounded-lg hover:bg-neutral-800/80 transition-colors cursor-pointer"
                    >
                      <img
                        src={m.poster}
                        alt={m.title}
                        className="h-11 w-8 rounded object-cover border border-neutral-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-white">{m.title}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                          <span>{m.year}</span>
                          <span>·</span>
                          <span className="text-amber-400 flex items-center">
                            <Star className="h-2.5 w-2.5 fill-amber-400 inline mr-0.5" />
                            {m.rating}
                          </span>
                          <span>·</span>
                          <span className="truncate">{m.quality}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bookmarks Trigger */}
          <button
            onClick={onOpenBookmarks}
            title="My Bookmarks / Watchlist"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-amber-500/50 hover:text-white transition-colors cursor-pointer"
          >
            <Bookmark className="h-4 w-4" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Request Movie Modal Trigger */}
          <button
            onClick={onOpenRequests}
            title="Request a Movie / Series"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/80 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:border-amber-500/40 hover:text-white transition-colors cursor-pointer"
          >
            <Send className="h-3.5 w-3.5 text-amber-400" />
            <span>Request</span>
          </button>

          {/* Telegram Channel Link */}
          {telegramUrl && (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Join Telegram Channel"
              className="hidden md:flex items-center gap-1 rounded-lg bg-sky-600/20 border border-sky-500/40 px-2.5 py-1.5 text-xs font-semibold text-sky-400 hover:bg-sky-600/30 transition-colors"
            >
              <span>Telegram</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          {/* Dedicated Admin Panel Trigger */}
          <button
            onClick={onOpenAdmin}
            title="Open Admin Dashboard"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-700 border border-neutral-600 px-3 py-1.5 text-xs font-semibold text-white hover:from-amber-600 hover:to-amber-500 hover:text-black transition-all shadow-sm cursor-pointer"
          >
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-[#0e1017] px-4 py-3 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Categories</div>
          <div className="grid grid-cols-2 gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-left text-xs rounded-md ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 text-amber-400 font-bold'
                    : 'text-neutral-300 hover:bg-neutral-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenRequests();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-xs text-amber-400"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Request Movie</span>
            </button>
            {telegramUrl && (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 flex items-center gap-1"
              >
                <span>Telegram</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
