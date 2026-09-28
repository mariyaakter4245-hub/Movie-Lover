import React, { useState } from 'react';
import { X, Send, Film, CheckCircle2 } from 'lucide-react';
import { submitMovieRequest } from '../services/api';

interface RequestMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const RequestMovieModal: React.FC<RequestMovieModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast
}) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [preferredQuality, setPreferredQuality] = useState('1080p FHD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await submitMovieRequest({
        movieTitle: movieTitle.trim(),
        requestedBy: requestedBy.trim() || 'Anonymous User',
        preferredQuality
      });
      setIsSuccess(true);
      onSuccessToast(`Request for "${movieTitle}" submitted successfully!`);
      setTimeout(() => {
        setIsSuccess(false);
        setMovieTitle('');
        setRequestedBy('');
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-[#12141c] p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-amber-500" />
            <h3 className="font-['Cabinet_Grotesk'] text-base font-bold text-white">
              Request a Movie or Web Series
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 animate-bounce" />
            <h4 className="text-sm font-bold text-white">Request Received!</h4>
            <p className="text-xs text-neutral-400">
              Our team will upload and index it to MovieBaaz shortly. Check back soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-xs text-neutral-400">
              Can't find your desired South Hindi Dubbed, Bollywood, or Hollywood Dual Audio movie? Request it here!
            </p>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Movie / Series Title & Release Year *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Singham Again (2024), Kantara 2..."
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Preferred Resolution / Quality
              </label>
              <select
                value={preferredQuality}
                onChange={(e) => setPreferredQuality(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="1080p FHD">1080p Full HD (Recommended)</option>
                <option value="720p HD">720p HD</option>
                <option value="480p SD">480p SD (Compact 300MB)</option>
                <option value="4K UHD HDR">4K Ultra HD HDR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Your Email or Telegram Username (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. @your_telegram or your email"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !movieTitle.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
