# Admin endpoints implemented in v7

The newly added Campaign Post Update API routes are wired into the existing admin Campaigns page without changing the dashboard shell/design.

Implemented:
- GET `campaign/updates/paginated` - View updates for a campaign.
- GET `campaign/update/{id}/detail` - Open a campaign update detail.
- POST `campaign/update/create` - "Post an update" now publishes to the backend.
- POST `campaign/update/comment/create` - Add a comment to an update.
- GET `campaign/update/comments/paginated` - Load comments for an update.
- Existing `/media` flow is used to upload update images before publishing.

The existing authenticated admin proxy already allows the `campaign/...` route family, so these new JWT-protected endpoints pass through the same authenticated server-side route used by the rest of the admin dashboard.
