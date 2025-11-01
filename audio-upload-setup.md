# Audio Files Upload Setup for Cloudflare R2

## Current Audio Files Available
The following audio files are in your `attached_assets/` folder:

1. **G.U.R.I - Aurora (Original Mix)_1749893208371.mp3** → should be uploaded as `guri/aurora.mp3`
2. **G.U.R.I - Magnetosphere (Original Mix)_1749893208371.mp3** → should be uploaded as `guri/magnetosphere.mp3`
3. **G.U.R.I - Morphing (Original Mix)_1749893208371.mp3** → should be uploaded as `guri/morphing.mp3`
4. **Rafa Kao - Stormdrifter_1749896025468.mp3** → should be uploaded as `rafa-kao/stormdrifter.mp3`
5. **Rafa Kao & Gabriel Samy - Ritual (Original Mix)_1749893959907.mp3** → should be uploaded as `rafa-kao-gabriel-samy/ritual.mp3`

## Cloudflare R2 Setup Steps

### 1. Configure Public Access
In your Cloudflare R2 dashboard:

1. Go to **R2 Object Storage**
2. Select your `tinnie-house-records` bucket
3. Go to **Settings** → **Bucket**
4. Enable **Public access**:
   - Turn on "Public access" 
   - This gives you a public bucket URL like: `https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com/tinnie-house-records`

### 2. Upload Audio Files

**Option A: Using Cloudflare Dashboard**
1. Go to R2 Object Storage → Your bucket
2. Create folders: `guri/`, `rafa-kao/`, `rafa-kao-gabriel-samy/`
3. Upload audio files with the correct names

**Option B: Using AWS CLI (if you have API keys)**
```bash
# Install AWS CLI and configure with R2 credentials
aws s3 cp "G.U.R.I - Aurora (Original Mix)_1749893208371.mp3" "s3://tinnie-house-records/guri/aurora.mp3" --endpoint-url "https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com"
aws s3 cp "G.U.R.I - Magnetosphere (Original Mix)_1749893208371.mp3" "s3://tinnie-house-records/guri/magnetosphere.mp3" --endpoint-url "https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com"
aws s3 cp "G.U.R.I - Morphing (Original Mix)_1749893208371.mp3" "s3://tinnie-house-records/guri/morphing.mp3" --endpoint-url "https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com"
aws s3 cp "Rafa Kao - Stormdrifter_1749896025468.mp3" "s3://tinnie-house-records/rafa-kao/stormdrifter.mp3" --endpoint-url "https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com"
aws s3 cp "Rafa Kao & Gabriel Samy - Ritual (Original Mix)_1749893959907.mp3" "s3://tinnie-house-records/rafa-kao-gabriel-samy/ritual.mp3" --endpoint-url "https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com"
```

### 3. Test Audio URLs
After uploading, test these URLs in your browser:
- `https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com/tinnie-house-records/guri/aurora.mp3`
- `https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com/tinnie-house-records/rafa-kao/stormdrifter.mp3`

### 4. Configure CORS (if needed)
In your R2 bucket settings, add this CORS configuration:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## Current Configuration
Your `client/.env` already has the correct Cloudflare R2 URL:
```
VITE_AUDIO_BASE=https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com/tinnie-house-records
```

The music player will automatically construct URLs like:
`https://19b166cf092ff3e510bb7cce8c8510e4.r2.cloudflarestorage.com/tinnie-house-records/guri/aurora.mp3`

## Alternative: Use Local Audio Files
If you prefer not to use Cloudflare R2, you can copy the audio files to `client/public/audio/` and update the file paths in `releases.json`.