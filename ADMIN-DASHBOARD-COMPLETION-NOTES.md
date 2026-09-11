# GrowFund admin dashboard completion

Implemented without changing the dashboard shell/design:

- Campaign table fields/actions aligned to the supplied WordPress GrowFund screenshots.
- Campaign approve/decline, feature toggle, overview, edit, copy, trash/restore, empty trash and bulk actions.
- Donation fields aligned to supplied screenshot, including net amount and gateway fee; approve/decline, create, trash/restore/permanent delete, bulk actions and filters.
- Donor create/edit, detail columns, trash/restore/permanent delete, empty trash.
- Fundraiser create/edit, details/created campaigns/status/joined date, approve/decline, trash/restore/permanent delete, empty trash.
- Admin proxy now forwards the server-side GrowFund API key together with the user JWT for Combined Auth routes.
- Response parsing was made tolerant of nested `data/items/results/...` API payloads so fundraisers are not silently lost because of a response wrapper.

## Required deployment variable

The backend's Combined Auth endpoints require an API key. The frontend server must have:

`GROWFUND_CLIENT_API_KEY=<your existing GrowFund client API key>`

The key is intentionally not hardcoded into browser code.

## Campaign "Post an update"

The UI/modal was added to match the supplied reference. The provided `class-routes.php` does **not** register an endpoint for creating campaign update posts. For safety, the frontend does not fabricate an unsupported backend route. Once that endpoint is added to the backend, connect the modal submit handler in `AdminCampaignManager.tsx` to it.
