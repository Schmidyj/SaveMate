const { 
  fetchFromInstagramAPI, 
  fetchFromInstagramMediaAPI, 
  fetchFromInstagramFallbackAPI,
  fetchFromTikTokAPI, 
  fetchFromTikTokWebScraping,
  fetchFromTwitterAPI 
} = require('../../controllers/downloadController');

exports.handler = async (event, context) => {
  // Set timeout to 25 seconds (Netlify max is 30, but we want some buffer)
  context.callbackWaitsForEmptyEventLoop = false;
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    const path = event.path.replace('/.netlify/functions/download', '');
    const method = event.httpMethod;

    // Parse platform from request body first, then path, then default to 'auto'
    let platform = 'auto';
    
    if (requestPlatform && requestPlatform !== 'auto') {
      platform = requestPlatform;
    } else {
      // Extract platform from URL path as fallback
      const pathSegments = event.path.split('/');
      if (pathSegments.includes('instagram')) {
        platform = 'instagram';
      } else if (pathSegments.includes('tiktok')) {
        platform = 'tiktok';
      } else if (pathSegments.includes('twitter') || pathSegments.includes('x')) {
        platform = 'twitter';
      } else {
        // Default to auto-detect
        platform = 'auto';
      }
    }

    // Parse request body
    let body = {};
    if (event.body) {
      body = JSON.parse(event.body);
    }

    const { url, platform: requestPlatform } = body;

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    console.log(`🔍 Processing ${platform} download for URL: ${url}`);
    console.log(`📍 Function path: ${event.path}`);
    console.log(`🌐 Request origin: ${event.headers.origin || 'Unknown'}`);
    console.log(`🔑 RAPIDAPI_KEY set: ${process.env.RAPIDAPI_KEY ? 'Yes' : 'No'}`);

    let result;
    let processingError = null;
    
    try {
      if (platform === 'instagram') {
        console.log('📸 Using Instagram Media API');
        result = await fetchFromInstagramMediaAPI(url);
      } else if (platform === 'tiktok') {
        console.log('🎵 Using TikTok API');
        result = await fetchFromTikTokAPI(url);
      } else if (platform === 'twitter') {
        console.log('🐦 Using Twitter API');
        result = await fetchFromTwitterAPI(url);
      } else {
        console.log('🔍 Auto-detecting platform');
        // Auto-detect platform
        let detectedPlatform = 'unknown';
        if (url.includes('instagram.com')) {
          detectedPlatform = 'instagram';
        } else if (url.includes('tiktok.com')) {
          detectedPlatform = 'tiktok';
        } else if (url.includes('twitter.com') || url.includes('x.com')) {
          detectedPlatform = 'twitter';
        }
        
        console.log(`🔍 Detected platform: ${detectedPlatform}`);
        
        switch (detectedPlatform) {
          case 'instagram':
            result = await fetchFromInstagramMediaAPI(url);
            break;
          case 'tiktok':
            result = await fetchFromTikTokAPI(url);
            break;
          case 'twitter':
            result = await fetchFromTwitterAPI(url);
            break;
          default:
            throw new Error('Unsupported platform');
        }
      }
      
      console.log('✅ Download function completed successfully');
      console.log('📊 Result:', JSON.stringify(result, null, 2));
      
    } catch (downloadError) {
      console.error('❌ Download function failed:', downloadError);
      processingError = downloadError;
      result = {
        error: 'Download failed',
        message: downloadError.message || 'An error occurred during download',
        platform,
        url
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Serverless function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Download failed', 
        message: error.message || 'An unexpected error occurred' 
      })
    };
  }
};
