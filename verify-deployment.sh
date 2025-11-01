#!/bin/bash

# Netlify Deployment Verification Script
echo "🔍 Netlify Deployment Verification"
echo "=================================="

# Check if build exists and has recent timestamps
echo "📁 Checking build output..."
if [ -d "client/dist" ]; then
    echo "✅ client/dist directory exists"
    if [ -f "client/dist/assets/index-Co0wDIVS.css" ]; then
        echo "✅ CSS assets found"
        ls -la client/dist/assets/
    else
        echo "❌ CSS assets missing"
    fi
    if [ -f "client/dist/assets/index-DJHFkrFT.js" ]; then
        echo "✅ JS assets found"
        ls -la client/dist/assets/
    else
        echo "❌ JS assets missing"
    fi
else
    echo "❌ client/dist directory missing"
fi

echo ""
echo "🌐 Checking environment variables..."
# Check if environment variables are set in .env.production
if [ -f "client/.env.production" ]; then
    echo "✅ .env.production exists"
    echo "Environment variables:"
    cat client/.env.production
else
    echo "❌ .env.production missing"
fi

echo ""
echo "🔧 Checking package.json build scripts..."
echo "Build scripts:"
grep -A 10 "scripts" package.json

echo ""
echo "🔄 Checking git status..."
git status

echo ""
echo "🌍 Netlify CLI status..."
if command -v netlify &> /dev/null; then
    echo "✅ Netlify CLI installed"
    netlify status || echo "❌ Netlify CLI auth failed"
else
    echo "❌ Netlify CLI not installed"
fi

echo ""
echo "📝 Quick Actions:"
echo "1. Run: cd client && npm run build"
echo "2. Check Netlify dashboard for build settings"
echo "3. Verify environment variables in Netlify"
echo "4. Trigger manual deployment from Netlify dashboard"

echo ""
echo "🎯 Most likely causes:"
echo "- Build settings incorrect in Netlify dashboard"
echo "- Environment variables not set in Netlify"
echo "- CDN cache needs clearing"
echo "- Auto-deploy not connected to GitHub repo"