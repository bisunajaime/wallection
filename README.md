# Wallection

A curated wallpaper gallery website — dark, minimal, and cinematic. Browse, preview, and download AI-generated wallpapers across Mobile, 2K, 4K, and Ultrawide resolutions.

All wallpapers are generated using Qwen and Flux models on a local workstation.

Built with React, TypeScript, Vite, SCSS, Framer Motion, and Swiper. Images served from Cloudflare R2.

## Features

- Masonry grid with category filtering (All / Mobile / 2K / 4K / Ultrawide)
- Full-screen carousel with thumbnail strip (swipe, drag, keyboard navigation)
- Featured collections with curated image sets and pack download (zip)
- Randomized wallpaper order on every page load
- Rotating hero background (changes every 60 seconds)
- Image preloader with progress bar
- Manifest-driven — add wallpapers without redeploying
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

### Environment variables

Create a `.env` file in the project root:

```bash
# URL to the manifest.json file
# Leave empty to use local /manifest.json (default for development)
VITE_MANIFEST_URL=https://pub-1ca07ff7cfae45c89f44bf84454b2b96.r2.dev/manifest.json
```

## Adding Wallpapers

Adding wallpapers requires **no code changes and no redeployment**. Everything is driven by `manifest.json` on Cloudflare R2.

### Step 1: Upload images to R2

Add both files to the category folder in your R2 bucket:

```
mobile/new-wallpaper.webp    ← compressed (displayed on site)
mobile/new-wallpaper.png     ← original (downloaded by user)
```

Categories: `mobile`, `2k`, `4k`, `ultrawide`

### Step 2: Update manifest.json on R2

Add the image name (without extension) to the category's `images` array:

```json
"mobile": {
  "resolution": "1080×1920",
  "images": [
    "wallpaper-1",
    "wallpaper-2",
    "new-wallpaper"
  ]
}
```

Re-upload the updated `manifest.json` to your R2 bucket root. The live site picks up changes on the next page load.

### Adding to a featured collection

Add the image to a featured collection's `images` array using `category/name` format:

```json
{
  "id": "f1",
  "title": "Mountains.",
  "desc": "A collection of majestic mountain landscapes",
  "images": [
    "2k/wallpaper-2",
    "mobile/new-wallpaper"
  ]
}
```

The first image is the cover photo. You can mix categories in a single collection. Clicking "Download Pack" on a featured collection downloads all its images as a zip.

## manifest.json

The manifest defines all wallpapers, categories, and featured collections. It's fetched at runtime from R2.

```json
{
  "baseUrl": "https://pub-1ca07ff7cfae45c89f44bf84454b2b96.r2.dev",
  "categories": {
    "mobile": {
      "resolution": "1080×1920",
      "images": ["wallpaper-1", "wallpaper-2"]
    },
    "4k": {
      "resolution": "3840×2160",
      "images": ["wallpaper-1"]
    }
  },
  "featured": [
    {
      "id": "f1",
      "title": "Mountains.",
      "desc": "A collection of majestic mountain landscapes",
      "images": ["4k/wallpaper-1", "mobile/wallpaper-2"]
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `baseUrl` | CDN root URL. Empty string = local `/wallpapers/` fallback |
| `categories` | Each key is a folder name. `images` lists filenames without extension |
| `featured` | Curated collections. `images` uses `category/name` format |

### How URLs are derived

A wallpaper name like `"4k/wallpaper-1"` becomes:

| Usage | URL |
|-------|-----|
| Display | `{baseUrl}/4k/wallpaper-1.webp` |
| Download | `{baseUrl}/4k/wallpaper-1.png` |

## File structure

```
public/
├── manifest.json              # Local copy (dev only, production uses R2)
└── wallpapers/                # Local compressed images (dev only)
    ├── mobile/
    │   └── wallpaper-1.webp
    ├── 2k/
    ├── 4k/
    └── ultrawide/

src/
├── components/
│   ├── BackToTop/             # Scroll-to-collection button
│   ├── CategoryBar/           # Sticky filter pills
│   ├── DownloadOverlay/       # Pack download progress dialog
│   ├── FeaturedSection/       # Curated collection cards
│   ├── Footer/                # Site footer
│   ├── Hero/                  # Full-bleed hero with rotating background
│   ├── LoadingScreen/         # Image preloader with progress bar
│   ├── Navbar/                # Fixed top navigation
│   ├── WallpaperCarousel/     # Lightbox carousel with thumbnail strip
│   └── WallpaperGrid/         # Masonry grid of wallpaper cards
├── styles/
│   └── _tokens.scss           # Shared SCSS variables & mixins
├── App.tsx                    # Root component
├── WallpaperContext.tsx        # React context (data + URL helpers + download)
├── data.ts                    # Manifest fetcher & parser
├── icons.tsx                  # SVG icon components
├── motion.ts                  # Framer Motion animation variants
├── types.ts                   # TypeScript interfaces
├── utils.ts                   # Standalone URL helpers
├── index.scss                 # Global reset & base styles
└── main.tsx                   # Entry point
```

## Deployment

The site is deployed on **Cloudflare Pages** with images on **Cloudflare R2**.

### Cloudflare Pages setup

1. Push code to GitHub
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `VITE_MANIFEST_URL` = `https://pub-1ca07ff7cfae45c89f44bf84454b2b96.r2.dev/manifest.json`
4. Deploy — every push to `main` auto-deploys

### Cloudflare R2 setup

1. Create an R2 bucket and enable public access (r2.dev subdomain)
2. Upload the `wallpapers/` folder structure and `manifest.json`
3. Add CORS policy (bucket → Settings → CORS):
   ```json
   [{ "AllowedOrigins": ["*"], "AllowedMethods": ["GET"], "AllowedHeaders": ["*"] }]
   ```

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **SCSS** — styling with design tokens
- **Framer Motion** — animations & transitions
- **Swiper** — carousel & thumbnail strip
- **Lucide React** — icons
- **JSZip** — pack downloads
- **Cloudflare R2** — image storage
- **Cloudflare Pages** — hosting
