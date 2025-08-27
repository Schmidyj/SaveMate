exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    // Test environment variables
    const envVars = {
      RAPIDAPI_KEY: process.env.RAPIDAPI_KEY ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
      NETLIFY_DEV: process.env.NETLIFY_DEV || 'false'
    };

    // Test API configuration
    const apiConfig = require('../../config/api');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'Debug info retrieved',
        timestamp: new Date().toISOString(),
        environment: {
          ...envVars,
          functionRegion: process.env.AWS_REGION || 'Unknown'
        },
        request: {
          method: event.httpMethod,
          path: event.path,
          headers: event.headers,
          queryStringParameters: event.queryStringParameters || {}
        },
        apiConfig: {
          hasInstagram: !!apiConfig.instagram,
          hasTikTok: !!apiConfig.tiktok,
          hasTwitter: !!apiConfig.twitter
        }
      })
    };

  } catch (error) {
    console.error('Debug function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Debug function failed',
        message: error.message,
        stack: error.stack
      })
    };
  }
};
