# Wallection

A curated wallpaper gallery website — dark, minimal, and cinematic. Browse, preview, and download wallpapers across Mobile, 2K, 4K, and Ultrawide resolutions.

Built with React, TypeScript, Vite, SCSS, Framer Motion, and Swiper.

## Features

- Masonry grid with category filtering (All / Mobile / 2K / 4K / Ultrawide)
- Full-screen carousel with thumbnail strip (swipe, drag, keyboard navigation)
- Featured collections with curated image sets
- Randomized wallpaper order on every page load
- Rotating hero background (changes every 60 seconds)
- Image preloader with progress bar
- Responsive design (mobile-first)
- Download originals with one tap

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Start dev server (accessible from other devices on your network)
npx vite --host

# Build for production
npm run build

# Preview production build
npm run preview
```

## Adding Wallpapers

### File structure

Wallpapers are organized by category in `public/wallpapers/`. Each wallpaper has two files with the **same name** but different extensions:

- `.webp` — compressed version (displayed on the website)
- `.png` — original version (downloaded by the user)

```
public/wallpapers/
├── mobile/
│   ├── volcano-sunset.webp     ← compressed (displayed)
│   ├── volcano-sunset.png      ← original (downloaded)
│   ├── neon-city.webp
│   ├── neon-city.png
│   └── ...
├── 2k/
│   ├── mountain-fog.webp
│   ├── mountain-fog.png
│   └── ...
├── 4k/
│   └── ...
└── ultrawide/
    └── ...
```

### Manifest-driven (no redeploy needed)

All wallpaper data is defined in `manifest.json`, which the site fetches at runtime. This means you can add, remove, or rearrange wallpapers **without redeploying the site** — just update the manifest and upload the image files.

The manifest lives alongside the images (either in `public/` for local dev, or on your CDN for production).

#### manifest.json structure

```json
{
  "baseUrl": "",
  "categories": {
    "mobile": {
      "resolution": "1080×1920",
      "images": ["wallpaper-1", "wallpaper-2", "volcano-sunset"]
    },
    "4k": {
      "resolution": "3840×2160",
      "images": ["aurora", "mountain-fog"]
    }
  },
  "featured": [
    {
      "id": "f1",
      "title": "Mountains.",
      "desc": "A collection of majestic mountain landscapes",
      "images": ["4k/aurora", "mobile/volcano-sunset"]
    }
  ]
}
```

- **`baseUrl`** — empty for local files, or a CDN URL like `https://your-bucket.r2.dev`
- **`categories`** — each key is a category folder, `images` lists filenames (without extension)
- **`featured`** — curated collections, `images` uses `category/name` format, first is the cover

#### How URLs are derived

A wallpaper name like `"4k/aurora"` becomes:

| Usage | URL |
|-------|-----|
| Display (compressed) | `{baseUrl}/4k/aurora.webp` |
| Download (original) | `{baseUrl}/4k/aurora.png` |

When `baseUrl` is empty, it falls back to `/wallpapers/4k/aurora.webp` (local).

### Adding a new wallpaper (step by step)

1. Add both files to the category folder on your CDN (or `public/wallpapers/` locally):
   ```
   mobile/new-wallpaper.webp
   mobile/new-wallpaper.png
   ```
2. Add `"new-wallpaper"` to the `mobile.images` array in `manifest.json`
3. Done — no redeploy needed

### Using remote storage (Cloudflare R2, S3, etc.)

1. Upload your `wallpapers/` folder structure and `manifest.json` to your bucket
2. Set the `baseUrl` in `manifest.json` to your bucket's public URL:
   ```json
   { "baseUrl": "https://your-bucket.r2.dev" }
   ```
3. Set the env variable to point to the remote manifest:
   ```bash
   VITE_MANIFEST_URL=https://your-bucket.r2.dev/manifest.json
   ```
4. Deploy the site — it fetches the manifest from your CDN at runtime

## Featured Collections

Featured collections are curated sets shown in a separate section. Edit the `featured` array in `manifest.json`:

```json
{
  "id": "f1",
  "title": "Mountains.",
  "desc": "A collection of majestic mountain landscapes",
  "images": ["2k/wallpaper-2", "4k/wallpaper-1", "mobile/wallpaper-5"]
}
```

First image is the cover. You can mix categories in a single collection.

## Project Structure

```
src/
├── components/
│   ├── BackToTop/          # Scroll-to-collection button
│   ├── CategoryBar/        # Sticky filter pills
│   ├── FeaturedSection/    # Curated collection cards
│   ├── Footer/             # Site footer
│   ├── Hero/               # Full-bleed hero with rotating background
│   ├── LoadingScreen/      # Image preloader with progress bar
│   ├── Navbar/             # Fixed top navigation
│   ├── Stats/              # Stats section
│   ├── WallpaperCarousel/  # Lightbox carousel with thumbnail strip
│   └── WallpaperGrid/      # Masonry grid of wallpaper cards
├── styles/
│   └── _tokens.scss        # Shared SCSS variables & mixins
├── App.tsx                 # Root component
├── WallpaperContext.tsx     # React context (provides data + URL helpers)
├── data.ts                 # Manifest fetcher & parser
├── icons.tsx               # SVG icon components
├── motion.ts               # Framer Motion animation variants
├── types.ts                # TypeScript interfaces
├── utils.ts                # Standalone URL helpers (fallback)
├── index.scss              # Global reset & base styles
└── main.tsx                # Entry point
```

## Deployment

Build and deploy the `dist/` folder to any static host:

| Platform | URL format |
|----------|-----------|
| Vercel | `wallection.vercel.app` |
| Netlify | `wallection.netlify.app` |
| Cloudflare Pages | `wallection.pages.dev` |
| GitHub Pages | `username.github.io/wallection` |

```bash
npm run build
# Deploy the dist/ folder
```

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **SCSS** — styling with design tokens
- **Framer Motion** — animations & transitions
- **Swiper** — carousel & thumbnail strip
- **Lucide React** — icons
