import { Movie, AdsConfig, SiteSettings, MovieRequest } from '../types';

const STORAGE_KEYS = {
  MOVIES: 'moviebaaz_movies_cache',
  ADS: 'moviebaaz_ads_cache',
  SETTINGS: 'moviebaaz_settings_cache',
  BOOKMARKS: 'moviebaaz_bookmarks',
};

// 1. Movies API
export async function getMovies(): Promise<Movie[]> {
  try {
    const res = await fetch('/api/movies');
    if (!res.ok) throw new Error('Failed to fetch movies from server');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('API error, falling back to local cache:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.MOVIES);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
  }
  return [];
}

export async function createMovie(movie: Omit<Movie, 'id' | 'createdAt'> & { id?: string }): Promise<Movie> {
  const res = await fetch('/api/movies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie)
  });
  if (!res.ok) throw new Error('Failed to create movie');
  const result = await res.json();
  return result.movie;
}

export async function updateMovie(id: string, movie: Partial<Movie>): Promise<Movie> {
  const res = await fetch(`/api/movies/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie)
  });
  if (!res.ok) throw new Error('Failed to update movie');
  const result = await res.json();
  return result.movie;
}

export async function deleteMovie(id: string): Promise<boolean> {
  const res = await fetch(`/api/movies/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete movie');
  return true;
}

export async function bulkRestoreMovies(movies: Movie[]): Promise<boolean> {
  const res = await fetch('/api/movies/bulk-restore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movies })
  });
  return res.ok;
}

// 2. Ads Config API
export async function getAdsConfig(): Promise<AdsConfig | null> {
  try {
    const res = await fetch('/api/ads');
    if (!res.ok) throw new Error('Failed to fetch ads configuration');
    const data = await res.json();
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn('Ads API error, using cache:', err);
    const cached = localStorage.getItem(STORAGE_KEYS.ADS);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return null;
  }
}

export async function saveAdsConfig(config: AdsConfig): Promise<AdsConfig> {
  const res = await fetch('/api/ads', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  if (!res.ok) throw new Error('Failed to update ads');
  const result = await res.json();
  localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(result.ads));
  return result.ads;
}

export async function recordAdClick(): Promise<void> {
  try {
    await fetch('/api/ads/click', { method: 'POST' });
  } catch (e) {}
}

// 3. Settings API
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    const data = await res.json();
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn('Settings API error, using cache:', err);
    const cached = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return null;
  }
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  if (!res.ok) throw new Error('Failed to save settings');
  const result = await res.json();
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(result.settings));
  return result.settings;
}

export async function submitMovieRequest(data: { movieTitle: string; requestedBy?: string; preferredQuality?: string }): Promise<MovieRequest> {
  const res = await fetch('/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit request');
  const result = await res.json();
  return result.request;
}

export async function updateRequestStatus(id: string, status: MovieRequest['status']): Promise<MovieRequest> {
  const res = await fetch(`/api/requests/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update request');
  const result = await res.json();
  return result.request;
}

// 4. One-click sync to workspace / GitHub disk files
export async function syncToDisk(): Promise<{ success: boolean; message: string; timestamp: string }> {
  const res = await fetch('/api/sync-to-disk', { method: 'POST' });
  if (!res.ok) throw new Error('Sync failed');
  return await res.json();
}

// 5. Bookmarks in LocalStorage
export function getStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleStoredBookmark(id: string): string[] {
  const current = getStoredBookmarks();
  const exists = current.includes(id);
  const updated = exists ? current.filter(item => item !== id) : [...current, id];
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  return updated;
}
