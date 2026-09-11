# Admin campaign auth + trash restore fix

- Admin campaign GET requests now obtain the GrowFund system token server-side and send it together with `X-API-Key`, while still requiring the logged-in user's JWT before proxying the request.
- This fixes the `Expected system token` 403 from `/api/admin/growfund/campaigns`.
- Trash filters now use `status=trash` and the UI recognises both `trash` and `trashed` response values.
- Campaigns and donations now expose `Restore selected` bulk actions.
- Campaigns, donations, donors, and fundraisers all expose individual Restore actions for trashed rows.
- Donor/fundraiser individual restore continues to use their supplied bulk-action restore endpoints with a single ID, because no dedicated single-item restore routes are registered for those resources.
