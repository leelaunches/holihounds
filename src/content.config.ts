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

export const collections = { regions, listings, pages };
