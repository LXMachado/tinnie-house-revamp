# Cloudflare Workers Migration Guide

This guide walks you through migrating from Railway to Cloudflare Workers for your Tinnie House Records backend API.

## Overview

**Why Cloudflare Workers?**
- **Free tier**: 100,000 requests/day (perfect for your use case)
- **Global edge**: Reduced latency worldwide
- **Serverless**: No server management required
- **TypeScript support**: Built-in support
- **Perfect fit**: Your CRUD API is ideal for Workers

## Migration Status ✅

- ✅ Cloudflare Workers configuration created (`wrangler.toml`)
- ✅ Express.js converted to Workers fetch handler (`src/worker.ts`)
- ✅ Database connections adapted for Workers environment
- ✅ Route handlers converted to Workers-compatible format
- ✅ CORS and environment variables configured
- ✅ Build scripts updated
- ⏳ Testing and deployment

## Prerequisites

1. **Cloudflare Account**: Create a free account at [cloudflare.com](https://cloudflare.com)
2. **Supabase Setup**: Ensure your Supabase project is configured
3. **Wrangler CLI**: Install globally: `npm install -g wrangler`

## Environment Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Option 1: Supabase (Recommended)
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_DB_URL=your-supabase-database-url

# Option 2: PostgreSQL (Alternative)
# DATABASE_URL=postgresql://username:password@host:port/database

# Workers Configuration
NODE_ENV=production
API_VERSION=1.0.0
```

### 3. Set Cloudflare Workers Environment Variables

```bash
# Set production variables
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put DATABASE_URL
```

## Development

### Local Development
```bash
# Start Workers development server
npm run dev:worker

# Start Express.js development (backup)
npm run dev
```

### Testing the Migration
```bash
# Test locally
npm run dev:worker

# Test endpoints
curl http://localhost:8787/health
curl http://localhost:8787/api
curl http://localhost:8787/api/releases
```

## Deployment

### 1. Login to Cloudflare
```bash
wrangler login
```

### 2. Deploy to Production
```bash
# Deploy to Cloudflare Workers
npm run deploy:cloudflare

# Or manually
npm run build:worker
wrangler deploy --env production
```

### 3. Verify Deployment
```bash
# Test production endpoint
curl https://your-worker-subdomain.workers.dev/health
```

## API Endpoints

All existing API endpoints work the same way:

- `GET /health` - Health check
- `GET /api` - API information
- `GET /api/releases` - All releases
- `GET /api/releases/featured` - Featured releases
- `GET /api/releases/catalog` - Catalog releases
- `GET /api/releases/latest` - Latest release
- `GET /api/releases/:id` - Single release
- `POST /api/releases` - Create release
- `GET /api/artists` - All artists
- `GET /api/artists/:id` - Single artist
- `POST /api/artists` - Create artist
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact submissions

## Key Changes from Express.js to Workers

### 1. **Server Structure**
- **Before**: Express.js server with middleware
- **After**: Fetch handler with request/response pattern

### 2. **Database Access**
- **Before**: Direct database connections (postgres, better-sqlite3)
- **After**: HTTP-based Supabase REST API calls

### 3. **Route Handling**
- **Before**: Express.js route handlers
- **After**: URL pattern matching with fetch handlers

### 4. **Error Handling**
- **Before**: Express error middleware
- **After**: Try-catch blocks with JSON responses

### 5. **Validation**
- **Before**: Zod schemas with Express middleware
- **After**: Simple validation functions

## Performance Benefits

- **Faster response times**: Edge computing vs. single server
- **Auto-scaling**: Handle traffic spikes automatically  
- **Reduced costs**: No server provisioning or maintenance
- **Global distribution**: Closest server to each user

## Monitoring

### Cloudflare Dashboard
- View request metrics
- Monitor performance
- Set up alerts

### Logs
```bash
# View worker logs
wrangler tail
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   ```bash
   wrangler secret list  # Check secrets
   wrangler secret put VAR_NAME  # Set missing vars
   ```

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check database URL format
   - Ensure database is accessible

3. **CORS Issues**
   - Check allowed origins in worker code
   - Verify request headers

4. **Build Issues**
   ```bash
   npm run build:worker  # Test build locally
   ```

## Rollback Plan

If issues occur, you can quickly rollback to Railway:

1. **Keep Railway deployment active** during migration
2. **Test thoroughly** on Cloudflare Workers first
3. **Switch DNS** only after full validation
4. **Monitor** for 24-48 hours before decommissioning Railway

## Next Steps

1. **Test thoroughly** in staging environment
2. **Deploy to production** on Cloudflare Workers
3. **Update DNS** to point to Workers
4. **Monitor** performance and costs
5. **Decommission** Railway when confident

## Support

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

Your API should work seamlessly with the same endpoints and data, just faster and more reliably! 🚀