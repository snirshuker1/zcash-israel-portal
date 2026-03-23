# Zcash Israel Portal — Design Rules

## Aesthetic
- **Style**: Modern Shadcn — clean typography, plenty of whitespace, no noise.
- **Mode**: Light base with dark accent sections (metrics band, footer).
- **Feel**: Protocol dashboard, not a marketing site. Sovereign and mathematical.

## Palette
| Token | Value | Usage |
|---|---|---|
| Background | `#FFFFFF` | Main page bg |
| Surface | `#FAFAFA` | Cards, FAQ section |
| Border | `#E4E4E7` | All borders |
| Text primary | `#09090B` | Headings |
| Text secondary | `#71717A` | Body copy |
| Text muted | `#A1A1AA` | Subtitles, captions |
| **Zcash Amber** | `#F3B132` | Single accent — logo, CTAs, highlights |
| Terminal bg | `#09090B` | Metrics section, footer |
| Terminal surface | `#141414` | Cards inside dark sections |

## Typography
- **Body / UI**: `Inter` (Google Fonts)
- **All technical data**: `JetBrains Mono` — block heights, hashes, prices, addresses, code
- **Scale**: Large headings use `font-bold tracking-tight`, data uses `tabular-nums`

## RTL Rules
- Global `dir="rtl"` on `<html>` for Hebrew
- Every English technical term MUST be wrapped: `<span dir="ltr" className="inline-block">`
- Terms requiring LTR wrapping: `Zcash`, `zk-SNARKs`, `Halo 2`, `NU5`, `Sapling`, `Near Intents`, `MPC`, `ZSA`, `PoS`, `Viewing Keys`, all addresses and hashes

## Copy Rules
- DO NOT use: "revolutionary", "game-changing", "disruptive"
- USE: "מוכח מתמטית" (mathematically proven), "ברמת הפרוטוקול" (protocol-level), "ריבונות פיננסית" (financial sovereignty)
- Tone: Sovereign, mathematical, minimalist.

## Sections (in order)
1. `#hero` — Headline + ShieldedTxSVG mockup
2. `#metrics` — Live protocol data (dark band)
3. `#timeline` — Protocol evolution 2013→Future
4. `#cta` — Ideological statement + Near Intents purchase button
5. `#faq` — Technical FAQ (Viewing Keys, ZK vs Monero, zk-SNARKs, 21M cap)
6. Footer

## APIs
- Block height + price: `Blockchair` (`/api/zcash/stats`) — refreshes every 60s
- Price history: `CoinGecko` (`/api/zcash/price-history`) — cached 1hr
- Block history: `Blockchair` (`/api/zcash/blocks-history`) — cached 1hr
- Shielded pool: Approximated from published transparency data

## Deployment
- GitHub: `zcash-israel-portal` (public)
- Netlify: `zcash-israel` site, build from main branch
