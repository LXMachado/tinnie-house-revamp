## Tinnie House Records

Polished, single-page React site that showcases the Tinnie House Records catalog, artists, and audio previews. The project now runs fully client-side and ships as a static Vite build, so it can be deployed directly to Netlify (or any static host) without a custom backend or database.

### Highlights
- Static data sources for artists/releases with inline audio previews.
- Tailwind-based styling with shadcn/ui components and a custom theme toggle.
- Netlify-ready contact form (Netlify Forms) with client-side validation powered by React Hook Form + Zod.
- Optional Cloudflare R2/S3 integration for hosting audio—otherwise the bundled `/public/audio` files are used.

### Tech Stack
- **React 18 + TypeScript** bundled with **Vite**.
- **Tailwind CSS** with `tailwindcss-animate` and shadcn/ui primitives (Radix UI).
- **Wouter** for lightweight routing.
- **Zod** & **React Hook Form** for robust form handling.

### Getting Started
```bash
npm install
npm run dev
```

The dev server runs on Vite (defaults to port `5173`). Audio files live under `client/public/audio`.

Optional environment overrides live in `client/.env`:
```bash
# Uncomment and set if you want to stream audio from a bucket instead of the bundled files
# VITE_AUDIO_BASE=https://your-bucket-url.r2.cloudflarestorage.com/tinnie-house-records
```

### Production Build
```bash
npm run build
```

The command outputs to `client/dist`. Point Netlify (or your host) at that directory with the build command `npm run build`.

### Project Structure
```
client/
  public/           # static assets (audio, images, data)
  src/
    components/     # shadcn/ui wrappers + feature components
    lib/            # utilities (audio manager, theme provider, etc.)
    pages/          # page-level React components
    static-content.ts
    types/          # shared TypeScript types
```

### Deployment Tips
- Remove any unused environment variables from Netlify; only `VITE_AUDIO_BASE` is optional.
- Netlify Forms will capture submissions automatically once the site is deployed.
- Cloudflare R2/S3 users should make sure the bucket allows public reads and supports range requests if audio streaming is enabled.
