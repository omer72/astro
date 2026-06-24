# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Keyword Scout — a Vite + React 18 single-page App Store ASO tool. Almost all logic and JSX lives in `src/App.jsx`; the CSS sits in `src/styles.css`. No state library, no router — there's only one screen and `useState` is enough.

## Commands

```sh
npm install
npm run dev      # vite dev server (HMR)
npm run build    # production bundle → dist/
npm run preview  # serve dist/ locally
```

GitHub Pages deploy is automated by `.github/workflows/deploy.yml`: every push to `master` builds Vite and publishes `dist/` via `actions/deploy-pages`. The Pages source is set to "GitHub Actions" (not branch). `vite.config.js` sets `base: '/astro/'` to match the Pages URL — if the repo is ever renamed, update both.

## Architecture

One data source: Apple's public iTunes Search API at `https://itunes.apple.com/search` (and `/lookup`), called via **JSONP** (`&callback=`). JSONP — not `fetch` — is deliberate: it bypasses CORS so the app works from any origin without a backend. Don't switch to `fetch` unless you're also adding a server.

State lives in one `view` object in `App.jsx` with `kind ∈ {idle, sandboxed, loading, error, empty, results, mined}`. `<Body>` switches on `view.kind`. Two entry points mutate it:

1. **`search(term, country?)`** — hits `/search`, on success sets `view = { kind: 'results', term, results, analysis: analyze(...) }`. The optional `cc` arg avoids the stale-closure trap when the country dropdown changes and we re-run synchronously.
2. **`scoutApp(raw)`** — competitor reverse-lookup. `parseAppId()` extracts the numeric ID from a URL or bare digits, hits `/lookup`, then `mineKeywords()` on the app's title + description. Renders chips that fall back into `search()`.

`analyze(term, results)` is the single source of truth for the difficulty heuristic: `0.55 * ratingStrength + 0.45 * titleUsage`, where `ratingStrength = log10(medianRatings+1)/6` (so ~1M ratings → 1.0) and `titleUsage` is the fraction of top-10 apps with the keyword in their title. Thresholds: <33 EASY, <66 MEDIUM, else HARD. If you tune it, also update the wording in `README.md` and the footer copy in `App.jsx`.

`mineKeywords(text, excludeSet)` is the single source of truth for word-frequency mining (`STOP` words filtered, length 3–18, drops pure digits). Both `<Results>` (adjacent keywords) and `scoutApp` route through it.

## Conventions

- One component per concern, all in `App.jsx`. Don't pre-split into a `components/` tree until something genuinely needs to be reused outside this file.
- React escapes by default — there's no `esc()` helper. The only place that emits HTML-shaped output is `<Highlight>`, which uses `String.split` with a capture-group regex and alternates string vs `<mark>` per fragment.
- Self-checks at the bottom of `App.jsx` run `console.assert` on `parseAppId`, `mineKeywords`, and `analyze`. They run on every page load (StrictMode-safe — they're pure). Keep them green; add one if you change the heuristic.
- The `base: '/astro/'` in `vite.config.js` is repo-name-coupled. Don't hardcode absolute paths in JSX; let Vite resolve them.
