/**
 * Single source of truth for header + footer navigation, plus the registry
 * of routes that are currently built and reachable. The breadcrumb component
 * uses LIVE_ROUTES to self-heal: a segment becomes a link only when its
 * target route has shipped.
 *
 * As new pages ship in later sprints, add the URL to LIVE_ROUTES (and set
 * the corresponding `href` in VERTICALS / REGIONS for header/footer surfaces).
 */

export type NavItem = {
  slug: string;
  label: string;
  /** Set once the page exists. Omit until then; footer renders unlinked label. */
  href?: string;
};

export const VERTICALS: NavItem[] = [
  { slug: 'pubs', label: 'Pubs', href: '/pubs/' },
  { slug: 'cottages', label: 'Cottages', href: '/cottages/' },
  { slug: 'hotels', label: 'Hotels' },
  { slug: 'restaurants', label: 'Restaurants' },
  { slug: 'beaches', label: 'Beaches', href: '/beaches/' },
  { slug: 'walks', label: 'Walks' },
  { slug: 'hot-tub-lodges', label: 'Hot tub lodges', href: '/dog-friendly-hot-tub-lodges/' },
];

export const REGIONS: NavItem[] = [
  { slug: 'cornwall', label: 'Cornwall', href: '/cornwall/' },
  { slug: 'lake-district', label: 'Lake District', href: '/lake-district/' },
  { slug: 'yorkshire-dales', label: 'Yorkshire Dales', href: '/yorkshire-dales/' },
];

/**
 * Routes that have actually shipped (have a built Astro page). Distinct from
 * `href` fields above, which mark intent-to-ship within Sprint 1.
 *
 * This is the single source of truth for "is this link safe to render?".
 * Header, Footer, Breadcrumbs and AuthorByline all consult it; any chrome
 * link to a route not in this set is rendered as plain text or filtered out.
 * As each page ships, add its URL here and every component self-heals at
 * once.
 *
 * Update this set when each page ships:
 *  - Phase 2.4 ✓ /cornwall/cottages/
 *  - Phase 2.5 ✓ /cornwall/
 *  - Phase 2.6 ✓ /cottages/
 *  - Phase 2.7 ✓ /dog-friendly-hot-tub-lodges/
 *  - Phase 2.8 ✓ / (home)
 *  - Phase 2.9 ✓ /about/, /contact/, /privacy/
 *  - Region 2 ✓ /lake-district/, /lake-district/cottages/
 *  - Beaches ✓ /beaches/, /cornwall/beaches/, /lake-district/beaches/
 *  - Pubs ✓ /pubs/, /cornwall/pubs/, /lake-district/pubs/
 *  - Region 3 ✓ /yorkshire-dales/ + /cottages/, /beaches/, /pubs/
 */
export const LIVE_ROUTES: ReadonlySet<string> = new Set([
  '/',
  '/cornwall/',
  '/cornwall/cottages/',
  '/cornwall/beaches/',
  '/cornwall/pubs/',
  '/lake-district/',
  '/lake-district/cottages/',
  '/lake-district/beaches/',
  '/lake-district/pubs/',
  '/yorkshire-dales/',
  '/yorkshire-dales/cottages/',
  '/yorkshire-dales/beaches/',
  '/yorkshire-dales/pubs/',
  '/cottages/',
  '/beaches/',
  '/pubs/',
  '/dog-friendly-hot-tub-lodges/',
  '/dog-friendly-hot-tub-cottages-lake-district/',
  '/dog-friendly-hot-tub-cottages-scotland/',
  '/dog-friendly-hot-tub-cottages-cornwall/',
  '/dog-friendly-hot-tub-cottages-yorkshire-dales/',
  '/dog-friendly-cottages-enclosed-gardens/',
  '/dog-friendly-cottages-multiple-dogs/',
  '/dog-friendly-cottages-muddy-dogs/',
  '/large-dog-friendly-cottages/',
  '/dog-friendly-cottages-ground-floor/',
  '/about/',
  '/contact/',
  '/privacy/',
]);

/** Returns the href if the route is live, undefined otherwise. */
export function liveHref(href: string): string | undefined {
  return LIVE_ROUTES.has(href) ? href : undefined;
}

/**
 * Builds a self-healing breadcrumb item: linked when the route has shipped,
 * plain text otherwise. The breadcrumb auto-promotes to a link as soon as
 * the page lands in LIVE_ROUTES.
 */
export function crumb(name: string, href: string): { name: string; href?: string } {
  return { name, href: liveHref(href) };
}

/**
 * Live verticals — Header nav surfaces only verticals whose hub page has
 * actually shipped. Empty set during early Sprint 1 is intentional: the
 * header just shows the wordmark until /cottages/ or /dog-friendly-hot-tub-lodges/
 * lands.
 */
export const HEADER_VERTICALS = VERTICALS.filter(
  (v): v is Required<NavItem> => Boolean(v.href) && LIVE_ROUTES.has(v.href!),
);

/** Live verticals for the footer Browse column (same filter as the header). */
export const FOOTER_VERTICALS = HEADER_VERTICALS;

/** Live regions for the footer Regions column. */
export const FOOTER_REGIONS = REGIONS.filter(
  (r): r is Required<NavItem> => Boolean(r.href) && LIVE_ROUTES.has(r.href!),
);

/**
 * Utility links shown at the bottom of the footer (about, contact, privacy).
 * Filtered against LIVE_ROUTES — if none have shipped, the row is omitted.
 */
export const FOOTER_UTILITY = [
  { name: 'About', href: '/about/' },
  { name: 'Contact', href: '/contact/' },
  { name: 'Privacy', href: '/privacy/' },
].filter((link) => LIVE_ROUTES.has(link.href));
