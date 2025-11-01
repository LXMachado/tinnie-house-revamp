# 🚀 Quick Fix Commands

## 1. Test the Cloudflare Workers API
Your API should be working. Test it:

```bash
curl -s https://tinnie-house-records.bookings-machado.workers.dev/health
curl -s https://tinnie-house-records.bookings-machado.workers.dev/api/releases
```

## 2. Force Manual Deployment
Since CLI isn't working, try the manual method:

1. **Build locally:**
   ```bash
   npm run build:client
   ```

2. **Deploy manually via drag-and-drop:**
   - Go to your Netlify dashboard
   - Go to "Deploys" tab
   - Drag the `client/dist` folder to the deploy area
   - Wait for deployment to complete

## 3. Check Netlify Dashboard Settings
**Critical Settings to Verify:**

### Build Settings (Site settings → Build & deploy → Build settings)
- **Build command:** `npm run build:client`
- **Publish directory:** `client/dist`
- **Node version:** `18`

### Environment Variables (Site settings → Environment variables)
Add these exact variables:
```
VITE_API_BASE_URL=https://tinnie-house-records.bookings-machado.workers.dev
VITE_AUDIO_BASE=https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com/tinnie-house-records
```

### Auto-deploy (Site settings → Build & deploy → Link repository)
- Should be connected to your GitHub repo
- Branch: `main`

## 4. Clear CDN Cache
**Path:** Deploys → "Trigger deploy" → "Deploy site" → Check "Clear cache and start a fresh build"

## 5. Check Build Logs
**Path:** Deploys → Click on latest deployment → "Deploy log"

**Look for:**
- ✅ `npm run build:client` executed successfully
- ✅ `client/dist` directory created
- ✅ Assets generated
- ❌ Any error messages

---

**Most likely issue:** Environment variables not set in Netlify dashboard