# Cloudflare system-token fix (v10)

The frontend no longer performs same-origin Worker self-fetches to `/api/auth/system-token` when it needs a GrowFund system token. On Cloudflare Workers those self-fetches can return an HTML/Cloudflare response instead of JSON, producing `System token endpoint returned invalid JSON`.

The affected routes now call the WordPress GrowFund endpoint directly with `X-API-Key` and parse its response safely.
