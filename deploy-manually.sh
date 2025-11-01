#!/bin/bash

echo "🚀 MANUAL DEPLOYMENT SCRIPT"
echo "============================"

# Step 1: Clean build
echo "📦 Cleaning previous builds..."
rm -rf client/dist
rm -rf node_modules/.vite

# Step 2: Install dependencies
echo "📥 Installing dependencies..."
cd client && npm install && cd ..

# Step 3: Build with fresh cache
echo "🔨 Building with fresh cache..."
cd client && npm run build && cd ..

# Step 4: Verify build output
echo "🔍 Verifying build output..."
if [ -d "client/dist" ]; then
    echo "✅ Build successful!"
    echo "📁 Build files:"
    ls -la client/dist/
    echo "📄 Asset files:"
    ls -la client/dist/assets/
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🎯 NEXT STEPS:"
echo "1. Drag the 'client/dist' folder to your Netlify dashboard"
echo "2. This will create a manual deployment"
echo "3. OR configure Netlify with these settings:"
echo ""
echo "Build Settings:"
echo "- Build command: npm run build:client"
echo "- Publish directory: client/dist" 
echo "- Node version: 18"
echo ""
echo "Environment Variables:"
echo "- VITE_API_BASE_URL=https://tinnie-house-records.bookings-machado.workers.dev"
echo "- VITE_AUDIO_BASE=https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com/tinnie-house-records"
echo ""
echo "✅ Ready for manual deployment!"