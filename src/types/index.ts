export interface StreamServer {
  name: string;
  url: string;
}

export interface DownloadServer {
  name: string;
  url: string;
  speed?: string;
}

export interface DownloadTier {
  quality: string;
  size: string;
  resolution: string;
  servers: DownloadServer[];
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  category: string;
  genres: string[];
  rating: number;
  duration: string;
  quality: string;
  audio: string;
  subtitles: string;
  fileSize: string;
  poster: string;
  backdrop: string;
  director: string;
  cast: string;
  storyline: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  trailerUrl?: string;
  streamServers: StreamServer[];
  downloadLinks: DownloadTier[];
  screenshots: string[];
  createdAt: string;
}

export type AdType = 'banner' | 'custom_html' | 'script';

export interface AdSlotConfig {
  id: string;
  name: string;
  position: string;
  enabled: boolean;
  type: AdType;
  bannerUrl: string;
  targetUrl: string;
  customHtml: string;
  label: string;
}

export interface AdsConfig {
  masterAdsEnabled: boolean;
  slots: Record<string, AdSlotConfig>;
  stats: {
    totalImpressions: number;
    totalClicks: number;
    lastUpdated: string;
  };
}

export interface MovieRequest {
  id: string;
  movieTitle: string;
  requestedBy: string;
  preferredQuality: string;
  status: 'pending' | 'in-progress' | 'fulfilled' | 'rejected';
  date: string;
}

export interface SiteSettings {
  siteName: string;
  siteDomain: string;
  siteTagline: string;
  telegramChannel: string;
  telegramGroup: string;
  noticeText: string;
  noticeEnabled: boolean;
  adminPin: string;
  allowUserRequests: boolean;
  requests: MovieRequest[];
  lastSynced: string;
}
