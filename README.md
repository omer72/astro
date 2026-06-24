# Keyword Scout

A lightweight App Store ASO keyword research tool. Type a keyword and instantly see:

- **Ranking apps** — in Apple's search-relevance order, with icon, developer, genre, rating, rating count, and price. The keyword is highlighted wherever it appears in a title.
- **"in title" flags** — which competitors put the keyword in their app title (the slot Apple weights heaviest).
- **Difficulty gauge** — a 0–100 heuristic from competitors' median rating count (~55%) and title usage in the top 10 (~45%).
- **Adjacent keywords** — mined from the ranking apps' titles and descriptions; click any to re-scout it.
- **Mine a competitor** — paste an App Store URL or numeric ID; pulls keywords straight from that app's title + description so you can scout each.
- **8 App Store countries** — including 🇺🇸 US and 🇮🇱 Israel.

Vite + React. Data comes live from Apple's public [iTunes Search API](https://itunes.apple.com/search) via JSONP — no backend, no API keys.

## Develop

```sh
npm install
npm run dev      # local dev server with HMR
npm run build    # production bundle into dist/
npm run preview  # serve the built bundle locally
```

Pushes to `master` auto-deploy to GitHub Pages via `.github/workflows/deploy.yml` → https://omer72.github.io/astro/

It will **not** work inside an embedded/sandboxed preview iframe, which blocks outbound requests to Apple.

## What it is not

True search **volume / popularity** and Apple's official **difficulty** come from the Apple Search Ads
API (which needs an authenticated ASA account) and are not included. The difficulty score here is a
directional heuristic, not a verdict. There's also no rank-tracking-over-time and no subtitle data
(the Search API only exposes title + description).
