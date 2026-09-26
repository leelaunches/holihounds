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
  name: 'Lee Launches',
  description: "Lee writes Holihounds from the Isle of Wight, where he lives with his dog Levi and walks and sits dogs for other people — which means a steady stream of other people's dogs, and a lot of different opinions about what makes a place work. He builds the site himself, and spends his time on coast paths and in pub gardens paying close attention to the small print of who is and isn't actually welcome.",
  url: '/about/',
  image: null as string | null,
  shortBio: "Isle of Wight, his own dog Levi and plenty of other people's.",
};

export const AFFILIATE_DISCLOSURE =
  'This guide contains affiliate links. We may earn a commission if you book, at no extra cost to you.';
