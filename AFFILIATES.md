# Affiliate Links — Swap-In Convention

Every affiliate CTA on Holihounds renders its `href` as a placeholder token at build time. When affiliate partners are approved (typically via Awin), the tokens get replaced with the live affiliate URLs in one mechanical pass.

This document is the find-and-replace reference for that pass.

---

## The token convention

All affiliate CTAs use this exact pattern:

```
{{AFFILIATE:provider:identifier}}
```

- **`provider`** matches the `affiliate_provider` field in each listing's markdown frontmatter — currently one of: `sykes`, `hoseasons`, `cottages.com`, `aspects-holidays`, `kernock-cottages`.
- **`identifier`** is the listing's slug (basename of its `.md` file) — e.g. `old-coastguard-lookout`, `signature-cove-lodge`, `woodend-croft-pitmedden`.

Examples currently in the built HTML:

```
{{AFFILIATE:sykes:old-coastguard-lookout}}
{{AFFILIATE:hoseasons:signature-cove-lodge}}
{{AFFILIATE:cottages.com:the-granary-egloskerry}}
{{AFFILIATE:aspects-holidays:garth-cottage}}
{{AFFILIATE:kernock-cottages:kernock-cottages}}
```

The implementation lives in `src/components/AffiliateCTA.astro`. Each `<AffiliateCTA provider="..." identifier="..." />` instance becomes one token in the rendered HTML.

---

## Listing every current token

After a build (`npm run build`), all live tokens can be listed with:

```bash
grep -roh '{{AFFILIATE:[^}]*}}' dist/ | sort | uniq
```

This gives a complete inventory of every affiliate target that needs a real URL.

---

## Source data for each replacement

Each listing's `external_url` field in its markdown frontmatter holds the canonical property URL on the provider's own site. That URL is what the affiliate redirect needs to wrap.

To extract `[identifier, external_url]` pairs:

```bash
for f in src/content/listings/**/*.md; do
  id=$(basename "$f" .md)
  url=$(grep -oE 'external_url: \S+' "$f" | sed 's/external_url: //')
  echo "$id|$url"
done
```

---

## Provider-by-provider replacement patterns

### Sykes Cottages (via Awin)

Awin URL format:

```
https://www.awin1.com/cread.php?awinmid=[SYKES_MID]&awinaffid=[YOUR_AFFID]&clickref=[identifier]&p=[ENCODED_external_url]
```

So `{{AFFILIATE:sykes:old-coastguard-lookout}}` becomes:

```
https://www.awin1.com/cread.php?awinmid=[SYKES_MID]&awinaffid=[YOUR_AFFID]&clickref=old-coastguard-lookout&p=https%3A%2F%2Fwww.sykescottages.co.uk%2Fcottage%2FCornwall-Lobber-Point%2FThe-Old-Coastguard-Lookout-1097255.html
```

Lookup values:
- `[SYKES_MID]` — Sykes merchant ID on Awin (provided at approval)
- `[YOUR_AFFID]` — your Awin affiliate ID

### Hoseasons (via Awin)

Same pattern; different merchant ID.

```
https://www.awin1.com/cread.php?awinmid=[HOSEASONS_MID]&awinaffid=[YOUR_AFFID]&clickref=[identifier]&p=[ENCODED_external_url]
```

### cottages.com (via Awin)

Same pattern; different merchant ID. cottages.com and Sykes share a parent (Awaze) but have separate Awin merchant IDs.

### Aspects Holidays (independent — Cornwall)

Aspects may or may not be on Awin. Options:

1. **If on Awin** — same pattern as Sykes/Hoseasons, with Aspects' MID.
2. **If direct affiliate program** — replace with their direct URL format, typically `https://www.aspects-holidays.co.uk/...?ref=[your-id]`.
3. **If no affiliate program** — replace with the raw `external_url` so the CTA at least drives traffic to their listing. No commission, but the editorial value of the page is preserved.

### Kernock Cottages (independent — Cornwall)

Same three options as Aspects. Kernock is a single-estate operator, so a personal affiliate arrangement is more likely than an Awin presence.

---

## Recommended swap-in workflow

When ready to go live:

1. **Build the static site**: `npm run build`
2. **List all current tokens**: `grep -roh '{{AFFILIATE:[^}]*}}' dist/ | sort | uniq`
3. **For each token**, compose the corresponding affiliate URL using the patterns above + Awin merchant IDs + `external_url` from the source markdown
4. **Run a sed pass over `dist/`** to replace each token with its live URL:

   ```bash
   find dist -type f -name '*.html' -exec sed -i '' \
     's|{{AFFILIATE:sykes:old-coastguard-lookout}}|https://www.awin1.com/cread.php?awinmid=...|g' \
     {} +
   ```

   (macOS `sed -i ''` syntax; Linux uses `sed -i`.)

5. **Deploy** `dist/` to Cloudflare Pages.

This keeps the live affiliate URLs out of the source repo — neat from a credentials-hygiene perspective.

---

## Alternative: build-time replacement

If post-build sed feels brittle (it is — every URL change requires a rebuild + replay), the cleaner architecture is:

1. Add affiliate provider IDs to `src/lib/site.ts` (or a `.env` file via Astro's env handling)
2. Update `AffiliateCTA.astro` to build the live affiliate URL directly using `affiliate_provider` + `identifier` + `external_url`
3. Token convention is retired; live URLs render at build time

This is a 30-minute refactor when affiliate IDs are in hand. For Sprint 1 (no IDs yet), the token approach is the right call.

---

## Pre-launch checklist

Before swapping any token to a real affiliate URL:

- [ ] Awin approval received for the merchant (1–2 weeks per merchant)
- [ ] Merchant ID and your affiliate ID recorded
- [ ] Test one URL manually in a browser — confirm it redirects through Awin and lands on the correct property page
- [ ] Verify the click tracks in your Awin dashboard
- [ ] Then mass-replace the remaining tokens for that provider

The ASA-compliant affiliate disclosure is already on every page with affiliate links — that part doesn't need updating at swap-in.
