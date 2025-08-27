const { 
  fetchFromInstagramAPI, 
  fetchFromInstagramMediaAPI, 
  fetchFromInstagramFallbackAPI,
  fetchFromTikTokAPI, 
  fetchFromTikTokWebScraping,
  fetchFromTwitterAPI 
} = require('../../controllers/downloadController');

exports.handler = async (event, context) => {
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
    console.log('🚀 Download function called');
    
    // Parse request body
    let body = {};
    if (event.body) {
      body = JSON.parse(event.body);
    }

    const { url, platform: requestPlatform } = body;
    console.log('📥 Received request:', { url, platform: requestPlatform });

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    // Determine platform
    let platform = 'auto';
    if (requestPlatform && requestPlatform !== 'auto') {
      platform = requestPlatform;
    } else {
      // Auto-detect platform from URL
      if (url.includes('instagram.com')) {
        platform = 'instagram';
      } else if (url.includes('tiktok.com')) {
        platform = 'tiktok';
      } else if (url.includes('twitter.com') || url.includes('x.com')) {
        platform = 'twitter';
      }
    }

    console.log(`🔍 Processing ${platform} download for URL: ${url}`);
    console.log(`🌐 Request origin: ${event.headers.origin || 'Unknown'}`);
    console.log(`🔑 RAPIDAPI_KEY set: ${process.env.RAPIDAPI_KEY ? 'Yes' : 'No'}`);

    let result;
    
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
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result)
      };
      
    } catch (downloadError) {
      console.error('❌ Download function failed:', downloadError);
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Download failed',
          message: downloadError.message || 'An error occurred during download',
          platform,
          url
        })
      };
    }

  } catch (error) {
    console.error('Serverless function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error', 
        message: error.message || 'An unexpected error occurred' 
      })
    };
  }
};
