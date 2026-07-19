import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content collections.
 *
 * `slug` is derived from the file path by the glob loader — do not put it in
 * frontmatter. Reference cottages by their file basename, e.g. for
 * `src/content/listings/cornwall/old-coastguard-lookout.md` the id is
 * `cornwall/old-coastguard-lookout`.
 */

const regions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/regions' }),
  schema: z.object({
    name: z.string(),
    intro: z.string(),
    description: z.string(),
    hero_image: z.string(),
    best_for: z.array(z.string()).default([]),
    featured_listings: z.array(z.string()).default([]),
    related_regions: z.array(z.string()).default([]),
    meta_title: z.string(),
    meta_description: z.string(),
  }),
});

const listings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/listings' }),
  schema: z.object({
    name: z.string(),
    type: z.enum(['pub', 'cottage', 'hotel', 'restaurant', 'lodge', 'beach', 'walk']),
    region: z.string(),
    town: z.string(),
    description: z.string(),
    dog_policy: z.string(),
    amenities: z.array(z.string()).default([]),
    price_indicator: z.enum(['£', '££', '£££']),
    affiliate_link: z.string().nullable().default(null),
    affiliate_provider: z.string().nullable().default(null),
    external_url: z.string().url().nullable().default(null),
    image: z.string(),
    image_alt: z.string().optional(),
    lat: z.number().nullable().default(null),
    lng: z.number().nullable().default(null),
    sleeps: z.number().int().nullable().default(null),
    bedrooms: z.number().int().nullable().default(null),
    pet_charge: z.string().nullable().default(null),
    max_dogs: z.number().int().nullable().default(null),
    enclosed_garden: z.boolean().nullable().default(null),
    /**
     * Free-text qualifier on the garden status. Use when the boolean is too
     * binary to carry the actual situation (side-gap caveats, gravel surface
     * concerns, "decking only", "listing doesn't state enclosure", etc.).
     * When set, this replaces the boolean's auto-rendered text in the dog
     * policy box.
     */
    garden_note: z.string().nullable().default(null),
    dogs_allowed_in: z.string().nullable().default(null),
    dog_extras: z.string().nullable().default(null),
    /**
     * Honest single-level / step-free access descriptor, surfaced on
     * /dog-friendly-cottages-ground-floor/ (older/less-mobile dogs). Set ONLY
     * when the WHOLE property is single-storey/all-on-one-level — never for a
     * multi-storey cottage that merely has a ground-floor bedroom, or a "dogs
     * ground floor only" pet rule. State the real access truth including steps
     * or ramp, e.g. "Single-storey lodge with ramp access", "Single-level — but
     * 4 steps to the entrance". Null = does not qualify.
     */
    single_level: z.string().nullable().default(null),
    /**
     * Honest "walk to the pub" descriptor, surfaced on
     * /dog-friendly-cottages-near-a-pub/. Set ONLY where a pub is a genuine
     * walk (roughly a mile or less), quoting the real distance, e.g.
     * "Village pub 50 yards away", "The Boot Inn a 15-minute walk". Do NOT set
     * for a pub that's a drive away (2+ miles). Null = doesn't qualify.
     */
    walk_to_pub: z.string().nullable().default(null),
    /**
     * Free-form tags used to surface a property on cross-cutting pages.
     * Current values:
     *  - 'hot-tub' — appears on /dog-friendly-hot-tub-lodges/
     * As more cross-cutting money pages ship, add tag values here.
     */
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    intro: z.string(),
    meta_title: z.string(),
    meta_description: z.string(),
  }),
});

/**
 * Dog-friendly beaches and lakeshore swimming spots. Kept distinct from
 * `listings` because beaches aren't bookable affiliate products — they're
 * traffic/authority pages that interlink back to the cottage money pages via
 * `nearby_cottages` (an array of listing ids).
 *
 * The headline field is `dog_restriction`: most Cornish beaches ban dogs for
 * part of the year, and getting those dates right is the whole editorial point.
 * `dog_access` is the machine-readable category used for badging/filtering;
 * `restriction_detail` carries the exact dates/hours plus the source caveat
 * (council restrictions are reviewed annually — always hedged "check before
 * travel"). IDs derive from the file path, e.g. `cornwall/gwynver`.
 */
const beaches = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/beaches' }),
  schema: z.object({
    name: z.string(),
    region: z.string(),
    location: z.string(),
    description: z.string(),
    /** Machine-readable access category, drives the access-box badge + colour. */
    dog_access: z.enum(['year-round', 'seasonal', 'partial', 'lake-shore']),
    /** Headline access summary, e.g. "Year-round" or "Dogs banned 1 Jul–31 Aug". */
    dog_restriction: z.string(),
    /** Exact dates/hours + the "verify before travel" caveat when seasonal. */
    restriction_detail: z.string().nullable().default(null),
    /** Water-safety note — algae, currents, boat traffic (esp. lake shores). */
    safety_note: z.string().nullable().default(null),
    parking: z.string().nullable().default(null),
    facilities: z.array(z.string()).default([]),
    nearest_pub: z.string().nullable().default(null),
    /** Listing ids to interlink to the cottage money pages, e.g. `cornwall/ocean-edge`. */
    nearby_cottages: z.array(z.string()).default([]),
    image: z.string(),
    image_alt: z.string().optional(),
    lat: z.number().nullable().default(null),
    lng: z.number().nullable().default(null),
    featured: z.boolean().default(false),
  }),
});

/**
 * Dog-friendly pubs. Like `beaches`, a traffic/authority collection that
 * interlinks back to the cottage money pages (`nearby_cottages`) and the
 * beach guides (`nearby_beaches`). The headline field is `dog_access` — WHERE
 * in the pub dogs are actually allowed (throughout vs bar-only vs garden),
 * the specific most "dog-friendly pub" lists omit. Pub policies change with
 * ownership, so copy hedges and `external_url` points at the pub's own site.
 * IDs derive from the file path, e.g. `cornwall/the-gurnards-head`.
 */
const pubs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pubs' }),
  schema: z.object({
    name: z.string(),
    region: z.string(),
    location: z.string(),
    description: z.string(),
    /** Machine-readable access category, drives the pub-box badge + colour. */
    dog_access: z.enum(['throughout', 'bar-and-garden', 'bar-only', 'garden-only']),
    /** Headline policy summary in plain words. */
    dog_policy: z.string(),
    /** What's laid on — water bowls, treats, dog menu, blankets. */
    dog_extras: z.string().nullable().default(null),
    /** Food offering — gastropub, walkers' food, bar snacks, etc. */
    food: z.string().nullable().default(null),
    price_indicator: z.enum(['£', '££', '£££']).nullable().default(null),
    /** Dog-friendly rooms note (for the stay angle), or null if no rooms. */
    rooms: z.string().nullable().default(null),
    /** Listing ids to interlink to the cottage money pages. */
    nearby_cottages: z.array(z.string()).default([]),
    /** Beach ids to interlink to the beach guides. */
    nearby_beaches: z.array(z.string()).default([]),
    external_url: z.string().url().nullable().default(null),
    image: z.string(),
    image_alt: z.string().optional(),
    lat: z.number().nullable().default(null),
    lng: z.number().nullable().default(null),
    featured: z.boolean().default(false),
  }),
});

export const collections = { regions, listings, pages, beaches, pubs };
