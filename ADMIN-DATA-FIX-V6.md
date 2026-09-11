# Admin data fix v6

- Fundraisers now render as soon as `/fundraisers/paginated` returns. Per-fundraiser overview enrichment happens in the background in small batches and each overview request times out after 7 seconds, so a slow overview endpoint cannot leave the whole table stuck on “Loading fundraisers…”.
- Campaign progress now treats the single-campaign response as authoritative for `fund_raised` / `raised_amount`, `goal_amount`, and contribution counts. It no longer recursively searches an overview payload first, which could select an aggregate amount (for example the same `$1.63`) and apply it to multiple campaigns.
- The overview response remains a fallback only when campaign-specific detail fields are absent.
