# Netlify Deployment Troubleshooting Guide

## 🎯 Current Issue
Your changes are on GitHub but not showing on the live Netlify site. The dev server works fine.

## 🔍 Step-by-Step Diagnosis

### 1. Build Settings Check
**Path:** Netlify Dashboard → Your Site → Site settings → Build & deploy → Build settings

**Required Settings:**
- **Build command:** `npm run build:client`
- **Publish directory:** `client/dist`
- **Node version:** `18`
- **Repository:** Connected to your GitHub repo
- **Branch:** `main` (or whichever branch you're pushing to)

### 2. Environment Variables
**Path:** Netlify Dashboard → Your Site → Site settings → Environment variables

**Required Variables:**
```
VITE_API_BASE_URL=https://tinnie-house-records.bookings-machado.workers.dev
VITE_AUDIO_BASE=https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com/tinnie-house-records
```

### 3. Recent Deployments
**Path:** Netlify Dashboard → Your Site → Deploys

**Check for:**
- ✅ **Build successful** (green checkmark)
- ❌ **Build failed** (red X) - check build logs
- ⚠️ **Build in progress** - wait for completion

### 4. CDN Cache Issues
**Solution:** Force clear cache
1. Go to Deploys → "Trigger deploy"
2. Select "Deploy site" (not "Deploy branch")
3. Check "Clear cache and start a fresh build"

## 🚨 Common Issues & Solutions

### Issue: "Build failed"
**Check logs in:** Deploys tab → Click on failed deployment → Build log

**Common causes:**
- Missing dependencies
- Incorrect build command
- Environment variables not set
- Build timeout

### Issue: "Deployment successful but no changes visible"
**Causes:**
- CDN cache not cleared
- Wrong publish directory
- Browser cache

**Solution:**
1. Force refresh browser (Ctrl+Shift+R)
2. Clear Netlify CDN cache (see step 4 above)
3. Check if deploy URL has changed

### Issue: "API calls failing"
**Check:**
- Environment variables are set correctly
- `VITE_API_BASE_URL` points to your Cloudflare Workers URL
- CORS settings allow requests from your Netlify domain

### Issue: "Old JavaScript/CSS files"
**Solution:**
1. Check build logs for asset compilation
2. Verify `client/dist/assets/` contains updated files
3. Clear Netlify CDN cache

## 🛠️ Manual Deployment Test

If auto-deploy isn't working, try manual deployment:

1. **Build locally:**
   ```bash
   cd client
   npm run build
   ```

2. **Check build output:**
   ```bash
   ls -la client/dist/assets/
   ```

3. **Deploy manually:**
   - Drag `client/dist` folder to Netlify dashboard
   - Or use `netlify deploy --prod --dir=client/dist`

## 📊 Verification Checklist

- [ ] GitHub repository connected to Netlify
- [ ] Build settings configured correctly
- [ ] Environment variables set
- [ ] Latest deployment successful
- [ ] Build logs reviewed (if failed)
- [ ] CDN cache cleared
- [ ] Browser cache cleared
- [ ] Network requests show correct API URL

## 🔄 Quick Fix Commands

If you can get Netlify CLI working:

```bash
# Clear Netlify CLI cache
netlify logout
netlify login

# Deploy manually
npm run build:client
netlify deploy --prod --dir=client/dist
```

## 📞 Support Resources

- **Netlify Support:** https://support.netlify.com
- **Community Forum:** https://community.netlify.com
- **Documentation:** https://docs.netlify.com

---

**Next Step:** Go through this checklist and let me know which step reveals the issue!