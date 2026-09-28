import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const MOVIES_FILE = path.join(DATA_DIR, 'movies.json');
const ADS_FILE = path.join(DATA_DIR, 'ads.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data folder and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

function writeJsonFile<T>(filePath: string, data: T): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // --- API Endpoints ---

  // 1. Movies API
  app.get('/api/movies', (req, res) => {
    const movies = readJsonFile<any[]>(MOVIES_FILE, []);
    res.json(movies);
  });

  app.post('/api/movies', (req, res) => {
    const movies = readJsonFile<any[]>(MOVIES_FILE, []);
    const newMovie = {
      ...req.body,
      id: req.body.id || 'movie-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: req.body.createdAt || new Date().toISOString()
    };
    movies.unshift(newMovie);
    writeJsonFile(MOVIES_FILE, movies);
    res.status(201).json({ success: true, movie: newMovie });
  });

  app.put('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const movies = readJsonFile<any[]>(MOVIES_FILE, []);
    const index = movies.findIndex((m: any) => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    movies[index] = { ...movies[index], ...req.body, id };
    writeJsonFile(MOVIES_FILE, movies);
    res.json({ success: true, movie: movies[index] });
  });

  app.delete('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    let movies = readJsonFile<any[]>(MOVIES_FILE, []);
    const initialLen = movies.length;
    movies = movies.filter((m: any) => m.id !== id);
    if (movies.length === initialLen) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    writeJsonFile(MOVIES_FILE, movies);
    res.json({ success: true, message: 'Movie deleted permanently from disk and catalog' });
  });

  app.post('/api/movies/bulk-restore', (req, res) => {
    if (Array.isArray(req.body.movies)) {
      writeJsonFile(MOVIES_FILE, req.body.movies);
      return res.json({ success: true, count: req.body.movies.length });
    }
    res.status(400).json({ error: 'Invalid payload' });
  });

  // 2. Ads Configuration API
  app.get('/api/ads', (req, res) => {
    const ads = readJsonFile<any>(ADS_FILE, { masterAdsEnabled: true, slots: {}, stats: {} });
    res.json(ads);
  });

  app.put('/api/ads', (req, res) => {
    const current = readJsonFile<any>(ADS_FILE, {});
    const updated = {
      ...current,
      ...req.body,
      stats: {
        ...(current.stats || {}),
        lastUpdated: new Date().toISOString()
      }
    };
    writeJsonFile(ADS_FILE, updated);
    res.json({ success: true, ads: updated });
  });

  app.post('/api/ads/click', (req, res) => {
    const ads = readJsonFile<any>(ADS_FILE, { stats: { totalImpressions: 0, totalClicks: 0 } });
    if (!ads.stats) ads.stats = { totalImpressions: 0, totalClicks: 0 };
    ads.stats.totalClicks = (ads.stats.totalClicks || 0) + 1;
    writeJsonFile(ADS_FILE, ads);
    res.json({ success: true, totalClicks: ads.stats.totalClicks });
  });

  // 3. Settings & Requests API
  app.get('/api/settings', (req, res) => {
    const settings = readJsonFile<any>(SETTINGS_FILE, {});
    res.json(settings);
  });

  app.put('/api/settings', (req, res) => {
    const current = readJsonFile<any>(SETTINGS_FILE, {});
    const updated = { ...current, ...req.body, lastSynced: new Date().toISOString() };
    writeJsonFile(SETTINGS_FILE, updated);
    res.json({ success: true, settings: updated });
  });

  app.post('/api/requests', (req, res) => {
    const settings = readJsonFile<any>(SETTINGS_FILE, { requests: [] });
    if (!settings.requests) settings.requests = [];
    const newReq = {
      id: 'req-' + Date.now(),
      movieTitle: req.body.movieTitle,
      requestedBy: req.body.requestedBy || 'Anonymous',
      preferredQuality: req.body.preferredQuality || '1080p FHD',
      status: 'pending',
      date: new Date().toISOString()
    };
    settings.requests.unshift(newReq);
    writeJsonFile(SETTINGS_FILE, settings);
    res.status(201).json({ success: true, request: newReq });
  });

  app.put('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    const settings = readJsonFile<any>(SETTINGS_FILE, { requests: [] });
    if (!settings.requests) settings.requests = [];
    const index = settings.requests.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      settings.requests[index].status = req.body.status;
      writeJsonFile(SETTINGS_FILE, settings);
      return res.json({ success: true, request: settings.requests[index] });
    }
    res.status(404).json({ error: 'Request not found' });
  });

  // 4. One-Click Sync to Disk / Repo
  app.post('/api/sync-to-disk', (req, res) => {
    try {
      const now = new Date().toISOString();
      const settings = readJsonFile<any>(SETTINGS_FILE, {});
      settings.lastSynced = now;
      writeJsonFile(SETTINGS_FILE, settings);

      res.json({
        success: true,
        message: 'All movies, ads settings and data have been safely saved to disk in data/ directory.',
        timestamp: now
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mount Vite or static server
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MovieBaaz server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
