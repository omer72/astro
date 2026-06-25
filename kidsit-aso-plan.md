# Kidsit AI — ASO plan for "parent coach"

**Current rank:** #28 (US) · **App:** Kidsit AI - Parent Coach (id 6769443099) · **Ratings:** 1 · **Released:** 2026-05-20 · **Last update:** 2026-06-15

---

## TL;DR — what to change, in order

1. **Title + Subtitle** — paste-ready below. Biggest single lever.
2. **Add 3 English localizations** (en-GB, en-AU, en-CA) — each gets its own 100-char keyword field. Hidden but huge.
3. **Swap genre order** — primary `Education`, secondary `Lifestyle` (currently the reverse).
4. **Rename your 2 IAPs** to inject the keyword.
5. **Wire `SKStoreReviewController`** after a positive moment to capture ratings velocity.
6. **Optional:** $3–5/day Apple Search Ads on "parent coach" — installs from ASA feed organic ranking.

---

## Paste-ready: new title + subtitle

**Recommended:**

| Field | Text | Chars |
|---|---|---|
| Title | `Parent Coach AI: Kidsit` | 23 / 30 |
| Subtitle | `Parenting tips for toddlers` | 27 / 30 |

Indexes for: **parent, coach, AI, Kidsit, parenting, tips, toddlers** — no duplication, both `parent` and `parenting` stems covered.

**Alternatives:**

| Title | Subtitle | Tradeoff |
|---|---|---|
| `Parent Coach AI: Kidsit` (23) | `Tantrum help for moms & dads` (28) | swap "parenting/toddlers" for "tantrum/moms/dads" — pick if "tantrum" is your top intent |
| `Parenting Coach — Kidsit AI` (27) | `Toddler tantrums for parents` (28) | lead with `Parenting` (higher search volume than `Parent`), still covers both stems |
| `Parent Coach for Toddlers` (25) | `AI parenting tips by Kidsit` (27) | drops brand from title for maximum keyword purity — fine while brand traffic is negligible (1 rating) |

Apple re-indexes within 24–72h; expect movement inside a week.

---

## Why you're at #28 — the data

| # | App | Ratings | Title | Why ahead of you |
|---|-----|---------|-------|------------------|
| 1 | Good Inside: Parenting | **13,398** | doesn't even contain "coach" | brute ratings volume wins |
| 2 | The Parent Coach by ICP | 0 | "Parent Coach" at char 5 | early-title position + likely strong subtitle/keywords |
| 4 | Parent Coach | 1 | literal exact match | exact title match |
| 5 | Wizzer: Parenting Coach | 12 | "Parenting Coach" near start | brand-then-keyword pattern + 12 ratings |
| **28** | **Kidsit AI - Parent Coach** | **1** | "Parent Coach" at char 13 | **brand prefix burns the heavy slot** |

Apps with **0 ratings** outrank you. So it isn't ratings — it's **metadata placement** and **localization breadth**.

---

## Apple's ranking factors (in order of weight)

1. **Title** — heaviest, first ~30 chars weighted hardest
2. **Subtitle** (30 chars) — almost as heavy as title
3. **Keywords field** (100 chars, hidden, comma-separated, no spaces) — **multiplied by every localization**
4. **In-App Purchase display names** — indexed
5. **Developer/seller name** — indexed
6. **Rating count + velocity** — recent matters more than total
7. **Install velocity** — recent downloads
8. **Update recency** — signals "alive"
9. **Genre/category** — Education ranks better than Lifestyle for learning queries

**Not** ranking signals (common myths): description text, review *content* (count matters, content doesn't), screenshots.

---

## The full lever list

### P0 — Title surgery
Current title: `Kidsit AI - Parent Coach` puts the keyword at character 13. Apple weights the first ~12 chars heaviest. Flip the order. See the paste-ready table above.

### P0 — Subtitle
30 chars, almost-title weight. Use it for words the title doesn't have. See table above.

### P1 — Localization hack (biggest hidden lever)
Your listing has `languageCodesISO2A: ['EN']` — **one** localization. Each additional localization gives a fully-indexed extra 100-char keyword field in the US store. Add en-GB, en-AU, en-CA. Copy your US copy into each. Change **only** the keyword field per locale.

**Keyword fields per locale** (paste into the Keywords box in App Store Connect, no spaces, comma-separated, max 100 chars each):

| Locale | Keyword field |
|--------|---------------|
| en-US | `parenting,toddler,tantrum,advice,raising,kids,baby,sleep,discipline,mom,dad,family` |
| en-GB | `gentle,positive,attachment,montessori,emotion,calm,connection,mindful,wellness` |
| en-AU | `infant,preschool,school,teen,couple,coparent,divorce,blended,stepparent,bedtime` |
| en-CA | `behavior,routine,bath,meal,picky,homework,screen,siblings,potty,daycare` |

That's 100 → 400 indexed keyword chars. Almost no apps below the top 10 do this — it's the single highest-leverage move available to a controlled listing.

### P1 — Genre swap
Currently `genres: ['Lifestyle', 'Education']`. Swap to `Education` primary. Top 10 for "parent coach" is 7 Education vs 3 Lifestyle — Apple weights category matching.

### P2 — Rename IAPs
Currently:
- `Kidsit AI Premium Yearly`
- `Kidsit AI Premium Monthly`

Apple indexes IAP display names. Rename to:
- `Parent Coach Premium — Yearly`
- `Parent Coach Premium — Monthly`

Free density for the exact phrase.

### P3 — Ratings velocity
1 rating today. Wire `SKStoreReviewController` and trigger it **once per user**, after a positive moment (e.g., user taps "this helped" on a response). Don't beg in onboarding. Goal: 25+ ratings in 30 days. Velocity is weighed more than total count.

### P4 — Apple Search Ads ($3–5/day)
Bid for "parent coach" with your app. Cheap CPC at this volume. ASA installs count toward organic install-velocity signal. The trick most indies miss.

### P5 — Update cadence
You shipped 9 days ago — good. Keep a 2–3 week update cadence (even bugfix-only). Dormant apps slide.

---

## What NOT to do

- **Don't repeat words** across title/subtitle/keywords — they're one indexed pool, duplication wastes chars.
- **Don't stuff competitor names** (Good Inside, Wizzer, etc.) in keywords. Apple rejects and may penalize.
- **Don't put spaces** in the keyword field. Each space wastes a char.
- **Don't include filler** ("best", "app", "free", "the"). Apple drops them.
- **Don't ask family/friends for ratings in burst.** Apple's fraud detection flags suspicious-velocity ratings from low-engagement accounts.
- **Don't put ratings/reviews in description.** Description isn't a ranking signal; it's a conversion signal. Use it for selling, not keyword stuffing.

---

## Realistic timeline

| Horizon | Expected position | What needs to happen |
|---|---|---|
| 30 days | #8–12 | P0 metadata moves indexed by Apple |
| 60 days | #4–7 | +25 ratings, IAPs renamed, one update shipped |
| 90 days | #2–4 | ASA running, steady ratings velocity, 4 localizations live |

**#1 is unrealistic** in this window — Good Inside has 13,398 ratings and is a different scale of operation. Top 5 against zero-to-low-rating competitors is very achievable.

---

## This week's checklist (when admin access is back)

- [x] App Store Connect → app → version → App Information: paste new title + subtitle
- [x] App Store Connect → app → version → swap genre order (Education first)
- [x] App Store Connect → app → version → Add Language: en-GB, en-AU, en-CA
- [x] For each new locale: clone US copy, paste a different keyword field from the table above
- [x] App Store Connect → IAPs → rename both subscription display names
- [x] In code: trigger `SKStoreReviewController.requestReview()` after a "this helped" tap (once per user)
- [x] Submit version for review
- [ ] (Optional) Apple Search Ads → new campaign → keyword "parent coach", $3–5/day

---

## Monitor

Use the Keyword Scout tool to track movement. Scout "parent coach" → US after each Apple re-index (≈3 days post-submission). The recent-scouts chips on the landing screen will show your historical positions; the difficulty delta in the summary will show market movement.
