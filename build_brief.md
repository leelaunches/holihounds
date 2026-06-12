# Holihounds — Build Brief (Sprint 1)

## Project goal

A regional content site covering dog-friendly UK travel — pubs, cottages, hotels, lodges, restaurants, beaches and walks, organised by region. Monetised primarily via accommodation affiliate (Booking, Sykes, Hoseasons) plus future display ads and direct paid listings.

The site competes with sites like Yorkshire Food Guide, Good Hotel Guide, Stay In A Pub — content-led regional authority sites, not directory-aggregator sites. The differentiator is genuine, opinionated, UK-specific regional intel. Thin directory pages are the failure mode; we're not building those.

## Tech stack (locked)

- **Framework:** Astro 5+ with Content Collections
- **Styling:** Tailwind CSS v4
- **Hosting:** Cloudflare Pages
- **Content:** Markdown (`.md` / `.mdx`) under `src/content/`
- **Search/listings:** No DB. Content in markdown frontmatter, generated at build time
- **Analytics:** Plausible (privacy-friendly, GDPR clean) — add tag, no consent banner needed
- **Forms:** Cloudflare Pages Functions (later sprint)

Why Astro: this is a content site that needs to scale to 200+ pages, all SEO-driven, all static. Astro builds fast, ships zero JS by default, and Content Collections give us typed frontmatter for places/listings. Don't use Next.js — overkill and worse SEO performance for static content.

## Sprint 1 scope

**Build these and only these:**

1. Site infrastructure (layouts, components, design system, content collection schemas)
2. Home page
3. One vertical hub page: `/cottages/`
4. One regional hub page: `/cornwall/`
5. One regional × vertical page: `/cornwall/cottages/` (the model money page)
6. One standalone money page: `/dog-friendly-hot-tub-lodges/`
7. Standard pages: `/about/`, `/contact/`, `/privacy/`

That's 7 content pages plus infrastructure. Once the patterns are right, the remaining 60+ pages stamp from these templates.

**Not in this sprint:**
- Affiliate integration (Awin approval pending — use placeholder CTAs)
- Email capture form (sprint 2)
- Search functionality
- User submissions
- Real images on every page (use 1-2 stock images per page for now)
- Remaining 16 regional hubs (sprint 2-4)

## Site architecture

```
/                                  Home
/pubs/                             Vertical hub: dog friendly pubs (head term)
/cottages/                         Vertical hub: dog friendly cottages
/hotels/                           Vertical hub: dog friendly hotels
/restaurants/                      Vertical hub: dog friendly restaurants
/beaches/                          Vertical hub: dog friendly beaches
/walks/                            Vertical hub: dog friendly walks
/dog-friendly-hot-tub-lodges/      Money page (high-intent keyword cluster)

/cornwall/                         Regional hub
/cornwall/cottages/                Regional × vertical
/cornwall/hotels/
/cornwall/pubs/
/cornwall/restaurants/
/cornwall/beaches/
/cornwall/walks/

[same pattern for: lake-district, snowdonia, scotland, yorkshire, norfolk,
 northumberland, dorset, cotswolds, devon, new-forest, peak-district,
 isle-of-wight, sussex-kent, london, suffolk, wales (separate from snowdonia)]
```

## Content collections schema

Define these collections in `src/content/config.ts`:

### `regions` collection
```ts
{
  slug: string,                    // 'cornwall'
  name: string,                    // 'Cornwall'
  intro: string,                   // 1-paragraph hook
  description: string,             // longer SEO description
  hero_image: string,
  best_for: string[],              // ['Coastal walks', 'Pet-friendly pubs']
  featured_listings: string[],     // refs to listings
  related_regions: string[],       // ['devon', 'cornwall']
  meta_title: string,
  meta_description: string
}
```

### `listings` collection (one entry per pub/cottage/hotel/etc.)
```ts
{
  slug: string,
  name: string,
  type: 'pub' | 'cottage' | 'hotel' | 'restaurant' | 'lodge' | 'beach' | 'walk',
  region: string,                  // ref to region
  town: string,                    // 'Padstow'
  description: string,             // 80-150 word original commentary
  dog_policy: string,              // specific rules — pivotal content
  amenities: string[],             // ['Hot tub', 'Enclosed garden', 'Dog beds provided']
  price_indicator: '£' | '££' | '£££',
  affiliate_link: string | null,   // placeholder for now
  affiliate_provider: string | null,
  external_url: string | null,     // own website if no affiliate
  image: string,
  lat: number | null,
  lng: number | null,
  sleeps: number | null,           // for cottages/hotels
  bedrooms: number | null,
  pet_charge: string | null,       // '£10/night' or 'Free'
  max_dogs: number | null
}
```

### `pages` collection (for vertical hubs and money pages)
```ts
{
  slug: string,
  title: string,
  intro: string,
  meta_title: string,
  meta_description: string,
  body: markdown
}
```

## Page templates

### Home page (`/`)

- Hero: "Find dog-friendly Britain — pubs, cottages, hotels and beaches that actually welcome dogs, by region"
- 6-card grid of top regions (Cornwall, Lake District, Snowdonia, Scotland, Yorkshire, Cotswolds) — each card: image, region name, "127 dog-friendly places"
- 4-card grid of vertical hubs (Pubs, Cottages, Hotels, Beaches)
- Featured "money page" callout: dog friendly hot tub lodges
- Brief about/why-trust-us section (200 words) with a real human voice — this is critical for E-E-A-T
- Recent additions / latest content
- Footer with all regions linked

### Vertical hub page (e.g. `/cottages/`)

Target keyword: "dog friendly cottages" (1,000 vol, KD 2)

Structure:
1. H1: "Dog friendly cottages in the UK"
2. Intro paragraph (150 words) — what makes a genuinely dog-friendly cottage vs "dogs tolerated"
3. "Best regions for dog-friendly cottages" — 6-8 region cards with internal links to `/cornwall/cottages/`, `/lake-district/cottages/` etc.
4. "What to look for" — 200 words: enclosed gardens, dog beds, walking distance to pubs, hot tubs, etc. Genuine advice.
5. FAQ section (4-6 questions) using FAQPage schema:
   - "Are dog-friendly cottages more expensive?"
   - "Can I bring more than one dog?"
   - "What's typically included for dogs?"
   - "Are hot tub cottages dog-friendly?"
6. "Top dog-friendly cottage providers" — Sykes, Hoseasons, cottages.com, independents (text only for sprint 1, affiliate links later)
7. Latest cottages (auto-pulled from listings collection)

### Regional hub page (e.g. `/cornwall/`)

Target keyword cluster: "dog friendly cornwall" + variants

Structure:
1. H1: "Dog-friendly Cornwall: complete guide"
2. Hero image + 200-word region intro with personality (why Cornwall is great with a dog — beaches that allow dogs year-round on certain coasts, the South West Coast Path, the pub culture)
3. **Quick links bar** — In-page anchors: Cottages | Hotels | Pubs | Restaurants | Beaches | Walks
4. "Best for" callout boxes:
   - Best for beach lovers
   - Best for walkers
   - Best for foodies with dogs
5. **Cottages** section: 50 words intro + 3 featured listings + "See all 47 cottages →" link to `/cornwall/cottages/`
6. **Hotels** section: same pattern
7. **Pubs** section: same pattern
8. **Beaches** section: same pattern, with crucial info on seasonal restrictions (this is the hook — most sites don't have it clearly)
9. **Walks** section: same pattern
10. **Travelling to Cornwall with a dog** — 200 words on practical stuff (where to stop on the journey, motorway services with dog walks)
11. Related regions: Devon, Somerset

### Regional × vertical page (e.g. `/cornwall/cottages/`)

Target keyword: "dog friendly cottages cornwall" (4,400 vol, KD 0)

This is the format that beats Booking.com on these SERPs. Listicle with commentary, not a database dump.

Structure:
1. H1: "12 best dog-friendly cottages in Cornwall"
2. Intro: 150 words. Why Cornwall is exceptional for dog cottages. What this guide is. Who wrote it (real author bio for E-E-A-T).
3. Quick navigation: jumplinks to each cottage
4. **Listing 1** through **Listing 12** — for each, repeat this structure:
   - H2 with cottage name + town
   - Image
   - Why we picked it (60-80 words original commentary — this is the moat)
   - **Dog policy box**: charge per night, max dogs, on-bed allowed?, enclosed garden?, dog beds?
   - Sleeps / bedrooms / location summary
   - Affiliate CTA button (placeholder for sprint 1)
   - Direct hotel/cottage website link as backup
5. **What to look for in a dog-friendly Cornish cottage** (200 words original advice)
6. **Best Cornish areas for dogs**: 4 sub-sections (North Coast, South Coast, Bodmin Moor, The Lizard)
7. FAQ schema with 5 questions
8. Related: `/cornwall/pubs/`, `/cornwall/beaches/`, `/devon/cottages/`, `/cottages/` (vertical hub)

Word count target: 1500-2200 words. Each listing has genuinely original commentary. **NO copy-paste from Booking.com or Sykes descriptions** — that's the failure mode.

### Money page (`/dog-friendly-hot-tub-lodges/`)

Target keyword cluster: "dog friendly hot tub lodges" + 2 near-duplicates (~13k combined volume, all KD 0). Pure transactional intent — every visitor is ready to book.

Structure:
1. H1: "Dog-friendly hot tub lodges UK: 2026 guide"
2. Intro: 100 words. The combination is genuinely hard to find — that's why people search this. Why the listings here are vetted.
3. **Filter / quick-pick callouts** (visual, not functional in sprint 1):
   - Lake District hot tub lodges
   - Scottish Highlands hot tub lodges
   - Yorkshire Dales hot tub lodges
   - Cornwall hot tub lodges
4. **15 best dog-friendly hot tub lodges** — listicle format identical to regional × vertical pattern
5. **What to expect** (200 words) — hot tub etiquette with dogs, cleaning, what's typically provided
6. **Booking tips** — when to book, off-peak savings, which providers offer the best dog policies
7. FAQ schema (6 questions)
8. Related: `/cottages/`, `/lodges/`, regional hubs

## Content writing rules

These are non-negotiable. Thin content kills this site before it starts.

1. **Every listing has 60-80 words of original commentary**, not a rephrased provider description. The voice should be "I have actually been here / researched this thoroughly" — even when starting from research rather than visits, the writing has to read like genuine recommendation.
2. **Specific details only**: not "great for dogs" but "two dog beds in the lounge, secure stone-walled garden, and a five-minute walk to the dog-welcoming Ship Inn".
3. **Dog policy must be precise**: charge per night, max dogs, where dogs are allowed (bedrooms? sofa? upstairs?), what's provided. This is the information people search for and competitors get vague about.
4. **British English throughout**: colour, holiday, garden centre, pub, chemist. No "vacation", "yard", "drugstore".
5. **Real author byline**: a single author named on the site (with bio, photo, social links) — Google's E-E-A-T weights this heavily for travel content. If Lee is the author, that's fine; otherwise create a credible persona but don't invent fake credentials.
6. **No affiliate disclosure dishonesty**: include a clear "We may earn a commission..." disclosure on every page that has affiliate links. Required by ASA in UK.

## SEO requirements

### Meta & schema

Every page needs:
- Unique `<title>` — pattern: `[Page H1] | Holihounds` (or whatever the site name ends up being)
- Unique `meta description` — 140-155 chars, written for click-through, not keyword stuffing
- `og:` tags for social sharing (image, title, description)
- Canonical URL
- `BreadcrumbList` schema on all pages except home

Schema by page type:
- **Listings (cottages/hotels):** `LodgingBusiness` with `petsAllowed: true`
- **Listings (pubs/restaurants):** `Restaurant` or `BarOrPub` with `petsAllowed: true`
- **Regional hubs:** `Place` + `BreadcrumbList`
- **FAQ blocks:** `FAQPage`
- **Money pages and listicles:** `Article` + `ItemList` for the listings

### Internal linking rules

This is what builds topical authority. Strict rules:

1. Every regional × vertical page links to:
   - Its parent region hub (e.g. `/cornwall/cottages/` → `/cornwall/`)
   - Its parent vertical hub (e.g. `/cornwall/cottages/` → `/cottages/`)
   - 2-3 sister pages in the same region (`/cornwall/pubs/`, `/cornwall/beaches/`)
   - 1-2 same-vertical pages in adjacent regions (`/devon/cottages/`)
2. Every regional hub links to all its sub-pages (cottages, hotels, pubs, etc.)
3. Every vertical hub links to all regional × vertical pages for that vertical
4. Footer has every region linked
5. Header has the vertical hubs (Pubs / Cottages / Hotels / Beaches)
6. **No orphan pages**. Every page is reachable from home in ≤ 2 clicks.

### Sitemap & robots

- `sitemap.xml` auto-generated by Astro Sitemap integration
- `robots.txt` allowing everything, pointing to sitemap
- Submit to Google Search Console + Bing Webmaster Tools after deploy

### Performance

- Lighthouse target: 95+ on all four scores
- Images: WebP, lazy-loaded below fold, properly sized
- No client-side JS unless absolutely needed (Astro default)
- CSS under 50kb

## Design direction

**Read `/mnt/skills/public/frontend-design/SKILL.md` first** — apply its guidance throughout. Avoid generic AI-template aesthetics (centred hero, three-column feature grid, gradient buttons, lucide icons everywhere).

The vibe is editorial travel guide — closer to Conde Nast Traveller or The Field magazine than directory listing site. Inspirations: goodhotelguide.com, coolplaces.co.uk, sawdays.co.uk.

- **Type:** serif headings (something like Fraunces, Source Serif, or Tiempos), clean sans body (Inter or similar)
- **Colour:** earthy, British. Forest green, warm cream, charcoal. NOT bright primary colours. NOT teal. NOT a tech-startup palette.
- **Photography-led:** every regional/listing page leads with a strong image. Photos do the heavy lifting, not graphics.
- **Whitespace:** generous, magazine-like. Don't cram.
- **No icons-as-decoration**: only functional icons (search, hamburger, external link).

## Affiliate placeholder convention

Sprint 1 has no live affiliate links yet. Use this placeholder pattern so swap-in is one search-and-replace per provider when Awin approves:

```html
<a href="{{AFFILIATE:sykes:cottage-name-or-id}}" class="cta-affiliate">
  Check availability →
</a>
```

The `{{AFFILIATE:provider:identifier}}` token is the search target. Document the convention in a `/AFFILIATES.md` in the repo so swap-in is mechanical.

## Out of scope (do not build)

- User accounts, login, submissions
- Search bar / filters (use anchored content navigation instead for sprint 1)
- Map integration (sprint 3+)
- Newsletter signup form (sprint 2)
- Display ad slots (month 3+, when traffic warrants)
- Comments/reviews from users
- Booking widgets embedded directly (waiting on Awin approval)

## File structure

```
/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/             # placeholder hero images
├── src/
│   ├── content/
│   │   ├── config.ts       # collections schema
│   │   ├── regions/
│   │   │   └── cornwall.md
│   │   ├── listings/
│   │   │   └── cornwall-cottage-1.md  # 12 entries for sprint 1
│   │   └── pages/
│   │       ├── cottages.md           # vertical hub
│   │       └── hot-tub-lodges.md     # money page
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ListingCard.astro
│   │   ├── RegionCard.astro
│   │   ├── DogPolicyBox.astro
│   │   ├── FAQ.astro
│   │   ├── Breadcrumbs.astro
│   │   └── AffiliateCTA.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── RegionalHubLayout.astro
│   │   ├── ListicleLayout.astro
│   │   └── VerticalHubLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── privacy.astro
│   │   ├── cottages.astro            # uses pages collection
│   │   ├── dog-friendly-hot-tub-lodges.astro
│   │   └── [region]/
│   │       ├── index.astro
│   │       └── [vertical].astro
│   └── styles/
│       └── global.css
├── AFFILIATES.md
└── README.md
```

## Acceptance criteria for sprint 1

The sprint is done when:

1. All 7 pages above render correctly with real (not lorem) content
2. Every page has unique meta title/description and proper schema
3. Internal linking rules are met (no orphans, footer has region map)
4. Lighthouse score 95+ on home, regional hub, and money page
5. Site deploys cleanly to Cloudflare Pages
6. Sitemap.xml is generated and valid
7. The Cornwall cottages page is genuinely good content — pass the test: would you read this if you were planning a trip? If not, the content needs another pass.

## After sprint 1

Sprint 2 (week 3-4): Build out 4 more regional hubs (Lake District, Snowdonia, Scotland, Yorkshire), all their cottage sub-pages, all their pub sub-pages. ~10 more pages.

Sprint 3 (week 5-6): Remaining tier 1 region (Yorkshire), all tier 2 regions (Norfolk, Northumberland, Dorset, Cotswolds, Devon). Add hotels and beaches sub-pages where data justifies. ~30 more pages.

Sprint 4 (month 2): Walks, restaurants verticals built out. Email capture. Search Console review and pivot based on impressions data.

## Key reference data

Vertical priority by UK volume:
- Food & drink (pubs, restaurants, cafes): 236k
- Cottages: 212k
- Hotels: 115k
- Lodges/glamping/hot-tubs: 90k
- Beaches: 55k

Region priority by aggregate UK volume (all KD ~0):
- Cornwall: 66,900
- Lake District: 60,550
- Snowdonia/Wales: 53,710
- Scotland: 48,570
- Yorkshire: 45,610
- Norfolk/Suffolk: 37,420
- Northumberland: 35,000 (every keyword KD 0)
- Dorset: 22,920
- Cotswolds: 21,410
- Devon: 19,720
- New Forest: 13,650
- London: 11,590
- Peak District: 11,120
- Isle of Wight: 9,390
- Sussex/Kent: 8,380

Highest-intent money keywords (build pages for these specifically):
- "dog friendly hot tub lodges" + 2 variants — 13k combined, KD 0
- "dog friendly self catering northumberland" — 4,400, KD 0
- "dog friendly cottages cornwall" — 4,400, KD 0
- "dog friendly cottages lake district" — 4,400, KD 0
- "dog friendly cottages norfolk" — 3,600, KD 0
- "dog friendly cottages scotland" — 3,600, KD 0
- "cotswolds dog friendly hotels" — 2,900, KD 0
- "dog friendly cabin wales" — 2,900, KD 0
- "dog friendly restaurants london" — 2,900, KD 0
