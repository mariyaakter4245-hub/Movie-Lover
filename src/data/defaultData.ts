import { Movie, AdsConfig, SiteSettings } from '../types';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: "pushpa-2-the-rule-2024",
    title: "Pushpa 2: The Rule",
    year: 2024,
    category: "South Hindi Dubbed",
    genres: ["Action", "Crime", "Drama", "Thriller"],
    rating: 8.1,
    duration: "3h 24m",
    quality: "1080p WEB-DL",
    audio: "Hindi (Clean HQ) + Telugu (Dual Audio)",
    subtitles: "English [ESub]",
    fileSize: "2.8 GB / 1.4 GB / 650 MB",
    poster: "/images/poster_historical_epic.jpg",
    backdrop: "/images/hero_movie_banner.jpg",
    director: "Sukumar",
    cast: "Allu Arjun, Rashmika Mandanna, Fahadh Faasil, Sunil",
    storyline: "Pushpa Raj establishes an unassailable grip over the red sandalwood syndicate across international borders. However, Bhanwar Singh Shekhawat IPS vows retribution, sparking an explosive clash of dominance, power, and ego.",
    isFeatured: true,
    isTrending: true,
    trailerUrl: "https://www.youtube.com/embed/g3JUbgFBWu8",
    streamServers: [
      { name: "Server 1 (Fast HD)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { name: "Server 2 (Multi-Quality)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { name: "Server 3 (Ultra Speed)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    downloadLinks: [
      {
        quality: "480p SD",
        size: "650 MB",
        resolution: "854x480",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/pushpa2-480p-gdrive", speed: "Lightning 100MB/s" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/pushpa2-480p-hubcloud", speed: "High Speed" },
          { name: "Mega Server", url: "https://moviebaaz.baby/download/pushpa2-480p-mega", speed: "Fast" }
        ]
      },
      {
        quality: "720p HD",
        size: "1.4 GB",
        resolution: "1280x720 (x264/HEVC)",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/pushpa2-720p-gdrive", speed: "Lightning 100MB/s" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/pushpa2-720p-hubcloud", speed: "High Speed" },
          { name: "Fast Cloud Mirror", url: "https://moviebaaz.baby/download/pushpa2-720p-cloud", speed: "Fast" }
        ]
      },
      {
        quality: "1080p FHD [Recommended]",
        size: "2.8 GB",
        resolution: "1920x1080 (10-Bit ESub)",
        servers: [
          { name: "Fast Google Drive (VIP)", url: "https://moviebaaz.baby/download/pushpa2-1080p-gdrive", speed: "Lightning 100MB/s" },
          { name: "HubCloud Ultra Direct", url: "https://moviebaaz.baby/download/pushpa2-1080p-hubcloud", speed: "High Speed" },
          { name: "1-Click Direct Link", url: "https://moviebaaz.baby/download/pushpa2-1080p-direct", speed: "Instant" }
        ]
      },
      {
        quality: "4K UHD HDR",
        size: "7.2 GB",
        resolution: "3840x2160 Dolby Atmos",
        servers: [
          { name: "Torrent Magnet", url: "magnet:?xt=urn:btih:moviebaaz-pushpa2-4k", speed: "Peer-to-Peer" },
          { name: "Mega Direct VIP", url: "https://moviebaaz.baby/download/pushpa2-4k-mega", speed: "VIP Server" }
        ]
      }
    ],
    screenshots: [
      "/images/hero_movie_banner.jpg",
      "/images/poster_historical_epic.jpg"
    ],
    createdAt: "2025-01-10T12:00:00.000Z"
  },
  {
    id: "kalki-2898-ad-2024",
    title: "Kalki 2898 AD",
    year: 2024,
    category: "South Hindi Dubbed",
    genres: ["Action", "Sci-Fi", "Fantasy", "Adventure"],
    rating: 7.8,
    duration: "3h 01m",
    quality: "1080p WEB-DL",
    audio: "Hindi (Original) + Telugu + Tamil",
    subtitles: "English [MSubs]",
    fileSize: "3.1 GB / 1.5 GB / 700 MB",
    poster: "/images/poster_action_sci.jpg",
    backdrop: "/images/hero_movie_banner.jpg",
    director: "Nag Ashwin",
    cast: "Prabhas, Amitabh Bachchan, Kamal Haasan, Deepika Padukone",
    storyline: "In the dystopian desert city of Kasi in the year 2898 AD, ruled by the tyrannical god-king Supreme Yaskin, a pregnant refugee carries the hope of humanity's rebirth as an ancient warrior rises to protect her.",
    isFeatured: true,
    isTrending: true,
    trailerUrl: "https://www.youtube.com/embed/kQDd1AhGIHk",
    streamServers: [
      { name: "Server 1 (Fast HD)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { name: "Server 2 (Multi-CDN)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    downloadLinks: [
      {
        quality: "480p SD",
        size: "700 MB",
        resolution: "854x480",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/kalki-480p-gdrive", speed: "Fast" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/kalki-480p-hubcloud", speed: "High Speed" }
        ]
      },
      {
        quality: "720p HD HEVC",
        size: "1.5 GB",
        resolution: "1280x720",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/kalki-720p-gdrive", speed: "Lightning 100MB/s" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/kalki-720p-hubcloud", speed: "High Speed" }
        ]
      },
      {
        quality: "1080p FHD",
        size: "3.1 GB",
        resolution: "1920x1080 60FPS",
        servers: [
          { name: "Fast Google Drive (VIP)", url: "https://moviebaaz.baby/download/kalki-1080p-gdrive", speed: "Lightning 100MB/s" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/kalki-1080p-hubcloud", speed: "High Speed" }
        ]
      }
    ],
    screenshots: [
      "/images/poster_action_sci.jpg"
    ],
    createdAt: "2025-01-08T10:00:00.000Z"
  },
  {
    id: "stree-2-2024",
    title: "Stree 2: Sarkate Ka Aatank",
    year: 2024,
    category: "Bollywood",
    genres: ["Comedy", "Horror"],
    rating: 7.4,
    duration: "2h 27m",
    quality: "1080p WEB-DL",
    audio: "Hindi (Dolby Digital 5.1)",
    subtitles: "English [ESubs]",
    fileSize: "2.3 GB / 1.2 GB / 550 MB",
    poster: "/images/poster_detective_thriller.jpg",
    backdrop: "/images/hero_movie_banner.jpg",
    director: "Amar Kaushik",
    cast: "Rajkummar Rao, Shraddha Kapoor, Pankaj Tripathi, Abhishek Banerjee",
    storyline: "The quiet town of Chanderi is besieged by a terrifying headless ghost known as Sarkata, kidnapping progressive women. Vicky and his eccentric band of friends must team up with Stree to save their town.",
    isFeatured: true,
    isTrending: true,
    trailerUrl: "https://www.youtube.com/embed/KVnhe0eBf5w",
    streamServers: [
      { name: "Server 1 (Fast HD)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    downloadLinks: [
      {
        quality: "480p SD",
        size: "550 MB",
        resolution: "854x480",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/stree2-480p-gdrive", speed: "Fast" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/stree2-480p-hubcloud", speed: "High Speed" }
        ]
      },
      {
        quality: "720p HD",
        size: "1.2 GB",
        resolution: "1280x720",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/stree2-720p-gdrive", speed: "Fast" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/stree2-720p-hubcloud", speed: "High Speed" }
        ]
      },
      {
        quality: "1080p FHD",
        size: "2.3 GB",
        resolution: "1920x1080",
        servers: [
          { name: "Fast Google Drive (VIP)", url: "https://moviebaaz.baby/download/stree2-1080p-gdrive", speed: "High Speed" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/stree2-1080p-hubcloud", speed: "High Speed" }
        ]
      }
    ],
    screenshots: [
      "/images/poster_detective_thriller.jpg"
    ],
    createdAt: "2025-01-05T08:00:00.000Z"
  },
  {
    id: "toofan-2024-bengali",
    title: "Toofan (তুফান)",
    year: 2024,
    category: "Bengali Movies",
    genres: ["Action", "Crime", "Thriller"],
    rating: 7.9,
    duration: "2h 25m",
    quality: "1080p WEB-DL",
    audio: "Bengali (Clean Audio 5.1)",
    subtitles: "English [ESubs]",
    fileSize: "2.1 GB / 1.1 GB / 450 MB",
    poster: "/images/poster_detective_thriller.jpg",
    backdrop: "/images/hero_movie_banner.jpg",
    director: "Raihan Rafi",
    cast: "Shakib Khan, Mimi Chakraborty, Chanchal Chowdhury, Nabila",
    storyline: "The ruthless rise and bloodstained criminal career of Galib, a reckless small-time criminal who ascends to become the most dreaded mafia don Toofan across the underworld of Bangladesh in the 1990s.",
    isFeatured: false,
    isTrending: true,
    trailerUrl: "https://www.youtube.com/embed/n43jXpI2W44",
    streamServers: [
      { name: "Server 1 (Fast HD)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ],
    downloadLinks: [
      {
        quality: "480p SD",
        size: "450 MB",
        resolution: "854x480",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/toofan-480p-gdrive", speed: "Fast" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/toofan-480p-hubcloud", speed: "High Speed" }
        ]
      },
      {
        quality: "720p HD",
        size: "1.1 GB",
        resolution: "1280x720",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/toofan-720p-gdrive", speed: "Fast" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/toofan-720p-hubcloud", speed: "High Speed" }
        ]
      },
      {
        quality: "1080p FHD",
        size: "2.1 GB",
        resolution: "1920x1080",
        servers: [
          { name: "Fast Google Drive (VIP)", url: "https://moviebaaz.baby/download/toofan-1080p-gdrive", speed: "Lightning 100MB/s" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/toofan-1080p-hubcloud", speed: "High Speed" }
        ]
      }
    ],
    screenshots: [
      "/images/poster_detective_thriller.jpg"
    ],
    createdAt: "2025-01-02T14:00:00.000Z"
  },
  {
    id: "deadpool-and-wolverine-2024",
    title: "Deadpool & Wolverine",
    year: 2024,
    category: "Hollywood Dual Audio",
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    rating: 7.7,
    duration: "2h 08m",
    quality: "1080p WEB-DL",
    audio: "Hindi (Clean DDP 5.1) + English (Dual Audio)",
    subtitles: "English [ESub] + Hindi",
    fileSize: "2.5 GB / 1.3 GB / 600 MB",
    poster: "/images/poster_action_sci.jpg",
    backdrop: "/images/hero_movie_banner.jpg",
    director: "Shawn Levy",
    cast: "Ryan Reynolds, Hugh Jackman, Emma Corrin, Matthew Macfadyen",
    storyline: "Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy threatening the stability of their respective timelines.",
    isFeatured: false,
    isTrending: true,
    trailerUrl: "https://www.youtube.com/embed/73_1biulkYk",
    streamServers: [
      { name: "Server 1 (Fast HD)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    downloadLinks: [
      {
        quality: "480p SD",
        size: "600 MB",
        resolution: "854x480",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/deadpool-480p-gdrive", speed: "Fast" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/deadpool-480p-hubcloud", speed: "High Speed" }
        ]
      },
      {
        quality: "720p HD Dual Audio",
        size: "1.3 GB",
        resolution: "1280x720",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/deadpool-720p-gdrive", speed: "Fast" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/deadpool-720p-hubcloud", speed: "High Speed" }
        ]
      },
      {
        quality: "1080p 10-Bit Dual Audio",
        size: "2.5 GB",
        resolution: "1920x1080",
        servers: [
          { name: "Fast Google Drive (VIP)", url: "https://moviebaaz.baby/download/deadpool-1080p-gdrive", speed: "Lightning 100MB/s" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/deadpool-1080p-hubcloud", speed: "High Speed" }
        ]
      }
    ],
    screenshots: [
      "/images/poster_action_sci.jpg"
    ],
    createdAt: "2024-12-25T11:00:00.000Z"
  },
  {
    id: "mirzapur-season-3-2024",
    title: "Mirzapur (Season 3) Complete",
    year: 2024,
    category: "Web Series",
    genres: ["Action", "Crime", "Drama", "Thriller"],
    rating: 8.5,
    duration: "10 Episodes",
    quality: "720p / 1080p WEB-DL",
    audio: "Hindi (Original Audio)",
    subtitles: "English [ESubs]",
    fileSize: "3.5 GB (Pack) / 350MB (Per Ep)",
    poster: "/images/poster_historical_epic.jpg",
    backdrop: "/images/hero_movie_banner.jpg",
    director: "Gurmmeet Singh, Anand Iyer",
    cast: "Pankaj Tripathi, Ali Fazal, Shweta Tripathi, Rasika Dugal",
    storyline: "With Akhandanand Tripathi recovering in secrecy, Guddu Pandit and Golu seize control of the Purvanchal throne. Political betrayals, bloodbaths and shifting alliances threaten to unravel the kingdom of Mirzapur.",
    isFeatured: false,
    isTrending: true,
    trailerUrl: "https://www.youtube.com/embed/5a4G3aD1hEU",
    streamServers: [
      { name: "Episode 1 to 10 Player", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
    ],
    downloadLinks: [
      {
        quality: "720p Complete Zip Pack",
        size: "3.5 GB",
        resolution: "1280x720",
        servers: [
          { name: "Fast Google Drive Zip", url: "https://moviebaaz.baby/download/mirzapur-s3-720p-zip", speed: "Lightning 100MB/s" },
          { name: "HubCloud Batch", url: "https://moviebaaz.baby/download/mirzapur-s3-720p-batch", speed: "Fast" }
        ]
      },
      {
        quality: "1080p FHD Batch Pack",
        size: "7.8 GB",
        resolution: "1920x1080",
        servers: [
          { name: "Fast Google Drive VIP", url: "https://moviebaaz.baby/download/mirzapur-s3-1080p-gdrive", speed: "Lightning 100MB/s" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/mirzapur-s3-1080p-hubcloud", speed: "High Speed" }
        ]
      }
    ],
    screenshots: [
      "/images/poster_historical_epic.jpg"
    ],
    createdAt: "2024-12-20T16:00:00.000Z"
  },
  {
    id: "squid-game-season-2-2024",
    title: "Squid Game (Season 2) Dual Audio",
    year: 2024,
    category: "Web Series",
    genres: ["Action", "Drama", "Mystery", "Thriller"],
    rating: 8.2,
    duration: "6 Episodes",
    quality: "1080p WEB-DL",
    audio: "Hindi + Korean (Dual Audio)",
    subtitles: "English [ESub] + Hindi",
    fileSize: "3.2 GB (Pack) / 500MB (Per Ep)",
    poster: "/images/poster_action_sci.jpg",
    backdrop: "/images/hero_movie_banner.jpg",
    director: "Hwang Dong-hyuk",
    cast: "Lee Jung-jae, Lee Byung-hun, Wi Ha-joon, Im Si-wan",
    storyline: "Three years after winning the deadly Squid Game, Player 456 Seong Gi-hun abandons his plans to go to the US and returns with a resolute purpose to dismantle the brutal game organization from within.",
    isFeatured: false,
    isTrending: true,
    trailerUrl: "https://www.youtube.com/embed/Edw9b5a-jWc",
    streamServers: [
      { name: "Server 1 (All Episodes)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ],
    downloadLinks: [
      {
        quality: "720p Dual Audio Pack",
        size: "2.4 GB",
        resolution: "1280x720",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/squidgame-s2-720p", speed: "High Speed" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/squidgame-s2-hubcloud", speed: "Fast" }
        ]
      },
      {
        quality: "1080p FHD Dual Audio",
        size: "4.8 GB",
        resolution: "1920x1080",
        servers: [
          { name: "Fast Google Drive VIP", url: "https://moviebaaz.baby/download/squidgame-s2-1080p", speed: "Lightning 100MB/s" }
        ]
      }
    ],
    screenshots: [
      "/images/poster_action_sci.jpg"
    ],
    createdAt: "2024-12-18T09:00:00.000Z"
  },
  {
    id: "maharaja-2024-hindi-dubbed",
    title: "Maharaja",
    year: 2024,
    category: "South Hindi Dubbed",
    genres: ["Action", "Crime", "Drama", "Mystery"],
    rating: 8.5,
    duration: "2h 20m",
    quality: "1080p WEB-DL",
    audio: "Hindi (Clean Audio) + Tamil (Dual Audio)",
    subtitles: "English [ESubs]",
    fileSize: "2.2 GB / 1.1 GB / 500 MB",
    poster: "/images/poster_detective_thriller.jpg",
    backdrop: "/images/hero_movie_banner.jpg",
    director: "Nithilan Saminathan",
    cast: "Vijay Sethupathi, Anurag Kashyap, Mamta Mohandas, Natarajan",
    storyline: "A quiet barber visits a police station reporting the theft of 'Lakshmi', an ordinary iron dustbin. As baffled police unravel the case, a horrifying web of deception, vengeance, and ruthless retribution surfaces.",
    isFeatured: false,
    isTrending: true,
    trailerUrl: "https://www.youtube.com/embed/6iU6N9fO9Zg",
    streamServers: [
      { name: "Server 1 (Fast HD)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    downloadLinks: [
      {
        quality: "480p SD",
        size: "500 MB",
        resolution: "854x480",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/maharaja-480p-gdrive", speed: "Fast" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/maharaja-480p-hubcloud", speed: "High Speed" }
        ]
      },
      {
        quality: "720p HD",
        size: "1.1 GB",
        resolution: "1280x720",
        servers: [
          { name: "Fast Google Drive", url: "https://moviebaaz.baby/download/maharaja-720p-gdrive", speed: "Fast" },
          { name: "HubCloud Direct", url: "https://moviebaaz.baby/download/maharaja-720p-hubcloud", speed: "High Speed" }
        ]
      },
      {
        quality: "1080p FHD",
        size: "2.2 GB",
        resolution: "1920x1080",
        servers: [
          { name: "Fast Google Drive (VIP)", url: "https://moviebaaz.baby/download/maharaja-1080p-gdrive", speed: "Lightning 100MB/s" }
        ]
      }
    ],
    screenshots: [
      "/images/poster_detective_thriller.jpg"
    ],
    createdAt: "2024-12-15T08:00:00.000Z"
  }
];

export const INITIAL_ADS: AdsConfig = {
  masterAdsEnabled: true,
  slots: {
    header_banner: {
      id: "header_banner",
      name: "Header Leaderboard Ad (728x90 / Responsive)",
      position: "Under navigation bar, top of homepage and catalog",
      enabled: true,
      type: "custom_html",
      bannerUrl: "/images/hero_movie_banner.jpg",
      targetUrl: "https://moviebaaz.baby",
      customHtml: "<div style=\"background: linear-gradient(90deg, #1f1206, #3b200b); padding: 12px; border: 1px dashed #d97706; text-align: center; color: #fef3c7; font-size: 13px; font-weight: bold; border-radius: 8px;\"><span style=\"background:#b45309; padding: 2px 8px; border-radius: 4px; margin-right: 8px;\">HOT SPONSOR</span> Watch & Download Unlimited 4K Movies at 1Gbps! Fast GDrive Mirrors Online!</div>",
      label: "Advertisement"
    },
    infeed_grid: {
      id: "infeed_grid",
      name: "In-Feed Movie Grid Native Card",
      position: "Inserted seamlessly every 6th card in the movie browse grid",
      enabled: true,
      type: "banner",
      bannerUrl: "/images/hero_movie_banner.jpg",
      targetUrl: "https://t.me/moviebaaz_official",
      customHtml: "<div style=\"background: #181920; border: 1px solid #374151; padding: 20px; border-radius: 12px; text-align: center;\"><p style=\"color: #f59e0b; font-weight: bold; font-size: 16px; margin-bottom: 6px;\">⚡ Join Official MovieBaaz Telegram</p><p style=\"color: #9ca3af; font-size: 12px;\">Get instant direct Google Drive & Mega download links before release.</p><a href=\"https://t.me/moviebaaz_official\" target=\"_blank\" style=\"display: inline-block; margin-top: 12px; background: #2563eb; color: #ffffff; padding: 6px 16px; border-radius: 6px; font-size: 12px; font-weight: bold; text-decoration: none;\">Join Channel Now</a></div>",
      label: "Sponsored Content"
    },
    detail_top: {
      id: "detail_top",
      name: "Movie Details Page Header Ad",
      position: "Displayed right above player / storyline in the movie details view",
      enabled: true,
      type: "custom_html",
      bannerUrl: "",
      targetUrl: "https://moviebaaz.baby",
      customHtml: "<div style=\"background: #111319; border: 1px solid #1f2937; padding: 10px 16px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;\"><div style=\"display:flex; align-items:center; gap: 8px;\"><span style=\"background:#dc2626; color:white; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px;\">AD</span><span style=\"color:#e5e7eb; font-size:12px;\">High Speed Direct Cloud Mirror available for this movie!</span></div><a href=\"#download-section\" style=\"color:#fbbf24; font-size:12px; font-weight:bold; text-decoration:underline;\">Scroll to Download Links ↓</a></div>",
      label: "Partner Offer"
    },
    detail_download_pre: {
      id: "detail_download_pre",
      name: "Above Download Buttons High-Conversion Ad",
      position: "Placed immediately above the 480p, 720p, 1080p download servers",
      enabled: true,
      type: "custom_html",
      bannerUrl: "",
      targetUrl: "https://moviebaaz.baby",
      customHtml: "<div style=\"background: #151821; border: 1px solid #f59e0b44; padding: 14px; border-radius: 8px; text-align: center; margin-bottom: 12px;\"><p style=\"color: #fbbf24; font-weight: 700; font-size: 13px; margin: 0 0 4px 0;\">🚀 1-Click Fast Direct Download Available (No Waiting Time)</p><p style=\"color: #9ca3af; font-size: 11px; margin: 0;\">Click any link below. If Google Drive quota is exceeded, use the HubCloud or Mega server mirrors.</p></div>",
      label: "Download Notice & Sponsor"
    },
    floating_footer: {
      id: "floating_footer",
      name: "Sticky Footer Mobile & Desktop Ad",
      position: "Fixed at the bottom edge of the screen with dismiss button",
      enabled: false,
      type: "custom_html",
      bannerUrl: "",
      targetUrl: "https://moviebaaz.baby",
      customHtml: "<div style=\"display: flex; align-items: center; justify-content: center; gap: 12px; padding: 8px 16px; background: #0f172a; border-top: 1px solid #334155; color: #e2e8f0; font-size: 12px;\"><span>🔥 Latest South Indian Dubbed Movies in 1080p 60FPS!</span><a href=\"#\" style=\"background: #f59e0b; color: #000; font-weight: bold; padding: 4px 12px; border-radius: 4px; text-decoration: none;\">Explore</a></div>",
      label: "Bottom Sticky"
    },
    popunder_script: {
      id: "popunder_script",
      name: "Popunder / Direct Link Ad Code Snippet",
      position: "Injected into public pages on first user click (Adsterra / PropellerAds format)",
      enabled: false,
      type: "script",
      bannerUrl: "",
      targetUrl: "https://example.com/direct-offer",
      customHtml: "<!-- Adsterra / PropellerAds popunder snippet -->\n<script type=\"text/javascript\">\n  // Put your Adsterra / PropellerAds JS script code here\n  console.log('Ad network popunder script loaded');\n</script>",
      label: "Ad Network Popunder"
    }
  },
  stats: {
    totalImpressions: 2840,
    totalClicks: 342,
    lastUpdated: "2025-01-10T12:00:00.000Z"
  }
};

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: "MovieBaaz",
  siteDomain: "moviebaaz.baby",
  siteTagline: "Watch & Download HD Movies, Series & Dual Audio Free",
  telegramChannel: "https://t.me/moviebaaz_official",
  telegramGroup: "https://t.me/moviebaaz_chat",
  noticeText: "📢 Welcome to MovieBaaz.baby! How to download? Just click on any quality (480p, 720p, 1080p) and choose Fast Google Drive or HubCloud. Join our Telegram for daily updates!",
  noticeEnabled: true,
  adminPin: "admin123",
  allowUserRequests: true,
  requests: [
    {
      id: "req-1",
      movieTitle: "Singham Again (2024)",
      requestedBy: "mariya@user.com",
      preferredQuality: "1080p FHD",
      status: "pending",
      date: "2025-01-09T14:22:00.000Z"
    },
    {
      id: "req-2",
      movieTitle: "Kantara: Chapter 1",
      requestedBy: "rahim@user.com",
      preferredQuality: "720p HD",
      status: "in-progress",
      date: "2025-01-08T09:15:00.000Z"
    }
  ],
  lastSynced: "2025-01-10T12:00:00.000Z"
};
