# SaveMate - Social Media Downloader

A beautiful and modern web application for downloading media from popular social media platforms including Instagram, TikTok, and Twitter/X.

## ✨ Features

- **Multi-Platform Support**: Download from Instagram, TikTok, and Twitter/X
- **Auto-Detection**: Automatically detects the platform based on the URL
- **RapidAPI Integration**: Uses reliable third-party APIs for consistent results
- **Multiple API Fallbacks**: Different API endpoints for better success rates
- **Automatic Fallback System**: If one API fails, automatically tries alternatives
- **Web Scraping Fallback**: Last resort web scraping for TikTok when APIs fail
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Real-time Processing**: Live feedback during download process
- **Comprehensive Error Handling**: Detailed error messages and user feedback
- **Cross-Platform**: Works on desktop and mobile devices
- **Modular Architecture**: Clean, maintainable code structure

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   # If you have git installed
   git clone <repository-url>
   cd SaveMate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3001`

## 📱 How to Use

1. **Open the application** in your web browser
2. **Paste a social media URL** from one of the supported platforms:
   - Instagram: `https://www.instagram.com/p/...` ✅ Working
   - TikTok: `https://www.tiktok.com/@.../video/...` ⚠️ Limited (platform restrictions)
   - Twitter/X: `https://twitter.com/.../status/...` ✅ Working
3. **Select the platform** (or leave as "Auto-Detect")
4. **Click "Download Now"**
5. **Wait for processing** and download your media!

## 🛠️ API Endpoints

### Download Media

#### Auto-Detect Platform
```
POST /api/download/auto
```

#### Platform-Specific Downloads
```
POST /api/download/instagram
POST /api/download/tiktok
POST /api/download/twitter
```

**Parameters:**
- `url`: The social media post URL

**Example:**
```bash
# Auto-detect platform
curl -X POST http://localhost:3001/api/download/auto \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.instagram.com/p/example/"}'

# Instagram specific
curl -X POST http://localhost:3001/api/download/instagram \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.instagram.com/p/example/"}'
```

### Health Check
```
GET /health
```

Returns server status and information.

## 🏗️ Project Structure

```
SaveMate/
├── index.html                    # Main frontend file
├── server.js                     # Express server entry point
├── package.json                  # Dependencies and scripts
├── config/
│   └── api.js                   # RapidAPI configuration
├── controllers/
│   └── downloadController.js    # Download logic for all platforms
├── routes/
│   └── downloadRoutes.js        # API route definitions
└── README.md                    # This file
```

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3001)

### Customization

You can customize the application by modifying:

- **Frontend**: Edit `index.html` to change the UI
- **Backend**: Modify `server.js` to add new platforms or change download logic
- **Styling**: Update the CSS in `index.html` or add custom styles

## ⚠️ Important Notes

### Legal and Ethical Considerations

- **Respect Copyright**: Only download content you have permission to access
- **Terms of Service**: Ensure you comply with each platform's terms of service
- **Rate Limiting**: Be mindful of API rate limits and server resources
- **Private Content**: This tool only works with public posts

### Technical Limitations

- **Platform Changes**: Social media platforms frequently update their APIs and structure
- **TikTok Limitations**: TikTok frequently updates their platform to prevent downloads. Success rates may vary.
- **Authentication**: Some content may require authentication or may be private
- **Geographic Restrictions**: Some content may be region-locked
- **Content Types**: Focuses on images and videos; other media types may not work

## 🐛 Troubleshooting

### Common Issues

1. **"Download Failed" Error**
   - Check if the URL is correct and the post is public
   - Try selecting the platform manually instead of auto-detect
   - Ensure the server is running properly

2. **"No Media Found" Error**
   - The post might not contain downloadable media
   - The media might be private or deleted
   - Platform structure may have changed

3. **Server Won't Start**
   - Ensure Node.js version 16+ is installed
   - Check if port 3001 is available
   - Verify all dependencies are installed

### Testing APIs

Test the APIs using the included test script:
```bash
node test-api.js
```

This will test all three platforms (Instagram, TikTok, Twitter) with sample URLs.

### Debug Mode

Run the server with additional logging:
```bash
DEBUG=* npm run dev
```

## 🔄 Updates and Maintenance

### Adding New Platforms

To add support for a new platform:

1. Add a new download function in `server.js`
2. Update the main download endpoint switch statement
3. Add the platform to the auto-detection logic
4. Update the frontend platform selector

### Keeping Up-to-Date

- Regularly update dependencies: `npm update`
- Monitor platform API changes
- Test with recent posts from each platform

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the error messages in the browser console
3. Check the server logs for detailed error information
4. Open an issue with detailed steps to reproduce the problem

---

**Disclaimer**: This tool is for educational purposes. Users are responsible for complying with all applicable laws and terms of service when downloading content.
