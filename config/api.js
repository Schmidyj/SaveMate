module.exports = {
  // Instagram APIs - Multiple fallbacks
  instagram: {
    key: process.env.RAPIDAPI_KEY || '69b14084damsh198d7c4f03f0828p199beajsnf118fe244f7f',
    host: 'instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com',
    baseUrl: 'https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com',
    endpoints: {
      download: '/'
    }
  },
  
  instagramMedia: {
    key: process.env.RAPIDAPI_KEY || '69b14084damsh198d7c4f03f0828p199beajsnf118fe244f7f',
    host: 'instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com',
    baseUrl: 'https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com',
    endpoints: {
      download: '/convert'
    }
  },

  // Instagram Fallback API
  instagramFallback: {
    key: process.env.RAPIDAPI_KEY || '69b14084damsh198d7c4f03f0828p199beajsnf118fe244f7f',
    host: 'instagram-bulk-profile-scrapper.p.rapidapi.com',
    baseUrl: 'https://instagram-bulk-profile-scrapper.p.rapidapi.com',
    endpoints: {
      download: '/clients/api/ig/media_by_shortcode'
    }
  },

  // TikTok - Using free third-party services instead of RapidAPI
  tiktok: {
    // We'll use direct API calls to free services instead of RapidAPI
    freeApis: [
      {
        name: 'TikTok Downloader (Free)',
        baseUrl: 'https://www.tikwm.com/api',
        endpoint: '/',
        method: 'POST'
      },
      {
        name: 'TikTok Scraper (Free)',
        baseUrl: 'https://tiktok-video-no-watermark.p.rapidapi.com',
        endpoint: '/',
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '69b14084damsh198d7c4f03f0828p199beajsnf118fe244f7f',
          'X-RapidAPI-Host': 'tiktok-video-no-watermark.p.rapidapi.com'
        }
      }
    ]
  },

  // Twitter API
  twitter: {
    key: process.env.RAPIDAPI_KEY || '69b14084damsh198d7c4f03f0828p199beajsnf118fe244f7f',
    host: 'twitter-video-and-image-downloader.p.rapidapi.com',
    baseUrl: 'https://twitter-video-and-image-downloader.p.rapidapi.com',
    endpoints: {
      download: '/twitter'
    }
  }
};
