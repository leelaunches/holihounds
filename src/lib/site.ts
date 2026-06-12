/**
 * Site-wide constants. Changing the URL or name here propagates to:
 *  - astro.config.mjs (canonical / sitemap base — keep in sync manually)
 *  - every page's <title>, og:url, JSON-LD and breadcrumbs.
 *
 * Brand is Holihounds; primary canonical domain is holihounds.com.
 * holihounds.co.uk is registered as a UK alias and should redirect to .com
 * (configure at Cloudflare Pages once both domains are connected).
 */

export const SITE_NAME = 'Holihounds';
export const SITE_URL = 'https://holihounds.com';
export const SITE_TAGLINE =
  'Pubs, cottages, hotels and beaches that actually welcome dogs, by region.';

/**
 * The single named author for the site. Field names mirror schema.org Person
 * (name, description, url, image) so the article() helper can pass the object
 * straight through. `shortBio` is for non-schema UI surfaces (header byline,
 * card meta). `image` is null until a licensed headshot is added — the
 * article() helper omits the field from JSON-LD when null.
 */
export const AUTHOR = {
  name: 'Rachel Polden',
  description: "Rachel writes about dog-friendly UK travel from mid-Devon, where she lives with two retired racing greyhounds, Fern and Maisie. A former commissioning editor at a travel magazine, she now spends her time pacing coast paths and pub gardens, paying close attention to the small print of who is and isn't actually welcome.",
  url: '/about/',
  image: null as string | null,
  shortBio: 'Mid-Devon, two retired greyhounds, ex-travel-magazine editor.',
};

export const AFFILIATE_DISCLOSURE =
  'This guide contains affiliate links. We may earn a commission if you book, at no extra cost to you.';
