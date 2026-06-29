/**
 * Affiliate link resolution.
 *
 * Every "Check availability" CTA resolves to a tracked Awin deeplink WHEN the
 * listing's provider has a known Awin advertiser id below — otherwise it links
 * straight to the property's own booking page (a working link, but untracked,
 * so it earns no commission).
 *
 * Turning a merchant "on" once Awin approves it = add one line to
 * `AWIN_MERCHANT_IDS`. Nothing else changes; every CTA for that provider
 * starts tracking on the next build.
 */

/** Holihounds' Awin publisher (affiliate) id — appears in every tracked link. */
export const AWIN_PUBLISHER_ID = '2932845';

/**
 * Awin advertiser (merchant) ids, keyed by the `affiliate_provider` value in
 * listing frontmatter. Fill each in as Awin approves that advertiser.
 *
 * Approved + live:
 *   - hoseasons      (6 listings) — approved 18 Jun 2026, awinmid 118651
 *
 * Pending Awin advertiser approval (add the id here when it lands):
 *   - sykes          (33 listings — the big one)
 *   - cottages.com   (6 listings)
 *
 * Not Awin merchants (always link direct, never add ids here):
 *   - aspects-holidays, kernock-cottages, direct/independent (null provider)
 */
export const AWIN_MERCHANT_IDS: Record<string, string> = {
  hoseasons: '118651', // approved 18 Jun 2026
  // sykes: '00000',
  // 'cottages.com': '00000',
};

/**
 * Resolve a listing's booking link: a tracked Awin deeplink when the provider's
 * advertiser id is known, otherwise the direct property URL.
 */
export function affiliateHref(provider: string | null, externalUrl: string | null): string {
  const mid = provider ? AWIN_MERCHANT_IDS[provider] : undefined;
  if (mid && externalUrl) {
    return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${AWIN_PUBLISHER_ID}&ued=${encodeURIComponent(externalUrl)}`;
  }
  return externalUrl ?? '#';
}

/** True once a provider is an approved, tracking Awin merchant. */
export function isTracked(provider: string | null): boolean {
  return Boolean(provider && AWIN_MERCHANT_IDS[provider]);
}
