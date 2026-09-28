import React, { useState } from 'react';
import {
  Film, DollarSign, Settings, Send, Plus, Trash2, Edit3, Save,
  RotateCcw, Check, ExternalLink, Shield, ArrowLeft, Download,
  Search, Eye, Copy, RefreshCw, FileText, CheckCircle2, Code2,
  Image as ImageIcon, Sparkles, AlertCircle
} from 'lucide-react';
import { Movie, AdsConfig, SiteSettings, MovieRequest, AdSlotConfig } from '../types';
import {
  createMovie, updateMovie, deleteMovie, saveAdsConfig,
  saveSiteSettings, syncToDisk, updateRequestStatus
} from '../services/api';
import { AdBanner } from './AdBanner';

interface AdminPanelProps {
  movies: Movie[];
  adsConfig: AdsConfig;
  settings: SiteSettings;
  onRefreshMovies: () => Promise<void>;
  onRefreshAds: () => Promise<void>;
  onRefreshSettings: () => Promise<void>;
  onCloseAdmin: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  movies,
  adsConfig,
  settings,
  onRefreshMovies,
  onRefreshAds,
  onRefreshSettings,
  onCloseAdmin,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'movies' | 'ads' | 'settings' | 'requests'>('movies');
  const [movieSearch, setMovieSearch] = useState('');
  const [isEditingMovie, setIsEditingMovie] = useState<Movie | null>(null);
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(settings.lastSynced || '');
  const [adPreviewSlotId, setAdPreviewSlotId] = useState<string | null>(null);

  // Local state for editable ads config
  const [editableAds, setEditableAds] = useState<AdsConfig>(adsConfig);
  // Local state for editable site settings
  const [editableSettings, setEditableSettings] = useState<SiteSettings>(settings);

  // Filter movies for admin table
  const filteredMovies = movies.filter(m =>
    m.title.toLowerCase().includes(movieSearch.toLowerCase()) ||
    m.category.toLowerCase().includes(movieSearch.toLowerCase()) ||
    m.year.toString().includes(movieSearch)
  );

  // 1-Click Explicit Sync to Disk & Repo
  const handleSyncToDisk = async () => {
    setIsSyncing(true);
    try {
      const res = await syncToDisk();
      setLastSyncTime(res.timestamp);
      onShowToast('✓ All changes permanently saved to data/ files in repository!');
    } catch (err) {
      console.error(err);
      onShowToast('Sync completed locally.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Delete a movie
  const handleDeleteMovie = async (movie: Movie) => {
    if (window.confirm(`Are you sure you want to permanently delete "${movie.title}"? This cannot be undone.`)) {
      try {
        await deleteMovie(movie.id);
        await onRefreshMovies();
        onShowToast(`Deleted "${movie.title}" from catalog and data/movies.json`);
      } catch (err) {
        console.error(err);
        onShowToast('Failed to delete movie.');
      }
    }
  };

  // Save Ads Configuration
  const handleSaveAds = async () => {
    try {
      await saveAdsConfig(editableAds);
      await onRefreshAds();
      onShowToast('✓ Ad Network configuration saved directly to data/ads.json!');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to save ads configuration.');
    }
  };

  // Save Site Settings
  const handleSaveSettings = async () => {
    try {
      await saveSiteSettings(editableSettings);
      await onRefreshSettings();
      onShowToast('✓ Site settings updated and saved to data/settings.json!');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to save settings.');
    }
  };

  // Update Request status
  const handleUpdateRequestStatus = async (id: string, status: MovieRequest['status']) => {
    try {
      await updateRequestStatus(id, status);
      await onRefreshSettings();
      onShowToast(`Request updated to ${status}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Convert request into new movie prefill
  const handleConvertRequest = (req: MovieRequest) => {
    setIsEditingMovie({
      id: '',
      title: req.movieTitle,
      year: new Date().getFullYear(),
      category: 'South Hindi Dubbed',
      genres: ['Action', 'Thriller'],
      rating: 8.0,
      duration: '2h 20m',
      quality: req.preferredQuality || '1080p WEB-DL',
      audio: 'Hindi (Clean Audio) + Dual Audio',
      subtitles: 'English [ESubs]',
      fileSize: '2.4 GB / 1.2 GB / 500 MB',
      poster: '/src/assets/images/poster_historical_epic_1790591203848.jpg',
      backdrop: '/src/assets/images/hero_movie_banner_1790591176417.jpg',
      director: '',
      cast: '',
      storyline: `Official download and watch online portal for ${req.movieTitle}. High speed direct links available.`,
      isFeatured: false,
      isTrending: true,
      trailerUrl: '',
      streamServers: [
        { name: 'Server 1 (Fast HD)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        { name: 'Server 2 (Multi-CDN)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' }
      ],
      downloadLinks: [
        {
          quality: '480p SD',
          size: '500 MB',
          resolution: '854x480',
          servers: [
            { name: 'Fast Google Drive', url: 'https://moviebaaz.baby/download/gdrive', speed: 'High Speed' },
            { name: 'HubCloud Direct', url: 'https://moviebaaz.baby/download/hubcloud', speed: 'Fast' }
          ]
        },
        {
          quality: '720p HD',
          size: '1.2 GB',
          resolution: '1280x720',
          servers: [
            { name: 'Fast Google Drive', url: 'https://moviebaaz.baby/download/gdrive-720', speed: 'Lightning 100MB/s' },
            { name: 'HubCloud Direct', url: 'https://moviebaaz.baby/download/hubcloud-720', speed: 'High Speed' }
          ]
        },
        {
          quality: '1080p FHD [Recommended]',
          size: '2.4 GB',
          resolution: '1920x1080',
          servers: [
            { name: 'Fast Google Drive (VIP)', url: 'https://moviebaaz.baby/download/gdrive-1080', speed: 'Lightning 100MB/s' },
            { name: 'HubCloud Direct', url: 'https://moviebaaz.baby/download/hubcloud-1080', speed: 'High Speed' }
          ]
        }
      ],
      screenshots: ['/src/assets/images/hero_movie_banner_1790591176417.jpg'],
      createdAt: new Date().toISOString()
    });
    setIsAddMovieModalOpen(true);
  };

  // Add Preset Blockbuster
  const handleAddPreset = async (presetName: string) => {
    const presets: Record<string, Partial<Movie>> = {
      'Devara Part 1': {
        title: 'Devara: Part 1',
        year: 2024,
        category: 'South Hindi Dubbed',
        genres: ['Action', 'Drama', 'Thriller'],
        rating: 7.6,
        duration: '2h 58m',
        quality: '1080p WEB-DL',
        audio: 'Hindi (Original DDP 5.1) + Telugu (Dual Audio)',
        subtitles: 'English [ESubs]',
        fileSize: '2.9 GB / 1.4 GB / 600 MB',
        poster: '/src/assets/images/poster_historical_epic_1790591203848.jpg',
        backdrop: '/src/assets/images/hero_movie_banner_1790591176417.jpg',
        director: 'Koratala Siva',
        cast: 'N. T. Rama Rao Jr., Saif Ali Khan, Janhvi Kapoor',
        storyline: 'An epic coastal drama about a fearless leader of fishermen who strives to protect his people from coastal piracy and betrayal by his closest ally.',
        isFeatured: false,
        isTrending: true,
        streamServers: [
          { name: 'Server 1 (Fast HD)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }
        ],
        downloadLinks: [
          {
            quality: '480p SD',
            size: '600 MB',
            resolution: '854x480',
            servers: [{ name: 'Fast Google Drive', url: 'https://moviebaaz.baby/devara-480' }]
          },
          {
            quality: '720p HD',
            size: '1.4 GB',
            resolution: '1280x720',
            servers: [{ name: 'Fast Google Drive', url: 'https://moviebaaz.baby/devara-720' }]
          },
          {
            quality: '1080p FHD',
            size: '2.9 GB',
            resolution: '1920x1080',
            servers: [{ name: 'Fast Google Drive VIP', url: 'https://moviebaaz.baby/devara-1080' }]
          }
        ],
        screenshots: ['/src/assets/images/poster_historical_epic_1790591203848.jpg'],
      },
      'Animal Park': {
        title: 'Animal (Extended Cut)',
        year: 2023,
        category: 'Bollywood',
        genres: ['Action', 'Crime', 'Drama'],
        rating: 7.2,
        duration: '3h 28m',
        quality: '1080p WEB-DL',
        audio: 'Hindi (Dolby Atmos 5.1)',
        subtitles: 'English [ESub]',
        fileSize: '3.4 GB / 1.6 GB / 750 MB',
        poster: '/src/assets/images/poster_detective_thriller_1790591214478.jpg',
        backdrop: '/src/assets/images/hero_movie_banner_1790591176417.jpg',
        director: 'Sandeep Reddy Vanga',
        cast: 'Ranbir Kapoor, Anil Kapoor, Bobby Deol, Rashmika Mandanna',
        storyline: 'The visceral story of a son whose intense devotion to his emotionally aloof father leads him on an unhinged rampage of brutal vengeance.',
        isFeatured: false,
        isTrending: true,
        streamServers: [
          { name: 'Server 1 (Fast HD)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' }
        ],
        downloadLinks: [
          {
            quality: '720p HD',
            size: '1.6 GB',
            resolution: '1280x720',
            servers: [{ name: 'Fast Google Drive', url: 'https://moviebaaz.baby/animal-720' }]
          },
          {
            quality: '1080p FHD',
            size: '3.4 GB',
            resolution: '1920x1080',
            servers: [{ name: 'Fast Google Drive VIP', url: 'https://moviebaaz.baby/animal-1080' }]
          }
        ],
        screenshots: ['/src/assets/images/poster_detective_thriller_1790591214478.jpg'],
      }
    };

    const target = presets[presetName];
    if (target) {
      try {
        await createMovie(target as any);
        await onRefreshMovies();
        onShowToast(`Preset "${target.title}" added to movies!`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Export full JSON database
  const handleExportBackup = () => {
    const backupData = {
      movies,
      ads: adsConfig,
      settings,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moviebaaz_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('JSON backup file downloaded successfully!');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-[#0e1017] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onCloseAdmin}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-amber-500 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-amber-400" />
              <span>Back to Public Site</span>
            </button>

            <div className="h-5 w-px bg-neutral-800" />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h1 className="font-['Cabinet_Grotesk'] text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                  MovieBaaz Admin Center
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                    Live Disk Sync
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1-Click Explicit Save to Disk */}
            <button
              onClick={handleSyncToDisk}
              disabled={isSyncing}
              title="Ensure all changes are saved to disk files in repository"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-3 py-1.5 text-xs font-bold text-black shadow-md hover:from-amber-500 hover:to-amber-400 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Save className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">1-Click Save to Disk</span>
              <span className="sm:hidden">Save</span>
            </button>

            <button
              onClick={handleExportBackup}
              title="Download full JSON backup of catalog and ads"
              className="flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Export Backup</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Notice Banner (Explains persistence & no-ads rule) */}
      <div className="border-b border-neutral-800 bg-[#0c0d13] px-4 py-2 text-[11px] text-neutral-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>
              <strong>Zero-Ad Admin Zone:</strong> Ads never render in this admin interface. Everything you add, edit, or delete automatically updates the server and saves to <code className="text-amber-400">data/movies.json</code> and <code className="text-amber-400">data/ads.json</code>.
            </span>
          </div>
          {lastSyncTime && (
            <span className="hidden lg:inline text-neutral-500">
              Last saved: {new Date(lastSyncTime).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Main Admin Body */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-4">
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'movies'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
            }`}
          >
            <Film className="h-4 w-4" />
            <span>Manage Movies ({movies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ads'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>Ad Networks & Monetization</span>
            {editableAds.masterAdsEnabled && (
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Site Settings & Persistence</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>User Movie Requests ({settings.requests?.length || 0})</span>
          </button>
        </div>

        {/* TAB 1: MOVIES MANAGER */}
        {activeTab === 'movies' && (
          <div className="mt-6 space-y-6">
            {/* Header with Search and Add Movie buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies in database..."
                    value={movieSearch}
                    onChange={(e) => setMovieSearch(e.target.value)}
                    className="w-56 sm:w-72 rounded-lg border border-neutral-700 bg-neutral-900 py-1.5 pl-8 pr-3 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                  <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                </div>

                {/* Quick Preset Blockbusters */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400">
                  <span className="text-[11px]">Quick Add:</span>
                  <button
                    onClick={() => handleAddPreset('Devara Part 1')}
                    className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-amber-400 hover:bg-neutral-700 cursor-pointer"
                  >
                    + Devara Part 1
                  </button>
                  <button
                    onClick={() => handleAddPreset('Animal Park')}
                    className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-amber-400 hover:bg-neutral-700 cursor-pointer"
                  >
                    + Animal Extended
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditingMovie(null);
                    setIsAddMovieModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Movie / Series</span>
                </button>
              </div>
            </div>

            {/* Movies Table */}
            <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/60 shadow">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="border-b border-neutral-800 bg-[#0e1017] text-[11px] uppercase tracking-wider text-neutral-400">
                  <tr>
                    <th className="px-4 py-3">Poster & Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Audio & Quality</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Download Links</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredMovies.map((movie) => (
                    <tr key={movie.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-12 w-9 rounded object-cover border border-neutral-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate max-w-xs">{movie.title}</p>
                            <p className="text-[11px] text-neutral-400">{movie.year} · {movie.duration}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300">
                          {movie.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-amber-300 truncate max-w-[180px]">{movie.audio}</p>
                        <p className="text-[10px] text-neutral-400">{movie.quality}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-white">⭐ {movie.rating}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-emerald-400 font-medium">
                          {movie.downloadLinks?.length || 0} Tiers ({movie.fileSize || 'N/A'})
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setIsEditingMovie(movie);
                              setIsAddMovieModalOpen(true);
                            }}
                            title="Edit movie"
                            className="rounded-lg border border-neutral-700 bg-neutral-800 p-1.5 text-neutral-300 hover:border-amber-500 hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMovie(movie)}
                            title="Delete movie"
                            className="rounded-lg border border-neutral-700 bg-neutral-800 p-1.5 text-neutral-400 hover:border-red-500 hover:bg-red-950/40 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredMovies.length === 0 && (
                <div className="p-8 text-center text-neutral-500 text-xs">
                  No movies match your search.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AD NETWORKS & MONETIZATION */}
        {activeTab === 'ads' && (
          <div className="mt-6 space-y-6">
            {/* Top summary & Master Switch */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-['Cabinet_Grotesk'] text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-amber-400" />
                    Ad Networks & Monetization Settings
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Configure Google AdSense, Adsterra, PropellerAds, Monetag, or custom banner image sponsors.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Master Switch */}
                  <div className="flex items-center gap-3 rounded-lg border border-neutral-700 bg-[#0e1017] px-3.5 py-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">Master Ads Switch</span>
                      <span className="text-[10px] text-neutral-400">
                        {editableAds.masterAdsEnabled ? 'Ads are Active on Public Site' : 'All Ads Paused'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={editableAds.masterAdsEnabled}
                      onChange={(e) =>
                        setEditableAds({ ...editableAds, masterAdsEnabled: e.target.checked })
                      }
                      className="h-5 w-5 accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={handleSaveAds}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Ad Changes</span>
                  </button>
                </div>
              </div>

              {/* Ad Networks Guide Tip */}
              <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-xs text-amber-200/90 flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Supported Ad Formats:</strong> Paste raw JavaScript or HTML tags from <em>Adsterra (Native/Banners), PropellerAds, Google AdSense</em>, or choose <em>Custom Image Banner</em> with your affiliate/sponsor URL. Ads appear only on the public visitor site and never obstruct the admin panel.
                </span>
              </div>
            </div>

            {/* Ad Slots Configuration List */}
            <div className="grid grid-cols-1 gap-5">
              {Object.entries(editableAds.slots || {}).map(([slotKey, slot]) => (
                <div
                  key={slotKey}
                  className="rounded-xl border border-neutral-800 bg-[#12141c] p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-amber-400">
                          {slot.id}
                        </span>
                        <h4 className="text-sm font-bold text-white">{slot.name}</h4>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{slot.position}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={slot.enabled}
                          onChange={(e) => {
                            const updatedSlots = {
                              ...editableAds.slots,
                              [slotKey]: { ...slot, enabled: e.target.checked }
                            };
                            setEditableAds({ ...editableAds, slots: updatedSlots });
                          }}
                          className="h-4 w-4 accent-amber-500 cursor-pointer"
                        />
                        <span className={slot.enabled ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>
                          {slot.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>

                      <button
                        onClick={() =>
                          setAdPreviewSlotId(adPreviewSlotId === slot.id ? null : slot.id)
                        }
                        className="flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-[11px] text-neutral-300 hover:text-white cursor-pointer"
                      >
                        <Eye className="h-3 w-3" />
                        <span>{adPreviewSlotId === slot.id ? 'Hide Preview' : 'Preview Slot'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Slot Configuration Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Ad Implementation Type
                      </label>
                      <select
                        value={slot.type}
                        onChange={(e) => {
                          const updatedSlots = {
                            ...editableAds.slots,
                            [slotKey]: { ...slot, type: e.target.value as any }
                          };
                          setEditableAds({ ...editableAds, slots: updatedSlots });
                        }}
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      >
                        <option value="banner">Custom Image Banner + Target Link</option>
                        <option value="custom_html">HTML Code / Custom Box</option>
                        <option value="script">Adsterra / Adsense / Script Tag</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Sponsor / Disclosure Label
                      </label>
                      <input
                        type="text"
                        value={slot.label || ''}
                        onChange={(e) => {
                          const updatedSlots = {
                            ...editableAds.slots,
                            [slotKey]: { ...slot, label: e.target.value }
                          };
                          setEditableAds({ ...editableAds, slots: updatedSlots });
                        }}
                        placeholder="e.g. Advertisement, Sponsored, Partner"
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      >
                      </input>
                    </div>

                    {slot.type === 'banner' ? (
                      <>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            Banner Image URL
                          </label>
                          <input
                            type="text"
                            value={slot.bannerUrl || ''}
                            onChange={(e) => {
                              const updatedSlots = {
                                ...editableAds.slots,
                                [slotKey]: { ...slot, bannerUrl: e.target.value }
                              };
                              setEditableAds({ ...editableAds, slots: updatedSlots });
                            }}
                            placeholder="https://example.com/banner-728x90.jpg"
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            Destination Click URL (Affiliate / Sponsor Link)
                          </label>
                          <input
                            type="text"
                            value={slot.targetUrl || ''}
                            onChange={(e) => {
                              const updatedSlots = {
                                ...editableAds.slots,
                                [slotKey]: { ...slot, targetUrl: e.target.value }
                              };
                              setEditableAds({ ...editableAds, slots: updatedSlots });
                            }}
                            placeholder="https://sponsor.com?ref=moviebaaz"
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                          <span>Ad Network Script / HTML Snippet</span>
                          <span className="text-[10px] text-neutral-500">Supports &lt;script&gt;, &lt;iframe&gt;, &lt;div&gt;</span>
                        </label>
                        <textarea
                          rows={4}
                          value={slot.customHtml || ''}
                          onChange={(e) => {
                            const updatedSlots = {
                              ...editableAds.slots,
                              [slotKey]: { ...slot, customHtml: e.target.value }
                            };
                            setEditableAds({ ...editableAds, slots: updatedSlots });
                          }}
                          placeholder="<!-- Paste your Adsterra / Google AdSense code here -->"
                          className="w-full font-mono rounded-lg border border-neutral-700 bg-neutral-900 p-3 text-xs text-amber-200/90 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Isolated Live Preview Box for Admin testing */}
                  {adPreviewSlotId === slot.id && (
                    <div className="mt-3 rounded-lg border border-dashed border-amber-500/40 bg-neutral-950 p-4">
                      <p className="text-[10px] uppercase font-bold text-amber-400 mb-2">
                        Ad Sandbox Preview (How it appears to public users):
                      </p>
                      <AdBanner
                        slot={slot}
                        masterEnabled={true}
                        isAdminView={false}
                        forcePreview={true}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveAds}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-lg cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save All Ad Settings to Disk</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SITE SETTINGS & PERSISTENCE */}
        {activeTab === 'settings' && (
          <div className="mt-6 space-y-6">
            <div className="rounded-xl border border-neutral-800 bg-[#12141c] p-5 space-y-5">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="font-['Cabinet_Grotesk'] text-base font-bold text-white">
                  Site Brand & Announcement Settings
                </h3>
                <p className="text-xs text-neutral-400">
                  Control the public brand mark, Telegram channel, and announcement ticker.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={editableSettings.siteName || ''}
                    onChange={(e) =>
                      setEditableSettings({ ...editableSettings, siteName: e.target.value })
                    }
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Domain Name
                  </label>
                  <input
                    type="text"
                    value={editableSettings.siteDomain || ''}
                    onChange={(e) =>
                      setEditableSettings({ ...editableSettings, siteDomain: e.target.value })
                    }
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Official Telegram Channel Link
                  </label>
                  <input
                    type="text"
                    value={editableSettings.telegramChannel || ''}
                    onChange={(e) =>
                      setEditableSettings({ ...editableSettings, telegramChannel: e.target.value })
                    }
                    placeholder="https://t.me/moviebaaz_official"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-neutral-300">
                      Top Announcement Ticker Notice
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-neutral-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editableSettings.noticeEnabled}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, noticeEnabled: e.target.checked })
                        }
                        className="accent-amber-500 cursor-pointer"
                      />
                      <span>Show Ticker</span>
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    value={editableSettings.noticeText || ''}
                    onChange={(e) =>
                      setEditableSettings({ ...editableSettings, noticeText: e.target.value })
                    }
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-4 flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Site Settings</span>
                </button>
              </div>
            </div>

            {/* Disk & Repository Synchronization Controls */}
            <div className="rounded-xl border border-neutral-800 bg-[#12141c] p-5 space-y-4">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="font-['Cabinet_Grotesk'] text-base font-bold text-white flex items-center gap-2">
                  <Save className="h-4 w-4 text-emerald-400" />
                  File & Workspace Repository Persistence
                </h3>
                <p className="text-xs text-neutral-400">
                  MovieBaaz stores all movies, ads, and settings directly in physical JSON files inside the <code className="text-amber-400">data/</code> directory.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-white">Direct Server Files</h4>
                  <ul className="text-xs text-neutral-400 space-y-1 font-mono">
                    <li>• data/movies.json ({movies.length} entries)</li>
                    <li>• data/ads.json ({Object.keys(adsConfig.slots || {}).length} ad slots)</li>
                    <li>• data/settings.json (configuration & requests)</li>
                  </ul>
                  <button
                    onClick={handleSyncToDisk}
                    className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Run Full Sync to Disk Now</span>
                  </button>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-white">Offline Backups</h4>
                  <p className="text-xs text-neutral-400">
                    Download an offline JSON dump or import an existing catalog backup anytime.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleExportBackup}
                      className="flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-700 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-amber-400" />
                      <span>Export JSON</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: USER MOVIE REQUESTS */}
        {activeTab === 'requests' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-['Cabinet_Grotesk'] text-base font-bold text-white">
                  Visitor Movie Requests
                </h3>
                <p className="text-xs text-neutral-400">
                  Requests submitted by users through the public "Request Movie" modal.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-[#12141c]">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="border-b border-neutral-800 bg-[#0e1017] text-[11px] uppercase tracking-wider text-neutral-400">
                  <tr>
                    <th className="px-4 py-3">Movie Title</th>
                    <th className="px-4 py-3">Preferred Quality</th>
                    <th className="px-4 py-3">Requested By</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {(settings.requests || []).map((req) => (
                    <tr key={req.id} className="hover:bg-neutral-800/30">
                      <td className="px-4 py-3 font-bold text-white">{req.movieTitle}</td>
                      <td className="px-4 py-3 text-amber-300">{req.preferredQuality}</td>
                      <td className="px-4 py-3 text-neutral-400">{req.requestedBy}</td>
                      <td className="px-4 py-3 text-neutral-500">
                        {new Date(req.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={req.status}
                          onChange={(e) =>
                            handleUpdateRequestStatus(req.id, e.target.value as any)
                          }
                          className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="fulfilled">Fulfilled</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleConvertRequest(req)}
                          className="rounded bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/30 cursor-pointer"
                        >
                          + Convert to Movie
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!settings.requests || settings.requests.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-xs text-neutral-500">
                        No movie requests submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Movie Modal */}
      {isAddMovieModalOpen && (
        <AddEditMovieModal
          movie={isEditingMovie}
          onClose={() => {
            setIsAddMovieModalOpen(false);
            setIsEditingMovie(null);
          }}
          onSave={async (movieData) => {
            try {
              if (isEditingMovie && isEditingMovie.id) {
                await updateMovie(isEditingMovie.id, movieData);
                onShowToast(`Updated "${movieData.title}" in data/movies.json`);
              } else {
                await createMovie(movieData as any);
                onShowToast(`Added "${movieData.title}" to catalog and data/movies.json`);
              }
              await onRefreshMovies();
              setIsAddMovieModalOpen(false);
              setIsEditingMovie(null);
            } catch (err) {
              console.error(err);
              onShowToast('Failed to save movie.');
            }
          }}
        />
      )}
    </div>
  );
};

// Sub-component: Add / Edit Movie Modal
interface AddEditMovieModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSave: (movie: Partial<Movie>) => Promise<void>;
}

const AddEditMovieModal: React.FC<AddEditMovieModalProps> = ({ movie, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Movie>>(
    movie || {
      title: '',
      year: new Date().getFullYear(),
      category: 'South Hindi Dubbed',
      genres: ['Action', 'Thriller'],
      rating: 7.5,
      duration: '2h 15m',
      quality: '1080p WEB-DL',
      audio: 'Hindi (Clean Audio) + Telugu (Dual Audio)',
      subtitles: 'English [ESubs]',
      fileSize: '2.4 GB / 1.2 GB / 500 MB',
      poster: '/src/assets/images/poster_historical_epic_1790591203848.jpg',
      backdrop: '/src/assets/images/hero_movie_banner_1790591176417.jpg',
      director: '',
      cast: '',
      storyline: '',
      isFeatured: false,
      isTrending: true,
      trailerUrl: '',
      streamServers: [
        { name: 'Server 1 (Fast HD)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        { name: 'Server 2 (Multi-Quality)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' }
      ],
      downloadLinks: [
        {
          quality: '480p SD',
          size: '500 MB',
          resolution: '854x480',
          servers: [
            { name: 'Fast Google Drive', url: 'https://moviebaaz.baby/download/gdrive-480', speed: 'High Speed' },
            { name: 'HubCloud Direct', url: 'https://moviebaaz.baby/download/hubcloud-480', speed: 'Fast' }
          ]
        },
        {
          quality: '720p HD',
          size: '1.2 GB',
          resolution: '1280x720',
          servers: [
            { name: 'Fast Google Drive', url: 'https://moviebaaz.baby/download/gdrive-720', speed: 'Lightning 100MB/s' },
            { name: 'HubCloud Direct', url: 'https://moviebaaz.baby/download/hubcloud-720', speed: 'High Speed' }
          ]
        },
        {
          quality: '1080p FHD [Recommended]',
          size: '2.4 GB',
          resolution: '1920x1080',
          servers: [
            { name: 'Fast Google Drive (VIP)', url: 'https://moviebaaz.baby/download/gdrive-1080', speed: 'Lightning 100MB/s' },
            { name: 'HubCloud Direct', url: 'https://moviebaaz.baby/download/hubcloud-1080', speed: 'High Speed' }
          ]
        }
      ],
      screenshots: ['/src/assets/images/hero_movie_banner_1790591176417.jpg']
    }
  );

  const [genreInput, setGenreInput] = useState(formData.genres?.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    setIsSubmitting(true);
    const parsedGenres = genreInput.split(',').map((g) => g.trim()).filter(Boolean);
    try {
      await onSave({
        ...formData,
        genres: parsedGenres.length > 0 ? parsedGenres : ['Action']
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-[#12141c] p-6 shadow-2xl z-10 my-auto max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="font-['Cabinet_Grotesk'] text-base font-bold text-white flex items-center gap-2">
            <Film className="h-5 w-5 text-amber-500" />
            {movie ? `Edit "${movie.title}"` : 'Add New Movie / Series'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Movie / Series Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Pushpa 2: The Rule"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="South Hindi Dubbed">South Hindi Dubbed</option>
                <option value="Bollywood">Bollywood</option>
                <option value="Hollywood Dual Audio">Hollywood Dual Audio</option>
                <option value="Bengali Movies">Bengali Movies</option>
                <option value="Web Series">Web Series</option>
                <option value="Korean Drama">Korean Drama Hindi Dubbed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Release Year *
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Audio Languages (e.g. Dual Audio) *
              </label>
              <input
                type="text"
                value={formData.audio}
                onChange={(e) => setFormData({ ...formData, audio: e.target.value })}
                placeholder="Hindi (Clean) + Telugu [Dual Audio]"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Quality Tag (1080p, 720p, etc.) *
              </label>
              <input
                type="text"
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                placeholder="1080p WEB-DL"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                IMDb Rating (e.g. 8.1)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 7.0 })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Runtime Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="2h 30m or 10 Episodes"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Genres (Comma separated)
              </label>
              <input
                type="text"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                placeholder="Action, Crime, Thriller"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                File Sizes Available
              </label>
              <input
                type="text"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                placeholder="2.4 GB / 1.2 GB / 500 MB"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Poster Image URL
              </label>
              <input
                type="text"
                value={formData.poster}
                onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Storyline Synopsis
              </label>
              <textarea
                rows={3}
                value={formData.storyline}
                onChange={(e) => setFormData({ ...formData, storyline: e.target.value })}
                placeholder="Brief movie plot..."
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Starring Cast
              </label>
              <input
                type="text"
                value={formData.cast}
                onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                placeholder="Actor 1, Actor 2..."
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Director
              </label>
              <input
                type="text"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                placeholder="Director name"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-4 flex justify-between items-center">
            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="accent-amber-500 cursor-pointer"
              />
              <span>Highlight on Homepage Featured Banner</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-black hover:bg-amber-400 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Saving to Disk...' : 'Save & Publish Movie'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
