import React from 'react';
import { X, Bookmark, Film, Trash2, Play, Download } from 'lucide-react';
import { Movie } from '../types';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onRemoveBookmark: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarkedMovies,
  onSelectMovie,
  onRemoveBookmark,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl border border-neutral-800 bg-[#12141c] p-6 shadow-2xl z-10 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h3 className="font-['Cabinet_Grotesk'] text-base font-bold text-white">
              My Bookmarks & Watchlist ({bookmarkedMovies.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {bookmarkedMovies.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Film className="mx-auto h-10 w-10 text-neutral-600" />
              <p className="text-sm font-semibold text-neutral-300">Your watchlist is empty</p>
              <p className="text-xs text-neutral-500">
                Click the bookmark icon on any movie card to save it for later.
              </p>
            </div>
          ) : (
            bookmarkedMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => {
                  onSelectMovie(movie);
                  onClose();
                }}
                className="flex items-center justify-between rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3 hover:border-neutral-700 hover:bg-neutral-900 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="h-16 w-12 rounded object-cover border border-neutral-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="truncate text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {movie.year} · {movie.category} · {movie.quality}
                    </p>
                    <p className="text-[10px] text-amber-400 font-medium truncate">
                      {movie.audio}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button
                    onClick={(e) => onRemoveBookmark(movie.id, e)}
                    title="Remove from bookmarks"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-800/80 text-neutral-400 hover:bg-red-950/40 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {bookmarkedMovies.length > 0 && (
          <div className="border-t border-neutral-800 pt-3 flex justify-between items-center">
            <button
              onClick={onClearAll}
              className="text-xs text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              Clear all bookmarks
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
