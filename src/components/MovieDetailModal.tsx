import React, { useState, useEffect } from 'react';
import {
  X, Star, Download, Play, Bookmark, Volume2, Film,
  Share2, Check, Sparkles, Server, Clock, AlertCircle, ExternalLink
} from 'lucide-react';
import { Movie, AdsConfig, DownloadServer } from '../types';
import { AdBanner } from './AdBanner';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  adsConfig: AdsConfig | null;
  isAdminView?: boolean;
  initialTab?: 'details' | 'player' | 'download';
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  isBookmarked,
  onToggleBookmark,
  adsConfig,
  isAdminView = false,
  initialTab = 'details'
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'player' | 'download'>(initialTab);
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  const [downloadProgressServer, setDownloadProgressServer] = useState<DownloadServer | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [movie]);

  // Countdown timer for authentic fast download link generation
  useEffect(() => {
    let timer: any;
    if (downloadProgressServer && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (downloadProgressServer && countdown === 0) {
      // Open or trigger download
      window.open(downloadProgressServer.url, '_blank');
      setDownloadProgressServer(null);
    }
    return () => clearTimeout(timer);
  }, [downloadProgressServer, countdown]);

  if (!movie) return null;

  const handleStartDownload = (server: DownloadServer) => {
    setDownloadProgressServer(server);
    setCountdown(3); // 3-second authentic countdown
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '?movie=' + movie.id);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-neutral-800 bg-[#0e1017] shadow-2xl z-10 my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header Bar with Close */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-800/80 bg-[#0e1017]/95 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 truncate">
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-400">
              {movie.category}
            </span>
            <h2 className="truncate text-sm sm:text-base font-bold text-white">
              {movie.title} ({movie.year})
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              title="Share movie link"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            </button>
            <button
              onClick={(e) => onToggleBookmark(movie.id, e)}
              title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Banner Ad slot (public only, NEVER in admin!) */}
          {!isAdminView && adsConfig?.slots?.detail_top && (
            <AdBanner
              slot={adsConfig.slots.detail_top}
              masterEnabled={adsConfig.masterAdsEnabled}
              isAdminView={isAdminView}
            />
          )}

          {/* Backdrop + Core Info Hero Section */}
          <div className="relative overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-4 sm:p-6">
            <div className="absolute inset-0 opacity-15">
              <img
                src={movie.backdrop || movie.poster}
                alt={movie.title}
                className="h-full w-full object-cover blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-[#0e1017]/80 to-transparent" />
            </div>

            <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-start">
              {/* Poster Column */}
              <div className="sm:col-span-4 flex flex-col items-center">
                <div className="relative aspect-[3/4] w-48 sm:w-full overflow-hidden rounded-xl border border-neutral-700 shadow-2xl">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded bg-black/80 px-2 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                    {movie.quality}
                  </div>
                </div>

                {/* Quick actions under poster */}
                <div className="mt-3 flex w-full gap-2">
                  <button
                    onClick={() => setActiveTab('player')}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-black" />
                    <span>Watch</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('download');
                      document.getElementById('download-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 py-2 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-amber-400" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Details Column */}
              <div className="sm:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                  <span className="flex items-center text-amber-400 font-bold">
                    <Star className="mr-1 h-3.5 w-3.5 fill-amber-400 inline" />
                    {movie.rating} / 10 IMDb
                  </span>
                  <span>·</span>
                  <span>{movie.year}</span>
                  <span>·</span>
                  <span>{movie.duration}</span>
                  <span>·</span>
                  <span className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300">
                    {movie.quality}
                  </span>
                </div>

                <h1 className="font-['Cabinet_Grotesk'] text-2xl sm:text-3xl font-black text-white">
                  {movie.title}
                </h1>

                {/* Genre badges */}
                <div className="flex flex-wrap gap-1.5">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="rounded-md border border-neutral-800 bg-neutral-900/90 px-2 py-0.5 text-[11px] text-neutral-300"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* Technical Specs Box */}
                <div className="rounded-lg border border-neutral-800 bg-[#090a0f] p-3 text-xs space-y-1.5 text-neutral-300">
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 font-semibold w-24 shrink-0">Audio Tracks:</span>
                    <span className="text-amber-300 font-medium flex items-center gap-1">
                      <Volume2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      {movie.audio}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 font-semibold w-24 shrink-0">Subtitles:</span>
                    <span className="text-neutral-300">{movie.subtitles || 'English [ESubs]'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 font-semibold w-24 shrink-0">Director:</span>
                    <span className="text-neutral-300">{movie.director}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 font-semibold w-24 shrink-0">Starring Cast:</span>
                    <span className="text-neutral-300 line-clamp-1">{movie.cast}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 font-semibold w-24 shrink-0">Available Sizes:</span>
                    <span className="text-emerald-400 font-medium">{movie.fileSize}</span>
                  </div>
                </div>

                {/* Storyline Synopsis */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Synopsis / Storyline
                  </h4>
                  <p className="text-xs leading-relaxed text-neutral-300">
                    {movie.storyline}
                  </p>
                </div>

                {/* Trailer Preview Button */}
                {movie.trailerUrl && (
                  <button
                    onClick={() => setShowTrailer(!showTrailer)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:border-amber-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <Film className="h-3.5 w-3.5 text-amber-400" />
                    <span>{showTrailer ? 'Hide Official Trailer' : 'Watch Official Trailer'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Optional Trailer View */}
          {showTrailer && movie.trailerUrl && (
            <div className="overflow-hidden rounded-xl border border-neutral-800 bg-black p-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  src={movie.trailerUrl}
                  title={`${movie.title} Trailer`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Per-Movie Custom Ad (Above Player) */}
          {!isAdminView && movie.movieAdEnabled && (movie.movieAdPosition === 'above_player' || movie.movieAdPosition === 'both') && (
            <div className="overflow-hidden rounded-xl border border-amber-500/30 bg-[#141620] p-3 text-center shadow-lg">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1.5">
                Sponsored / Movie Special Offer
              </span>
              {movie.movieAdType === 'banner' && movie.movieAdBannerUrl ? (
                <a href={movie.movieAdTargetUrl || '#'} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg">
                  <img src={movie.movieAdBannerUrl} alt="Movie Sponsor" className="w-full max-h-32 object-contain mx-auto" />
                </a>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: movie.movieAdScript || '' }} />
              )}
            </div>
          )}

          {/* Interactive Player Section */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-amber-500" />
                <h3 className="font-['Cabinet_Grotesk'] text-base font-bold text-white">
                  Watch Online Player (Multi-Server)
                </h3>
              </div>

              {/* Server Switcher */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-neutral-500 mr-1 hidden sm:inline">Select Server:</span>
                {movie.streamServers && movie.streamServers.length > 0 ? (
                  movie.streamServers.map((srv, idx) => (
                    <button
                      key={srv.name}
                      onClick={() => setActiveServerIndex(idx)}
                      className={`rounded px-2.5 py-1 font-semibold transition-colors cursor-pointer ${
                        activeServerIndex === idx
                          ? 'bg-amber-500 text-black'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {srv.name}
                    </button>
                  ))
                ) : (
                  <span className="rounded bg-neutral-800 px-2.5 py-1 text-neutral-400">Server 1 (Default)</span>
                )}
              </div>
            </div>

            {/* Video Player Frame */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black border border-neutral-800 shadow-inner">
              <video
                key={movie.streamServers?.[activeServerIndex]?.url || movie.id}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-contain"
                poster={movie.backdrop || movie.poster}
              >
                <source
                  src={
                    movie.streamServers?.[activeServerIndex]?.url ||
                    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                  }
                  type="video/mp4"
                />
                Your browser does not support HTML5 video player.
              </video>
            </div>
            <p className="text-[11px] text-neutral-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
              <span>
                Tip: If video buffers, switch to Server 2 or download using the high-speed direct links below.
              </span>
            </p>
          </div>

          {/* High-Conversion Pre-Download Ad slot (public only, NEVER in admin!) */}
          {!isAdminView && adsConfig?.slots?.detail_download_pre && (
            <div id="download-section">
              <AdBanner
                slot={adsConfig.slots.detail_download_pre}
                masterEnabled={adsConfig.masterAdsEnabled}
                isAdminView={isAdminView}
              />
            </div>
          )}

          {/* Per-Movie Custom Ad (Above Download) */}
          {!isAdminView && movie.movieAdEnabled && (movie.movieAdPosition === 'above_download' || movie.movieAdPosition === 'both') && (
            <div className="overflow-hidden rounded-xl border border-amber-500/30 bg-[#141620] p-3 text-center shadow-lg">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1.5">
                ⚡ Direct High Speed Sponsor for this Movie
              </span>
              {movie.movieAdType === 'banner' && movie.movieAdBannerUrl ? (
                <a href={movie.movieAdTargetUrl || '#'} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg">
                  <img src={movie.movieAdBannerUrl} alt="Movie Sponsor" className="w-full max-h-32 object-contain mx-auto" />
                </a>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: movie.movieAdScript || '' }} />
              )}
            </div>
          )}

          {/* Authentic Download Section with Tiers */}
          <div className="rounded-xl border border-amber-900/40 bg-gradient-to-b from-[#13151f] to-[#0d0f14] p-4 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Download className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-['Cabinet_Grotesk'] text-base font-bold text-white">
                    Direct High Speed Download Links
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Choose your desired resolution. Fast Google Drive & Direct CDN servers available.
                  </p>
                </div>
              </div>
            </div>

            {/* Countdown Banner if a link was clicked */}
            {downloadProgressServer && (
              <div className="rounded-xl border border-amber-500/50 bg-amber-950/40 p-4 text-center space-y-2 animate-pulse">
                <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Connecting to {downloadProgressServer.name}...</span>
                </div>
                <p className="text-xs text-neutral-300">
                  Your secure direct download is starting in <span className="font-mono text-base font-bold text-amber-400">{countdown}</span> seconds...
                </p>
                <div className="mx-auto max-w-xs h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-1000"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Download Tiers Cards */}
            <div className="grid grid-cols-1 gap-4">
              {movie.downloadLinks && movie.downloadLinks.length > 0 ? (
                movie.downloadLinks.map((tier) => (
                  <div
                    key={tier.quality}
                    className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 transition-colors hover:border-neutral-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
                          {tier.quality}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {tier.resolution}
                        </span>
                      </div>
                      <span className="rounded bg-neutral-800 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                        File Size: {tier.size}
                      </span>
                    </div>

                    {/* Servers list for this quality */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {tier.servers.map((server) => (
                        <button
                          key={server.name}
                          onClick={() => handleStartDownload(server)}
                          className="flex items-center justify-between rounded-lg border border-neutral-700 bg-neutral-800/90 px-3 py-2 text-xs font-semibold text-white hover:border-amber-500 hover:bg-neutral-700 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Server className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            <span className="truncate group-hover:text-amber-300">{server.name}</span>
                          </div>
                          <ExternalLink className="h-3 w-3 text-neutral-500 group-hover:text-amber-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-neutral-500">
                  No download links attached yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
