# SaveMate Netlify Deployment Guide

## 🚀 Deploy to Netlify

### Method 1: Deploy via Netlify Dashboard (Recommended)

1. **Push your code to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Add Netlify serverless functions"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Select your branch (usually `main`)

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `.`
   - **Functions directory**: `netlify/functions`

4. **Set Environment Variables**
   Go to Site Settings > Environment Variables and add:
   ```
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```

5. **Deploy!**
   - Click "Deploy site"
   - Wait for build to complete

### Method 2: Drag & Drop (Quick Test)

1. Run locally to build:
   ```bash
   npm run build
   ```

2. Drag the entire folder to Netlify's deploy area

### Method 3: Netlify CLI (Advanced)

```bash
# Install Netlify CLI (if you have permissions)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify
netlify init

# Deploy
netlify deploy --prod
```

## 🔧 Environment Variables

Set these in Netlify Dashboard > Site Settings > Environment Variables:

```
RAPIDAPI_KEY=your_actual_rapidapi_key_here
```

## 📁 File Structure for Netlify

```
/
├── index.html                    # Frontend
├── netlify.toml                 # Netlify config
├── package.json                 # Dependencies
├── netlify/
│   └── functions/
│       ├── download.js          # Main API function
│       └── health.js            # Health check
├── controllers/
│   └── downloadController.js    # Business logic
└── config/
    └── api.js                   # API configs
```

## 🔍 Testing Your Deployment

1. **Health Check**: Visit `https://your-site.netlify.app/.netlify/functions/health`

2. **Test Download**: Use the web interface to test downloads

3. **Check Logs**: Go to Netlify Dashboard > Functions > View logs

## 🐛 Troubleshooting

### Common Issues:

1. **"Function not found"**
   - Check that `netlify/functions/` directory exists
   - Verify `netlify.toml` configuration

2. **CORS errors**
   - Functions already have CORS headers configured
   - Check browser console for specific errors

3. **API key issues**
   - Verify environment variables are set correctly
   - Check function logs in Netlify dashboard

4. **"Download failed"**
   - Check function logs for detailed error messages
   - Verify RapidAPI key is valid and has credits

### Debug Steps:

1. Check Netlify function logs
2. Test health endpoint
3. Verify environment variables
4. Check browser console for frontend errors

## 📞 Support

If you encounter issues:
1. Check Netlify function logs
2. Verify all files are committed
3. Ensure environment variables are set
4. Test with a simple URL first
