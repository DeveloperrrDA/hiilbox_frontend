# Admin real-data enrichment fix

- Campaign rows are now enriched from both `GET /campaigns/{id}` and `GET /campaigns/{id}/overview`.
- Funding progress and donation counts prefer the overview analytics response, avoiding a lightweight list response's placeholder zero values.
- Campaign Date Created is displayed from the real campaign/detail response when supplied by GrowFund.
- Fundraiser rows are enriched from `GET /fundraiser/{id}/overview`; Created Campaigns and Joined Date read nested overview fields as well as list fields.
- No values are fabricated. If the backend overview/detail response does not supply a field, the UI continues to display an em dash/zero rather than inventing data.
