# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Keyword Scout — a single-file App Store ASO keyword research tool. Everything lives in `index.html`: markup, CSS in `<style>`, and the app in one IIFE `<script>`. No build, no bundler, no dependencies, no tests.

## Run / develop

Open `index.html` on any real origin: double-click it (`file://`), `python3 -m http.server`, GitHub Pages, etc. It will **not** work inside a sandboxed iframe — outbound requests to Apple are blocked. The code detects this (`window.self !== window.top`) and shows a "download to use" message.

## Architecture

One data source: Apple's public iTunes Search API at `https://itunes.apple.com/search`, called via **JSONP** (`&callback=`). JSONP — not `fetch` — is deliberate: it bypasses CORS so the page works from `file://` and any origin without a proxy. Don't switch to `fetch` unless you're also adding a backend.

Flow (all in `index.html`):
1. `search(term)` builds the iTunes URL with `country`, `entity=software`, `limit=50` and calls `jsonp()`.
2. `render(term, results)` does everything from one response: title-match detection, difficulty score, app list, adjacent-keyword mining, title-usage panel.
3. `scoutApp(raw)` is the competitor reverse-lookup path: `parseAppId()` extracts the numeric ID from a URL or bare digits, hits `itunes.apple.com/lookup`, then re-uses `mineKeywords()` on the app's title + description. Renders into the same state element with clickable chips that fall back into `search()`.

`mineKeywords(text, excludeSet)` is the single source of truth for word-frequency mining (stop-word filter, length 3–18, drops pure digits). Both `render()` and `scoutApp()` route through it — keep it that way; don't reimplement the loop.

Difficulty heuristic (`render`): `0.55 * ratingStrength + 0.45 * titleUsage`, where `ratingStrength = log10(medianRatings+1)/6` (so ~1M ratings → 1.0) and `titleUsage` is the fraction of top-10 apps with the keyword in their title. Thresholds: <33 EASY, <66 MEDIUM, else HARD. If you tune the formula, update the weights described in `README.md` and the footer copy in `index.html` so they stay consistent.

Adjacent keywords are mined from `trackName + description` across all results, filtered by a hardcoded `STOP` set, length 3–18, non-numeric, not in the query tokens.

## Conventions

- Pure ES5-ish browser JS, no transpiler. Keep it that way unless you're also introducing a build step.
- All user-facing strings are inline in `index.html`. There is no i18n layer.
- All HTML interpolation goes through `esc()` (and `highlight()` for marked terms) — never concatenate raw API fields into innerHTML.
