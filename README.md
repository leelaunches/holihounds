# Holihounds

The UK's dog-friendly travel guide. Editorial cottage, lodge and pub recommendations with the dog policy specifics verified against the source listings.

By Rachel Polden — written from mid-Devon with two retired racing greyhounds, Fern and Maisie.

- **Primary domain:** holihounds.com
- **UK alias:** holihounds.co.uk (redirects to .com)
- **Stack:** Astro 6 + Tailwind v4 (PostCSS) + MDX, deployed via Cloudflare Pages

---

## Local development

```bash
nvm use            # or `source ~/.nvm/nvm.sh && nvm use --lts`
npm install
npm run dev        # dev server on http://localhost:4321
npm run build      # production build to dist/
npm run preview    # serve dist/ locally
npm run typecheck  # astro check
```

Node 24 LTS (or any 18.17+). Tailwind v4 is wired via PostCSS (not the Vite plugin) because the Tailwind Vite plugin isn't yet compatible with the Rolldown-Vite bundler Astro 6 ships with — see `astro.config.mjs` for context.

## Project shape

```
src/
├── content.config.ts          # collection schemas (regions, listings, pages)
├── content/
│   ├── regions/               # one .md per region (currently cornwall.md)
│   └── listings/[region]/     # one .md per cottage/lodge/pub
├── layouts/BaseLayout.astro   # head, meta, JSON-LD, header/footer composition
├── lib/
│   ├── site.ts                # SITE_NAME, SITE_URL, AUTHOR, tagline, disclosure
│   ├── nav.ts                 # LIVE_ROUTES + crumb() helper (chrome self-heals)
│   └── schema.ts              # JSON-LD generators (Article, ItemList, FAQ, etc.)
├── components/                # design-system primitives
├── pages/                     # one .astro per route
└── styles/global.css          # Tailwind v4 @theme tokens (forest + clay + cream)
```

## Editorial standards (non-negotiable)

- **Every concrete detail traces to source.** Cottage policy specifics, distances, beach access, fixture details — all sourced from the live listing or a verifiable external reference. Where the source is vague, the entry says so ("varies by property", "shown at booking", "not stated on the public listing") — never invented.
- **British English throughout.** Colour, holiday, garden centre, pub.
- **Editorial caveats baked into prose, not buried in structured data.** Holiday-park status, unit-class bookings, on-lead requirements, side gaps in fences — surfaced in the cottage commentary so a reader skimming gets them too.
- **Affiliate disclosure** at the top of every page with affiliate links (ASA-compliant). See `src/components/AffiliateDisclosure.astro`.

## Supporting docs

- **[`AFFILIATES.md`](./AFFILIATES.md)** — `{{AFFILIATE:provider:identifier}}` token convention + swap-in workflow for when Awin approvals come in
- **[`IMAGE_CREDITS.md`](./IMAGE_CREDITS.md)** — photographer attribution for every Unsplash image used (plus the 3 picsum holdouts pending follow-up)
- **[`build_brief.md`](./build_brief.md)** — original Sprint 1 spec (historical reference)

## Deploy

Public repo on GitHub, connected to Cloudflare Pages for auto-deploy on every push to `main`. Build command: `npm run build`. Output directory: `dist`.

Custom domains (holihounds.com primary, holihounds.co.uk alias) configured at the Cloudflare Pages project level.

## Current status

Sprint 1 build-complete: 9 pages, 12 verified Cornwall cottages, 16 verified UK hot tub lodges, full UK GDPR-compliant privacy policy. Lighthouse 100 / 100 / 100 / 100 on the four spec pages (home, `/cornwall/`, `/cornwall/cottages/`, `/dog-friendly-hot-tub-lodges/`).

Pending before real launch: Awin merchant approvals (~1–2 weeks each), 3 picsum image holdouts, real author headshot, Google Search Console submission post-deploy.
