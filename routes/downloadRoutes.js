const express = require('express');
const router = express.Router();
const {
  downloadAuto,
  downloadInstagram,
  downloadTikTok,
  downloadTwitter
} = require('../controllers/downloadController');

// Auto-detect and download
router.post('/auto', downloadAuto);

// Platform-specific downloads
router.post('/instagram', downloadInstagram);
router.post('/tiktok', downloadTikTok);
router.post('/twitter', downloadTwitter);

module.exports = router;
