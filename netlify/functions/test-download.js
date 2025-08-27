const { fetchFromInstagramMediaAPI } = require('../../controllers/downloadController');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    console.log('🧪 Testing Instagram download with known working URL...');
    
    const testUrl = 'https://www.instagram.com/reel/DNzK3pX0Klz/?igsh=MTdheW1hdzM1cGF4Mg==';
    const result = await fetchFromInstagramMediaAPI(testUrl);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Test completed successfully',
        timestamp: new Date().toISOString(),
        hasMediaUrl: !!result.mediaUrl,
        platform: result.platform,
        success: result.success,
        environment: {
          RAPIDAPI_KEY: process.env.RAPIDAPI_KEY ? 'Set' : 'Not set'
        }
      })
    };

  } catch (error) {
    console.error('Test function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Test failed',
        message: error.message,
        environment: {
          RAPIDAPI_KEY: process.env.RAPIDAPI_KEY ? 'Set' : 'Not set'
        }
      })
    };
  }
};
