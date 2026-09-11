# Admin filtering v5

Added before shipping v4:

- Campaign status filter now includes Pending, Launched, Published, Active, Funded, Completed, Draft, Declined, Cancelled and Trash.
- Date range filtering added to Campaigns, Donations, Donors and Fundraisers.
- Donations and Donors send `start_date` / `end_date` to backend endpoints because those routes declare those parameters.
- Campaigns and Fundraisers apply the date range to the real enriched created/joined date data client-side because the provided `class-routes.php` list routes do not declare start/end date parameters for those resources.
- Existing dashboard layout/components/styles were retained.
