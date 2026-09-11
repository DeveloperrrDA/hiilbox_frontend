# Build fixes in v8

This revision fixes the TypeScript/dependency errors reported by `next build`:

- Adds `next-themes` to dependencies.
- Adds `@opennextjs/cloudflare` and `wrangler` to devDependencies.
- Types campaign bulk-action IDs as `number[]` instead of `unknown[]`.
- Adds explicit `string` types to CampaignEditor `onChange` callback values.
- Uses a stable non-null receipt reference inside the PDF download callback.

After extracting, run:

```bash
npm install
npm run build
npx opennextjs-cloudflare build
```

If the OpenNext build succeeds, preview/deploy with Wrangler/OpenNext using the project's existing Cloudflare configuration.
