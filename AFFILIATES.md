# Affiliate Links

All booking CTAs resolve their `href` at build time via `src/lib/affiliate.ts`.
The logic is simple: a CTA links to a **tracked Awin deeplink** when its
provider has a known Awin advertiser id, otherwise it links **direct** to the
property's own booking page (a working link, but untracked — no commission).

There is no longer any post-build token replacement — it's all done in code.

---

## Turning a merchant on (the only step once Awin approves an advertiser)

Add one line to `AWIN_MERCHANT_IDS` in `src/lib/affiliate.ts`:

```ts
export const AWIN_MERCHANT_IDS: Record<string, string> = {
  sykes: '12345',          // <- the Awin advertiser id (awinmid) for Sykes
  'cottages.com': '67890',
  hoseasons: '11223',
};
```

Then `npm run build` + push. Every CTA whose `affiliate_provider` matches a key
flips to a tracked link on that build; nothing else changes.

- **Publisher id** (`awinaffid`) is already set: `AWIN_PUBLISHER_ID = '2932845'`
  (Holihounds' Awin account). It's the same for every merchant.
- **Advertiser id** (`awinmid`) is per-merchant — find it in Awin under
  Advertisers → the approved merchant (also in deeplinks as `awinmid=`).

Generated link format:
`https://www.awin1.com/cread.php?awinmid={MID}&awinaffid=2932845&ued={ENCODED_PROPERTY_URL}`
— the `ued` destination is each listing's `external_url`.

---

## Current state (18 Jun 2026)

- Publisher approved by Awin (account 2932845). **Advertiser approvals pending.**
- `AWIN_MERCHANT_IDS` is empty → **every CTA currently links direct** (working,
  untracked). Add ids as approvals land.

## Provider inventory (by listing `affiliate_provider`)

| Provider | Listings | On Awin? | Action |
|---|---|---|---|
| `sykes` | 33 | yes (pending) | add `awinmid` when approved |
| `cottages.com` | 6 | yes (pending) | add `awinmid` when approved |
| `hoseasons` | 6 | yes (pending) | add `awinmid` when approved |
| `aspects-holidays` | 2 | no (independent) | stays direct |
| `kernock-cottages` | 1 | no (direct/independent) | stays direct |
| `null` (Yorkshire Dales independents) | 2 | no | stays direct |

To re-inventory after content changes:
```bash
grep -rhoE '^affiliate_provider: \S+' src/content/listings/ | sort | uniq -c
```
