const { downloadAuto, downloadInstagram, downloadTikTok, downloadTwitter } = require('../../controllers/downloadController');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
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

    // Parse URL parameters
    let platform = 'auto';
    if (path.includes('/instagram')) {
      platform = 'instagram';
    } else if (path.includes('/tiktok')) {
      platform = 'tiktok';
    } else if (path.includes('/twitter')) {
      platform = 'twitter';
    } else if (path.includes('/x')) {
      platform = 'twitter';
    }

    // Parse request body
    let body = {};
    if (event.body) {
      body = JSON.parse(event.body);
    }

    const { url } = body;

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    console.log(`🔍 Processing ${platform} download for URL: ${url}`);

    let result;
    
    if (platform === 'instagram') {
      result = await downloadInstagram(url);
    } else if (platform === 'tiktok') {
      result = await downloadTikTok(url);
    } else if (platform === 'twitter') {
      result = await downloadTwitter(url);
    } else {
      result = await downloadAuto(url);
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
