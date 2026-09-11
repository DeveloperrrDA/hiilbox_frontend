# Checkout, receipt and authentication UI changes

## Checkout
- Checkout payment/order API contract and validation logic are unchanged.
- Existing campaign image loading is preserved.
- The campaign image is visible in the main campaign block and again in the sticky donation summary.
- Theme `Input` and `Button` components are used for the core donor form and submit/back actions.
- Existing currencies, tip calculation, donor details, anonymous option, gateway grouping, wallet requirements and payment flow remain in place.

## Donation receipt popup
- Confirmed synchronous payments no longer navigate away from checkout.
- A Hiilbox-themed receipt dialog opens immediately after confirmation.
- Receipt includes donation/order number, campaign, donor, donation amount, Hiilbox support amount, total, payment method/status and transaction ID where available.
- `Download PDF` creates a real PDF receipt in the browser using the project's existing `jspdf` dependency.
- Redirect-based payment gateways preserve receipt context in session storage. On return, `/donation-success` acts as a callback surface and automatically opens the same receipt dialog rather than presenting the old success page.
- The order-status proxy now exposes safe receipt metadata already stored on the WooCommerce order, including original donor-selected currency/amounts and campaign ID.

## Login / dashboard navigation
- Public headers detect the existing `access_token`.
- Logged out: Login is shown.
- Logged in: Login disappears and Dashboard + Logout are shown.
- Mobile navigation follows the same behavior.
- Logout clears access token, refresh token and cached auth user then returns to Home.
- Dashboard sidebar and desktop dashboard header now include a Home link back to `/`.

No checkout API endpoints, payment-gateway calls, amount conversion rules or GrowFund payment behavior were replaced.
