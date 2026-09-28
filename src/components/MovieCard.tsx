import React from 'react';
import { Star, Download, Play, Bookmark, Volume2 } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isBookmarked: boolean;
  onSelect: (movie: Movie) => void;
  onWatchOnline: (movie: Movie) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isBookmarked,
  onSelect,
  onWatchOnline,
  onToggleBookmark
}) => {
  return (
    <div
      onClick={() => onSelect(movie)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800/80 bg-[#12141c] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-xl cursor-pointer"
    >
      {/* Poster Media Box with 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
        <img
          src={movie.poster}
          alt={movie.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/poster_historical_epic.jpg';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {/* Quality Badge */}
          <span className="rounded bg-red-600/90 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-xs shadow">
            {movie.duration?.includes('Episode') ? 'Series' : 'Movie'}
          </span>

          {/* Rating Badge */}
          <span className="flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-xs border border-neutral-700">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            {movie.rating}
          </span>
        </div>

        {/* Bookmark Action Button */}
        <button
          onClick={(e) => onToggleBookmark(movie.id, e)}
          title={isBookmarked ? 'Remove from Bookmarks' : 'Bookmark this Movie'}
          className={`absolute bottom-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-xs transition-transform active:scale-90 cursor-pointer ${
            isBookmarked
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-black/60 text-white hover:bg-neutral-800'
          }`}
        >
          <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-black' : ''}`} />
        </button>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchOnline(movie);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black shadow hover:bg-amber-400 transition-colors"
          >
            <Play className="h-3 w-3 fill-black" />
            <span>Watch Online</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(movie);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-600 bg-neutral-900/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
          >
            <Download className="h-3 w-3 text-amber-400" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Card Body & Metadata */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 font-semibold text-xs text-white group-hover:text-red-400 transition-colors leading-snug">
          {movie.title}
        </h3>

        {/* Audio Info */}
        <div className="mt-1 flex items-center gap-1 text-[11px] text-neutral-400">
          <Volume2 className="h-3 w-3 shrink-0 text-amber-500/80" />
          <span className="truncate">{movie.audio}</span>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-auto pt-2 flex items-center justify-between text-[10px] text-neutral-500">
          <span>{movie.year}</span>
          <span>·</span>
          <span className="truncate max-w-[80px]">{movie.category}</span>
          <span>·</span>
          <span>{movie.fileSize ? movie.fileSize.split('/')[0].trim() : 'HD'}</span>
        </div>
      </div>
    </div>
  );
};
