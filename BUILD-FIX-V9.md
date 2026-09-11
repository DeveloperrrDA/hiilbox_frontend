# Build Fix V9

Fixed the Next.js prerender failure on `/donate`.

The `/donate` route was incorrectly implemented as if it were a dynamic campaign route and tried to read `params.id`, even though `/donate` has no `[id]` segment. During static prerendering this produced `Number(undefined)` => `NaN`, causing `getCampaign()` to throw `Invalid campaign ID.`

`/donate` now redirects to `/campaigns`, which is also the correct fallback when checkout is opened without a campaign. Campaign-specific donation continues through `/checkout?campaign=<id>&title=<title>` from the campaign page.
