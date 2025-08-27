const axios = require('axios');
const apiConfig = require('../config/api');

// Auto-detect platform and download
async function downloadAuto(req, res) {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Detect platform
    let platform = 'unknown';
    if (url.includes('instagram.com')) {
      platform = 'instagram';
    } else if (url.includes('tiktok.com')) {
      platform = 'tiktok';
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      platform = 'twitter';
    }

    console.log(`🔍 Auto-detected platform: ${platform}`);

    // Route to appropriate downloader
    switch (platform) {
      case 'instagram':
        return await downloadInstagram(req, res);
      case 'tiktok':
        return await downloadTikTok(req, res);
      case 'twitter':
        return await downloadTwitter(req, res);
      default:
        return res.status(400).json({ error: 'Unsupported platform' });
    }
  } catch (error) {
    console.error('Auto-download error:', error);
    res.status(500).json({ error: `Failed to download: ${error.message}` });
  }
}

// Instagram downloader
async function downloadInstagram(req, res) {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log('📸 Processing Instagram URL:', url);
    
    // Check if it's a profile URL or post/reel URL
    const isProfileUrl = url.match(/instagram\.com\/[^\/]+\/?$/);
    
    if (isProfileUrl) {
      console.log('📸 Using Instagram Profile API');
      const result = await fetchFromInstagramAPI(url);
      res.json(result);
    } else {
      console.log('📸 Using Instagram Media API');
      const result = await fetchFromInstagramMediaAPI(url);
      res.json(result);
    }
  } catch (error) {
    console.error('Instagram download error:', error);
    res.status(500).json({ error: `Failed to download Instagram media: ${error.message}` });
  }
}

// TikTok downloader
async function downloadTikTok(req, res) {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log('🎵 Processing TikTok URL:', url);
    const result = await fetchFromTikTokAPI(url);
    res.json(result);
  } catch (error) {
    console.error('TikTok download error:', error);
    res.status(500).json({ error: `Failed to download TikTok media: ${error.message}` });
  }
}

// Twitter downloader
async function downloadTwitter(req, res) {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log('🐦 Processing Twitter/X URL:', url);
    console.log('🐦 Using URL directly:', url);
    const result = await fetchFromTwitterAPI(url);
    res.json(result);
  } catch (error) {
    console.error('Twitter download error:', error);
    res.status(500).json({ error: `Failed to download Twitter/X media: ${error.message}` });
  }
}

// Instagram API functions
async function fetchFromInstagramAPI(url) {
  try {
    console.log('🔑 Using Instagram Profile API');
    console.log('URL to download:', url);
    
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `${apiConfig.instagram.baseUrl}${apiConfig.instagram.endpoints.download}?Userinfo=${encodedUrl}`;
    
    const options = {
      method: 'GET',
      url: apiUrl,
      headers: {
        'X-RapidAPI-Key': apiConfig.instagram.key,
        'X-RapidAPI-Host': apiConfig.instagram.host
      },
      timeout: 30000
    };

    console.log('Making request to:', options.url);

    const response = await axios.request(options);
    
    console.log('Instagram API Response Status:', response.status);
    console.log('Instagram API Response Data:', response.data);
    
    if (response.data && response.data.error) {
      throw new Error(`Instagram API Error: ${response.data.error}`);
    }
    
    return {
      success: true,
      platform: 'instagram',
      mediaUrl: response.data.url || response.data.download_url,
      thumbnail: response.data.thumbnail || null,
      title: response.data.title || 'Instagram Post',
      duration: response.data.duration || null
    };
  } catch (error) {
    console.error('Instagram Profile API error:', error.response?.data || error.message);
    throw new Error(`Failed to fetch from Instagram Profile API: ${error.message}`);
  }
}

async function fetchFromInstagramMediaAPI(url) {
  // Try the primary Instagram Media API first
  try {
    console.log('🔑 Trying Instagram Media API (Primary)');
    console.log('URL to download:', url);
    
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `${apiConfig.instagramMedia.baseUrl}${apiConfig.instagramMedia.endpoints.download}?url=${encodedUrl}`;
    
    const options = {
      method: 'GET',
      url: apiUrl,
      headers: {
        'X-RapidAPI-Key': apiConfig.instagramMedia.key,
        'X-RapidAPI-Host': apiConfig.instagramMedia.host
      },
      timeout: 30000
    };

    console.log('Making request to:', options.url);

    const response = await axios.request(options);
    
    console.log('Instagram Media API Response Status:', response.status);
    
    if (response.data && response.data.error) {
      throw new Error(`Instagram Media API Error: ${response.data.error}`);
    }
    
    // Check if we got media data
    if (response.data && response.data.media && response.data.media.length > 0) {
      const media = response.data.media[0];
      return {
        success: true,
        platform: 'instagram',
        mediaUrl: media.url,
        thumbnail: media.thumbnail || null,
        title: response.data.title || 'Instagram Post',
        duration: media.duration || null,
        quality: media.quality || 'HD'
      };
    } else if (response.data && response.data.url) {
      return {
        success: true,
        platform: 'instagram',
        mediaUrl: response.data.url,
        thumbnail: response.data.thumbnail || null,
        title: response.data.title || 'Instagram Post',
        duration: response.data.duration || null
      };
    } else {
      throw new Error('No media found in response');
    }
  } catch (error) {
    console.error('Instagram Media API error (Primary):', error.response?.data || error.message);
    
    // Try fallback API
    try {
      console.log('🔄 Trying Instagram Fallback API');
      return await fetchFromInstagramFallbackAPI(url);
    } catch (fallbackError) {
      console.error('Instagram Fallback API error:', fallbackError.response?.data || fallbackError.message);
      throw new Error(`Failed to fetch from Instagram APIs: ${error.message}`);
    }
  }
}

async function fetchFromInstagramFallbackAPI(url) {
  try {
    console.log('🔑 Using Instagram Fallback API');
    
    // Extract shortcode from URL
    const shortcodeMatch = url.match(/instagram\.com\/(?:p|reel)\/([^/?]+)/);
    if (!shortcodeMatch) {
      throw new Error('Could not extract shortcode from Instagram URL');
    }
    
    const shortcode = shortcodeMatch[1];
    const apiUrl = `${apiConfig.instagramFallback.baseUrl}${apiConfig.instagramFallback.endpoints.download}?shortcode=${shortcode}`;
    
    const options = {
      method: 'GET',
      url: apiUrl,
      headers: {
        'X-RapidAPI-Key': apiConfig.instagramFallback.key,
        'X-RapidAPI-Host': apiConfig.instagramFallback.host
      },
      timeout: 30000
    };

    console.log('Making request to:', options.url);

    const response = await axios.request(options);
    
    console.log('Instagram Fallback API Response Status:', response.status);
    
    if (response.data && response.data.error) {
      throw new Error(`Instagram Fallback API Error: ${response.data.error}`);
    }
    
    // Process the fallback API response
    if (response.data && response.data.media_url) {
      return {
        success: true,
        platform: 'instagram',
        mediaUrl: response.data.media_url,
        thumbnail: response.data.thumbnail_url || null,
        title: response.data.caption || 'Instagram Post',
        duration: null
      };
    } else {
      throw new Error('No media found in fallback API response');
    }
  } catch (error) {
    console.error('Instagram Fallback API error:', error.response?.data || error.message);
    throw new Error(`Failed to fetch from Instagram Fallback API: ${error.message}`);
  }
}

// TikTok API function using free services
async function fetchFromTikTokAPI(url) {
  console.log('🎵 Processing TikTok URL with free services:', url);
  
  // Try free TikTok downloader service first
  try {
    console.log('🔑 Trying TikTok Downloader (Free Service)');
    
    const response = await axios.post('https://www.tikwm.com/api/', 
      `url=${encodeURIComponent(url)}&hd=1`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 30000
      }
    );
    
    console.log('TikTok Downloader Response Status:', response.status);
    console.log('TikTok Downloader Response Data:', response.data);
    
    if (response.data && response.data.code === 0 && response.data.data) {
      const data = response.data.data;
      return {
        success: true,
        platform: 'tiktok',
        mediaUrl: data.hdplay || data.play || data.wmplay,
        thumbnail: data.cover || null,
        title: data.title || 'TikTok Video',
        duration: data.duration || null,
        quality: data.hdplay ? 'HD' : 'Standard'
      };
    } else if (response.data && response.data.msg) {
      console.log('TikTok Downloader Error:', response.data.msg);
    }
  } catch (error) {
    console.error('TikTok Downloader error:', error.response?.data || error.message);
  }
  
  // Try alternative TikTok downloader service
  try {
    console.log('🔑 Trying Alternative TikTok Downloader');
    
    const response = await axios.get(`https://api.tikwm.com/download`, {
      params: {
        url: url,
        format: 'hd'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000
    });
    
    if (response.data && response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        success: true,
        platform: 'tiktok',
        mediaUrl: data.hdplay || data.play || data.wmplay,
        thumbnail: data.cover || null,
        title: data.title || 'TikTok Video',
        duration: data.duration || null,
        quality: data.hdplay ? 'HD' : 'Standard'
      };
    }
  } catch (error) {
    console.error('Alternative TikTok Downloader error:', error.response?.data || error.message);
  }
  
  // Try oEmbed as fallback (only provides thumbnail)
  try {
    console.log('🔑 Trying TikTok oEmbed API (thumbnail only)');
    
    // Extract video ID from URL
    const videoIdMatch = url.match(/video\/(\d+)/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      const oembedUrl = `https://www.tiktok.com/oembed?video_id=${videoId}`;
      
      const response = await axios.get(oembedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 15000
      });
      
      if (response.data && response.data.thumbnail_url) {
        return {
          success: true,
          platform: 'tiktok',
          mediaUrl: response.data.thumbnail_url, // oEmbed only provides thumbnail
          thumbnail: response.data.thumbnail_url,
          title: response.data.title || 'TikTok Video',
          duration: null,
          quality: 'Thumbnail Only',
          message: 'Video download unavailable. Only thumbnail available.'
        };
      }
    }
  } catch (error) {
    console.error('TikTok oEmbed API error:', error.response?.data || error.message);
  }
  
  // Try RapidAPI as last resort (might work for some users)
  try {
    console.log('🔑 Trying RapidAPI TikTok (last resort)');
    
    const response = await axios.get('https://tiktok-video-no-watermark.p.rapidapi.com/', {
      params: { url: url },
      headers: {
        'X-RapidAPI-Key': '69b14084damsh198d7c4f03f0828p199beajsnf118fe244f7f',
        'X-RapidAPI-Host': 'tiktok-video-no-watermark.p.rapidapi.com'
      },
      timeout: 15000
    });
    
    if (response.data && response.data.data && (response.data.data.play || response.data.data.wmplay)) {
      return {
        success: true,
        platform: 'tiktok',
        mediaUrl: response.data.data.play || response.data.data.wmplay,
        thumbnail: response.data.data.cover || null,
        title: response.data.data.title || 'TikTok Video',
        duration: response.data.data.duration || null,
        quality: 'Standard'
      };
    }
  } catch (error) {
    console.error('RapidAPI TikTok error:', error.response?.data || error.message);
  }
  
     // Final fallback: try web scraping
   try {
     console.log('🔄 Trying web scraping fallback for TikTok...');
     return await fetchFromTikTokWebScraping(url);
   } catch (scrapingError) {
     throw new Error(`TikTok download is currently unavailable. TikTok frequently updates their platform to prevent downloads. Please try again later or use a different video.`);
   }
}

// Web scraping fallback for TikTok
async function fetchFromTikTokWebScraping(url) {
  try {
    console.log('🌐 Using TikTok web scraping fallback');
    
    // Try to get the page content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 20000
    });

    const html = response.data;
    
    // Look for video URL patterns in the page source (updated for current TikTok structure)
    const videoPatterns = [
      /"downloadAddr":"([^"]+)"/g,
      /"playAddr":"([^"]+)"/g,
      /"playUrl":"([^"]+)"/g,
      /"video":{"playAddr":"([^"]+)"/g,
      /"playUrl":"([^"]*\.mp4[^"]*)"/g,
      /"url":"([^"]*\.mp4[^"]*)"/g,
      /"src":"([^"]*\.mp4[^"]*)"/g,
      /href="([^"]*\.mp4[^"]*)"/g
    ];

    let mediaUrl = null;
    for (const pattern of videoPatterns) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        mediaUrl = matches[0].replace(/\\u002F/g, '/').replace(/"/g, '');
        // Clean up the URL
        if (mediaUrl.includes('playUrl":"')) {
          mediaUrl = mediaUrl.replace('playUrl":"', '').replace('"', '');
        }
        if (mediaUrl.includes('url":"')) {
          mediaUrl = mediaUrl.replace('url":"', '').replace('"', '');
        }
        break;
      }
    }

    if (!mediaUrl) {
      // Try to find any MP4 URL in the HTML
      const mp4Match = html.match(/https:\/\/[^"'\s]*\.mp4[^"'\s]*/g);
      if (mp4Match && mp4Match.length > 0) {
        mediaUrl = mp4Match[0];
      }
    }

    if (!mediaUrl) {
      throw new Error('Could not extract video URL from TikTok page. TikTok may have updated their structure.');
    }

    return {
      success: true,
      platform: 'tiktok',
      mediaUrl: mediaUrl,
      thumbnail: null,
      title: 'TikTok Video (Scraped)',
      duration: null,
      quality: 'Unknown'
    };
  } catch (error) {
    console.error('TikTok web scraping error:', error.message);
    throw new Error(`Failed to scrape TikTok page: ${error.message}`);
  }
}

// Twitter API function
async function fetchFromTwitterAPI(url) {
  try {
    console.log('🔑 Using Twitter Video Downloader API');
    console.log('URL to download:', url);
    
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `${apiConfig.twitter.baseUrl}${apiConfig.twitter.endpoints.download}?url=${encodedUrl}`;
    
    const options = {
      method: 'GET',
      url: apiUrl,
      headers: {
        'X-RapidAPI-Key': apiConfig.twitter.key,
        'X-RapidAPI-Host': apiConfig.twitter.host
      },
      timeout: 30000
    };

    console.log('Making request to:', options.url);

    const response = await axios.request(options);
    
    console.log('Twitter API Response Status:', response.status);
    console.log('Twitter API Response Data:', response.data);
    
    // Handle the Twitter API response
    if (response.data && response.data.error) {
      throw new Error(`Twitter API Error: ${response.data.error}`);
    } else if (response.data && response.data.media && response.data.media.length > 0) {
      const bestMedia = response.data.media[0];
      return {
        success: true,
        platform: 'twitter',
        mediaUrl: bestMedia.url,
        thumbnail: bestMedia.thumbnail || response.data.thumbnail || null,
        title: response.data.text || 'Twitter Post',
        duration: null,
        quality: bestMedia.quality || 'HD',
        extension: bestMedia.type || 'mp4',
        allMedia: response.data.media.map(item => ({
          url: item.url,
          quality: item.quality || 'HD',
          extension: item.type || 'mp4',
          videoAvailable: item.type === 'video'
        }))
      };
    } else if (response.data && response.data.url) {
      return {
        success: true,
        platform: 'twitter',
        mediaUrl: response.data.url,
        thumbnail: response.data.thumbnail || null,
        title: response.data.title || 'Twitter Post',
        duration: response.data.duration || null
      };
    } else {
      console.log('Unexpected response format:', response.data);
      throw new Error('Twitter API returned unexpected response format');
    }
  } catch (error) {
    console.error('Twitter API error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw new Error(`Failed to fetch from Twitter API: ${error.message}`);
  }
}

module.exports = {
  downloadAuto,
  downloadInstagram,
  downloadTikTok,
  downloadTwitter
};
