import React, { useState, useEffect } from 'react';
import { Movie, AdsConfig, SiteSettings } from './types';
import { INITIAL_MOVIES, INITIAL_ADS, INITIAL_SETTINGS } from './data/defaultData';
import {
  getMovies, getAdsConfig, getSiteSettings,
  getStoredBookmarks, toggleStoredBookmark
} from './services/api';
import { Navbar } from './components/Navbar';
import { NoticeTicker } from './components/NoticeTicker';
import { HeroFeatured } from './components/HeroFeatured';
import { MovieGrid } from './components/MovieGrid';
import { MovieDetailModal } from './components/MovieDetailModal';
import { RequestMovieModal } from './components/RequestMovieModal';
import { BookmarksModal } from './components/BookmarksModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdBanner } from './components/AdBanner';
import { Film, Shield, Send, ExternalLink, Heart } from 'lucide-react';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [adsConfig, setAdsConfig] = useState<AdsConfig>(INITIAL_ADS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Modals & Panels
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [detailModalTab, setDetailModalTab] = useState<'details' | 'player' | 'download'>('details');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isBookmarksModalOpen, setIsBookmarksModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isFooterAdDismissed, setIsFooterAdDismissed] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Data Load
  const loadAllData = async () => {
    try {
      const [moviesData, adsData, settingsData] = await Promise.all([
        getMovies(),
        getAdsConfig(),
        getSiteSettings()
      ]);
      if (moviesData) setMovies(moviesData);
      if (adsData) setAdsConfig(adsData);
      if (settingsData) setSettings(settingsData);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  useEffect(() => {
    loadAllData();
    setBookmarkedIds(getStoredBookmarks());

    // Check URL parameters for direct movie view: ?movie=id
    const params = new URLSearchParams(window.location.search);
    const movieParam = params.get('movie');
    if (movieParam) {
      getMovies().then((list) => {
        const found = list.find((m) => m.id === movieParam);
        if (found) setSelectedMovie(found);
      });
    }
  }, []);

  // Handle Bookmarks
  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleStoredBookmark(id);
    setBookmarkedIds(updated);
    const isNowBookmarked = updated.includes(id);
    showToast(isNowBookmarked ? 'Movie added to bookmarks' : 'Movie removed from bookmarks');
  };

  const handleClearAllBookmarks = () => {
    localStorage.removeItem('moviebaaz_bookmarks');
    setBookmarkedIds([]);
    showToast('Bookmarks cleared');
  };

  const bookmarkedMovies = movies.filter((m) => bookmarkedIds.includes(m.id));
  const featuredMovies = movies.filter((m) => m.isFeatured);

  // Admin access control
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // If Admin view is active, render ADMIN PANEL ONLY (NO ADS SHOWN EVER)
  if (isAdminOpen && adsConfig && settings) {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black shadow-2xl animate-fade-in flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        )}
        <AdminPanel
          movies={movies}
          adsConfig={adsConfig}
          settings={settings}
          onRefreshMovies={async () => {
            const data = await getMovies();
            setMovies(data);
          }}
          onRefreshAds={async () => {
            const data = await getAdsConfig();
            if (data) setAdsConfig(data);
          }}
          onRefreshSettings={async () => {
            const data = await getSiteSettings();
            if (data) setSettings(data);
          }}
          onCloseAdmin={() => setIsAdminOpen(false)}
          onShowToast={showToast}
        />
      </>
    );
  }

  // PUBLIC SITE (MovieBaaz)
  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black shadow-2xl flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        movies={movies}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onSelectMovie={(movie) => {
          setSelectedMovie(movie);
          setDetailModalTab('details');
        }}
        onOpenRequests={() => setIsRequestModalOpen(true)}
        onOpenBookmarks={() => setIsBookmarksModalOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        bookmarkCount={bookmarkedIds.length}
        telegramUrl={settings?.telegramChannel || 'https://t.me/moviebaaz_official'}
      />

      {/* Notice / Announcement Ticker */}
      <NoticeTicker
        noticeText={settings?.noticeText || ''}
        telegramUrl={settings?.telegramChannel || ''}
        enabled={settings?.noticeEnabled ?? true}
      />

      {/* Header Banner Ad Slot (Public view only) */}
      {adsConfig?.masterAdsEnabled && adsConfig?.slots?.header_banner?.enabled && (
        <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8">
          <AdBanner
            slot={adsConfig.slots.header_banner}
            masterEnabled={adsConfig.masterAdsEnabled}
            isAdminView={false}
          />
        </div>
      )}

      {/* Hero Featured Blockbuster */}
      {selectedCategory === 'All' && featuredMovies.length > 0 && (
        <HeroFeatured
          featuredMovies={featuredMovies}
          onSelectMovie={(movie) => {
            setSelectedMovie(movie);
            setDetailModalTab('details');
          }}
          onWatchOnline={(movie) => {
            setSelectedMovie(movie);
            setDetailModalTab('player');
          }}
        />
      )}

      {/* Main Movie Catalog Grid with In-Feed Ads */}
      <main className="flex-1">
        <MovieGrid
          movies={movies}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onSelectMovie={(movie) => {
            setSelectedMovie(movie);
            setDetailModalTab('details');
          }}
          onWatchOnline={(movie) => {
            setSelectedMovie(movie);
            setDetailModalTab('player');
          }}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
          adsConfig={adsConfig}
          isAdminView={false}
        />
      </main>

      {/* Floating Bottom / Sticky Footer Ad (if enabled) */}
      {adsConfig?.masterAdsEnabled &&
        adsConfig?.slots?.floating_footer?.enabled &&
        !isFooterAdDismissed && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 shadow-2xl border-t border-neutral-800">
            <div className="mx-auto max-w-4xl px-4 py-1">
              <AdBanner
                slot={adsConfig.slots.floating_footer}
                masterEnabled={adsConfig.masterAdsEnabled}
                isAdminView={false}
                onDismiss={() => setIsFooterAdDismissed(true)}
              />
            </div>
          </div>
        )}

      {/* Public Footer */}
      <footer className="mt-16 border-t border-neutral-800/80 bg-[#090a0f] text-neutral-400">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Brand column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 text-black font-black">
                  <Film className="h-4 w-4 fill-black stroke-black" />
                </div>
                <span className="font-['Cabinet_Grotesk'] text-xl font-extrabold text-white">
                  MOVIE<span className="text-amber-400">BAAZ</span>
                </span>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                {settings?.siteTagline ||
                  'The fastest destination to watch and download HD Bollywood, South Hindi Dubbed, Hollywood Dual Audio, Bengali Movies, and Web Series free.'}
              </p>
              <div className="flex items-center gap-2 pt-1">
                {settings?.telegramChannel && (
                  <a
                    href={settings.telegramChannel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600/20 border border-sky-500/40 px-3 py-1.5 text-xs font-semibold text-sky-400 hover:bg-sky-600/30 transition-colors"
                  >
                    <span>Join Official Telegram</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <button
                  onClick={handleOpenAdmin}
                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800/60 px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  <Shield className="h-3 w-3" />
                  <span>Admin Panel</span>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Popular Categories
              </h4>
              <ul className="text-xs space-y-1.5 text-neutral-400">
                {['South Hindi Dubbed', 'Bollywood', 'Hollywood Dual Audio', 'Bengali Movies', 'Web Series'].map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* DMCA & Disclaimer */}
            <div className="md:col-span-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Disclaimer & DMCA Notice
              </h4>
              <p className="text-[11px] leading-relaxed text-neutral-500">
                MovieBaaz.baby is an index and database for media content links hosted on non-affiliated 3rd-party services (such as Google Drive, HubCloud, Mega). We do not host or upload any media files on our own server. For copyright or DMCA concerns, please report directly to the respective file hosting providers.
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-800/60 pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
            <p>© 2025–2026 {settings?.siteName || 'MovieBaaz'}. All rights reserved.</p>
            <p className="flex items-center gap-1 text-[11px]">
              Built with precision for seamless streaming & downloads
            </p>
          </div>
        </div>
      </footer>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isBookmarked={bookmarkedIds.includes(selectedMovie.id)}
          onToggleBookmark={handleToggleBookmark}
          adsConfig={adsConfig}
          isAdminView={false}
          initialTab={detailModalTab}
        />
      )}

      {/* Request Movie Modal */}
      <RequestMovieModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccessToast={showToast}
      />

      {/* Bookmarks / Watchlist Modal */}
      <BookmarksModal
        isOpen={isBookmarksModalOpen}
        onClose={() => setIsBookmarksModalOpen(false)}
        bookmarkedMovies={bookmarkedMovies}
        onSelectMovie={(movie) => {
          setSelectedMovie(movie);
          setDetailModalTab('details');
        }}
        onRemoveBookmark={(id, e) => handleToggleBookmark(id, e)}
        onClearAll={handleClearAllBookmarks}
      />

      {/* Admin Login PIN Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsAdminOpen(true);
          showToast('Welcome to MovieBaaz Admin Panel');
        }}
        correctPin={settings?.adminPin || 'admin123'}
      />
    </div>
  );
}
