# Tinnie House Records - Cost-Effective Deployment Guide

## 🏗️ Architecture Overview

```
Frontend (React)     → Netlify (Static Hosting)
                    ↓
Backend API (Node.js) → Railway (Free tier)
                    ↓
Database (PostgreSQL) → Supabase (Free tier)
```

## 💰 Cost Breakdown (Monthly)

| Service | Free Tier Limits | Cost |
|---------|------------------|------|
| **Netlify** | 100GB bandwidth, 300 build minutes | $0 |
| **Railway** | $5 credit/month (~10M requests) | $0 |
| **Supabase** | 500MB storage, 50K reads/day | $0 |
| **Total** | **Perfect for <1,000 visitors** | **$0** |

## 🚀 Why This Combination?

### ✅ Supabase Database (Already Integrated!)
- **Perfect fit**: You're already using `@supabase/supabase-js`
- **Cost**: Completely free for your use case
- **Performance**: Serverless PostgreSQL with instant scaling
- **Connection pooling**: Built-in WebSocket support
- **Additional features**: Built-in Auth, Storage, and Edge Functions

### ✅ Netlify Frontend Hosting
- **Zero configuration**: Works perfectly with Vite + React
- **CDN included**: Global edge network
- **Custom domains**: Easy setup (netlify.app subdomain initially)
- **SSL automatically**: HTTPS out of the box

### ✅ Railway Backend API
- **Node.js native**: Perfect for your Express server
- **Auto-deployments**: GitHub integration
- **Environment variables**: Secure config management
- **Database connections**: Works seamlessly with Neon

## 📊 Traffic Capacity

**Free tier supports:**
- ~10,000 monthly visitors
- ~50K database reads/day (Supabase)
- ~100GB bandwidth/month (Netlify)
- Perfect for music label website with limited initial traffic

## 🔄 Migration Path

When you grow beyond free tiers:
1. **Supabase**: $25/month for Pro (8GB storage)
2. **Railway**: $5/month for Hobby tier
3. **Netlify**: $19/month for Pro (unlimited bandwidth)

Total cost: $43/month vs $0 initially = **1000% ROI before paying!**
## 🚀 Step-by-Step Deployment Instructions

### Prerequisites
- GitHub account (for code repository)
- Accounts on [Railway](https://railway.app) and [Netlify](https://netlify.com)

### Step 1: Set Up Supabase Database (5 minutes)

1. **Create Supabase account** at [supabase.com](https://supabase.com)
2. **Create new project**: 
   - Name: `tinnie-house-db`
   - Choose closest region (Sydney for AU)
   - Select "Free plan"
3. **Get connection string**: 
   - Go to Settings → Database
   - Copy the connection string from dashboard
   - Format: `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require`
4. **Get API keys**: 
   - Go to Settings → API
   - Copy the anon/public key and service_role key

### Step 2: Deploy Backend to Railway (10 minutes)

1. **Connect GitHub**: Link your GitHub repository to Railway
2. **Create new project**: Choose "Deploy from GitHub repo"
3. **Add environment variables**:
   ```
   DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NODE_ENV=production
   PORT=3000
   ```
4. **Deploy**: Railway will automatically build and deploy
5. **Note your Railway URL**: `https://your-app.railway.app`

### Step 3: Deploy Frontend to Netlify (5 minutes)

1. **Connect GitHub**: Link repository to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `client/dist`
3. **Environment variables**:
   ```
   VITE_API_URL=https://your-app.railway.app
   ```
4. **Deploy**: Netlify will build and deploy automatically
5. **Your site URL**: `https://random-name.netlify.app`

### Step 4: Update Frontend Configuration (2 minutes)

Update your Vite config to point to Railway backend:

1. **Update client/src/lib/api.ts** (if exists):
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'https://your-app.railway.app';
   ```

## 🔧 Environment Setup Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Install Netlify CLI  
npm install -g netlify-cli

# Login to both services
railway login
netlify login

# Deploy commands
npm run deploy          # Deploy both frontend and backend
npm run deploy:railway  # Deploy only backend
npm run deploy:netlify  # Deploy only frontend
```

## 📊 Cost Breakdown & Scaling

### Current Setup ($0/month)
| Service | Usage | Cost |
|---------|-------|------|
| **Supabase Database** | 500MB storage, 50K reads/day | $0 |
| **Railway Backend** | $5 credit/month (~10M requests) | $0 |
| **Netlify Frontend** | 100GB bandwidth, 300 builds | $0 |
| **Total** | | **$0** |

### When to Upgrade (Traffic Triggers)

**Supabase Upgrade Triggers:**
- Storage > 500MB ($25/month for 8GB)
- Reads > 50K/day ($25/month for 500K reads)
- Need more concurrent connections
- Need Auth/Storage/Edge Functions

**Railway Upgrade Triggers:**
- Using > $5 credit/month ($5/month for Hobby)
- Need custom domains
- Need more CPU/memory

**Netlify Upgrade Triggers:**
- Bandwidth > 100GB/month ($19/month for Pro)
- Build minutes > 300/month
- Need advanced forms/analytics

## 🎯 Alternative: All-in-One Vercel

For simpler deployment, consider **Vercel** for everything:
- **Frontend**: Vercel (free tier)
- **Backend**: Vercel Serverless Functions (free tier)
- **Database**: Vercel Postgres or PlanetScale (free tier)

**Benefits**: One platform, easier setup
**Drawbacks**: Less flexible for backend complexity

## ✅ Final Checklist

- [ ] Database deployed on Supabase
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Netlify
- [ ] Environment variables configured
- [ ] API URLs updated in frontend
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] Performance monitoring set up

## 🆘 Troubleshooting

**Build failures:**
- Check build logs on each platform
- Ensure Node.js version compatibility (18.x)
- Verify environment variables are set

**Database connection issues:**
- Double-check Supabase connection string
- Ensure SSL mode is 'require'
- Test connection from local environment first
- Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct

**Frontend not connecting to backend:**
- Verify VITE_API_URL environment variable
- Check Railway domain is accessible
- Test API endpoints directly

Your total setup time: ~20 minutes for a professional, scalable website!