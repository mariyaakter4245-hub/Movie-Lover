import React, { useState, useMemo } from 'react';
import { Movie, AdsConfig } from '../types';
import { MovieCard } from './MovieCard';
import { AdBanner } from './AdBanner';
import { SlidersHorizontal, Film, ArrowUpDown } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onWatchOnline: (movie: Movie) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  adsConfig: AdsConfig | null;
  isAdminView?: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  selectedCategory,
  onSelectCategory,
  onSelectMovie,
  onWatchOnline,
  bookmarkedIds,
  onToggleBookmark,
  adsConfig,
  isAdminView = false
}) => {
  const [selectedQuality, setSelectedQuality] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortBy, setSortBy] = useState<'latest' | 'rating' | 'title'>('latest');

  const categories = [
    'All',
    'Movies',
    'Drama',
    'Kolkata Bangla',
    'Hindi Dubbed',
    'Dual & Multi Audio',
    'Bangladeshi',
    'Hollywood Movies'
  ];

  const qualities = ['All', '1080p', '720p', '480p', '4K'];
  const years = ['All', '2025', '2024', '2023', '2022'];

  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        // Category filter
        if (selectedCategory !== 'All' && movie.category !== selectedCategory) {
          return false;
        }
        // Quality filter
        if (selectedQuality !== 'All') {
          if (!movie.quality.toLowerCase().includes(selectedQuality.toLowerCase())) {
            return false;
          }
        }
        // Year filter
        if (selectedYear !== 'All') {
          if (movie.year.toString() !== selectedYear) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        // default latest
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      });
  }, [movies, selectedCategory, selectedQuality, selectedYear, sortBy]);

  const infeedSlot = adsConfig?.slots?.infeed_grid;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Category Pills & Quick Filter Controls */}
      <div className="flex flex-col gap-4 border-b border-neutral-800/80 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Section Heading */}
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-amber-500" />
            <h2 className="font-['Cabinet_Grotesk'] text-xl font-bold text-white tracking-tight">
              {selectedCategory === 'All' ? 'Latest Movies & Web Series' : selectedCategory}
            </h2>
            <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
              {filteredMovies.length}
            </span>
          </div>

          {/* Filters and Sorters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Quality Filter */}
            <div className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-neutral-300">
              <SlidersHorizontal className="h-3 w-3 text-neutral-500" />
              <span className="text-neutral-500">Quality:</span>
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="bg-transparent font-medium text-white focus:outline-none cursor-pointer"
              >
                {qualities.map((q) => (
                  <option key={q} value={q} className="bg-neutral-900 text-white">
                    {q}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-neutral-300">
              <span className="text-neutral-500">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent font-medium text-white focus:outline-none cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y} className="bg-neutral-900 text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-neutral-300">
              <ArrowUpDown className="h-3 w-3 text-neutral-500" />
              <span className="text-neutral-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium text-white focus:outline-none cursor-pointer"
              >
                <option value="latest" className="bg-neutral-900 text-white">Latest Added</option>
                <option value="rating" className="bg-neutral-900 text-white">Highest Rated</option>
                <option value="title" className="bg-neutral-900 text-white">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <div className="my-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 py-12 text-center">
          <Film className="h-10 w-10 text-neutral-600 mb-3" />
          <h3 className="text-sm font-semibold text-neutral-300">No movies found</h3>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm">
            Try adjusting your search criteria, category or quality filter.
          </p>
          <button
            onClick={() => {
              onSelectCategory('All');
              setSelectedQuality('All');
              setSelectedYear('All');
            }}
            className="mt-4 rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
          {filteredMovies.map((movie, index) => {
            // Render the movie card
            const cardElement = (
              <MovieCard
                key={movie.id}
                movie={movie}
                isBookmarked={bookmarkedIds.includes(movie.id)}
                onSelect={onSelectMovie}
                onWatchOnline={onWatchOnline}
                onToggleBookmark={onToggleBookmark}
              />
            );

            // Insert in-feed ad after every 6th card (public site only, never in admin view!)
            const shouldShowInfeedAd =
              !isAdminView &&
              adsConfig?.masterAdsEnabled &&
              infeedSlot?.enabled &&
              (index + 1) % 6 === 0;

            if (shouldShowInfeedAd) {
              return (
                <React.Fragment key={`group-${movie.id}`}>
                  {cardElement}
                  <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-4 xl:col-span-5 my-2">
                    <AdBanner
                      slot={infeedSlot}
                      masterEnabled={adsConfig.masterAdsEnabled}
                      isAdminView={isAdminView}
                    />
                  </div>
                </React.Fragment>
              );
            }

            return cardElement;
          })}
        </div>
      )}
    </section>
  );
};
