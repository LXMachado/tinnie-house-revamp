# Netlify Deployment Guide

## Frontend Deployment to Netlify

### Status: ✅ Ready to Deploy
- ✅ Build completed successfully
- ✅ API endpoints updated to use Cloudflare Workers
- ✅ Environment variables configured

### Build Output Location
The frontend build is ready in: `/client/dist/`

### Manual Deployment Steps

#### Option 1: Drag & Drop (Recommended)
1. **Go to [netlify.com](https://netlify.com)** and log in
2. **Click "Sites" → "Deploy manually"**
3. **Drag the entire `client/dist` folder** to the deployment area
4. **Wait for deployment to complete** (usually 1-2 minutes)
5. **Your site will be live** with a random URL like `amazing-site-123456.netlify.app`

#### Option 2: Netlify CLI (if permissions fixed)
```bash
# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod --dir=client/dist
```

### Environment Variables Setup
After deployment, you need to set environment variables:

1. **Go to your Netlify site dashboard**
2. **Navigate to Site Settings → Environment Variables**
3. **Add the following variables:**
   ```
   VITE_API_BASE_URL=https://tinnie-house-records.bookings-machado.workers.dev
   VITE_AUDIO_BASE=https://media.tinniehouserecords.com/audio
   ```
4. **Save and redeploy** the site

### Custom Domain (Optional)
To use a custom domain:
1. **Go to Site Settings → Domain Management**
2. **Add your custom domain** (e.g., `tinniehouserecords.com`)
3. **Configure DNS** as instructed by Netlify
4. **SSL certificate** will be automatically provisioned

### Verification Steps

#### 1. Test Basic Functionality
Visit your deployed site and verify:
- [ ] Home page loads correctly
- [ ] Releases section displays data from API
- [ ] Artists section loads properly
- [ ] Contact form works
- [ ] Navigation works

#### 2. Test API Connectivity
Open browser Developer Tools (F12) and check:
- [ ] Network requests to `*.workers.dev` succeed
- [ ] No CORS errors
- [ ] Console shows successful API responses

#### 3. Test Performance
- [ ] Page loads in under 3 seconds
- [ ] Images load correctly
- [ ] No 404 errors for assets

### Troubleshooting

#### Common Issues:

1. **Environment Variables Not Working**
   - Ensure variable names start with `VITE_`
   - Redeploy after adding variables
   - Check Netlify function logs

2. **API Calls Failing**
   - Verify `VITE_API_BASE_URL` is correct
   - Check CORS configuration in Cloudflare Workers
   - Test API endpoint directly in browser

3. **Build Issues**
   - Check `netlify.toml` configuration
   - Verify build command and publish directory

4. **Asset Loading Problems**
   - Ensure all files in `client/dist` are deployed
   - Check for missing images or audio files

### Expected Results
After successful deployment:
- **Frontend URL**: `https://your-site-name.netlify.app`
- **Backend API**: `https://tinnie-house-records.bookings-machado.workers.dev`
- **Full functionality**: Releases, artists, contact form, music player

### Next Steps
1. Deploy to Netlify using the drag & drop method
2. Configure environment variables
3. Test all functionality
4. Optional: Set up custom domain
5. Optional: Set up Netlify Forms for contact submissions

Your Tinnie House Records website will be live and connected to your Cloudflare Workers backend! 🎉