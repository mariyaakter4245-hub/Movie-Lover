import React, { useState } from 'react';
import { Play, Download, Star, Film, Volume2, Info } from 'lucide-react';
import { Movie } from '../types';

interface HeroFeaturedProps {
  featuredMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onWatchOnline: (movie: Movie) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  featuredMovies,
  onSelectMovie,
  onWatchOnline
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!featuredMovies || featuredMovies.length === 0) return null;

  const current = featuredMovies[currentIndex] || featuredMovies[0];

  return (
    <section className="relative overflow-hidden border-b border-neutral-800 bg-[#090a0f]">
      {/* Background Backdrop with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={current.backdrop || current.poster}
          alt={current.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-30 filter blur-xs sm:blur-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          {/* Main details text */}
          <div className="lg:col-span-8 space-y-4">
            {/* Editorial Kicker & Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
              <span className="rounded bg-amber-500/20 px-2 py-0.5 font-bold text-amber-400">
                FEATURED BLOCKBUSTER
              </span>
              <span>·</span>
              <span className="text-white font-medium">{current.category}</span>
              <span>·</span>
              <span>{current.year}</span>
              <span>·</span>
              <span className="flex items-center text-amber-400 font-bold">
                <Star className="mr-1 h-3.5 w-3.5 fill-amber-400 inline" />
                {current.rating} IMDb
              </span>
              <span>·</span>
              <span>{current.duration}</span>
            </div>

            {/* Movie Title */}
            <h1 className="font-['Cabinet_Grotesk'] text-3xl font-black tracking-tight text-white sm:text-5xl drop-shadow-md">
              {current.title}
            </h1>

            {/* Audio Info & Quality Specs */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300">
              <span className="flex items-center gap-1 rounded border border-neutral-700 bg-neutral-900/80 px-2.5 py-1">
                <Volume2 className="h-3 w-3 text-amber-400" />
                <span>{current.audio}</span>
              </span>
              <span className="rounded border border-neutral-700 bg-neutral-900/80 px-2.5 py-1 font-semibold text-emerald-400">
                {current.quality}
              </span>
              <span className="text-neutral-400">Size: {current.fileSize}</span>
            </div>

            {/* Storyline summary */}
            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-neutral-300 line-clamp-3">
              {current.storyline}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onWatchOnline(current)}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-black shadow-lg shadow-amber-500/25 hover:bg-amber-400 transition-transform active:scale-95 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-black" />
                <span>Watch Online</span>
              </button>

              <button
                onClick={() => onSelectMovie(current)}
                className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/90 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-700 hover:border-neutral-500 transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4 text-amber-400" />
                <span>Download Links</span>
              </button>

              <button
                onClick={() => onSelectMovie(current)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <Info className="h-4 w-4" />
                <span>Full Details</span>
              </button>
            </div>
          </div>

          {/* Right side poster display */}
          <div className="hidden lg:col-span-4 lg:flex justify-end">
            <div
              onClick={() => onSelectMovie(current)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-neutral-700/80 shadow-2xl transition-transform hover:scale-102"
            >
              <img
                src={current.poster}
                alt={current.title}
                referrerPolicy="no-referrer"
                className="h-80 w-56 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Film className="h-3.5 w-3.5" />
                  View Movie Info
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel indicators */}
        {featuredMovies.length > 1 && (
          <div className="mt-6 flex items-center gap-2">
            {featuredMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
