const axios = require('axios');
const apiConfig = require('../../config/api');

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
    const results = {
      environment: {
        RAPIDAPI_KEY: process.env.RAPIDAPI_KEY ? 'Set' : 'Not set',
        NODE_ENV: process.env.NODE_ENV || 'Not set'
      },
      apiTests: {}
    };

    // Test Instagram API
    try {
      console.log('🧪 Testing Instagram API...');
      const instagramUrl = 'https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/convert?url=https%3A%2F%2Fwww.instagram.com%2Freel%2FDNzK3pX0Klz%2F%3Figsh%3DMTdheW1hdzM1cGF4Mg%3D%3D';
      const response = await axios.get(instagramUrl, {
        headers: {
          'X-RapidAPI-Key': apiConfig.instagramMedia.key,
          'X-RapidAPI-Host': apiConfig.instagramMedia.host
        },
        timeout: 10000
      });
      
      results.apiTests.instagram = {
        status: 'success',
        statusCode: response.status,
        hasMedia: !!(response.data && response.data.media && response.data.media.length > 0),
        error: response.data && response.data.error ? response.data.error : null
      };
    } catch (error) {
      results.apiTests.instagram = {
        status: 'error',
        error: error.message,
        statusCode: error.response?.status,
        data: error.response?.data
      };
    }

    // Test Twitter API
    try {
      console.log('🧪 Testing Twitter API...');
      const twitterUrl = 'https://twitter-video-and-image-downloader.p.rapidapi.com/twitter?url=https%3A%2F%2Fx.com%2F_vybs_%2Fstatus%2F1960344664562597979';
      const response = await axios.get(twitterUrl, {
        headers: {
          'X-RapidAPI-Key': apiConfig.twitter.key,
          'X-RapidAPI-Host': apiConfig.twitter.host
        },
        timeout: 10000
      });
      
      results.apiTests.twitter = {
        status: 'success',
        statusCode: response.status,
        hasMedia: !!(response.data && response.data.media && response.data.media.length > 0),
        error: response.data && response.data.error ? response.data.error : null
      };
    } catch (error) {
      results.apiTests.twitter = {
        status: 'error',
        error: error.message,
        statusCode: error.response?.status,
        data: error.response?.data
      };
    }

    // Test TikTok free API
    try {
      console.log('🧪 Testing TikTok free API...');
      const response = await axios.post('https://www.tikwm.com/api/', {
        url: 'https://www.tiktok.com/@tiktok/video/7345641864513801518'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      results.apiTests.tiktok = {
        status: 'success',
        statusCode: response.status,
        hasMedia: !!(response.data && response.data.data && response.data.code === 0),
        error: response.data && response.data.msg ? response.data.msg : null
      };
    } catch (error) {
      results.apiTests.tiktok = {
        status: 'error',
        error: error.message,
        statusCode: error.response?.status,
        data: error.response?.data
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'API test results',
        timestamp: new Date().toISOString(),
        ...results
      })
    };

  } catch (error) {
    console.error('API test function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'API test failed',
        message: error.message
      })
    };
  }
};
