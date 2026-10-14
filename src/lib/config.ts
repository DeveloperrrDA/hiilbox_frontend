export const config = {
  wordpressUrl:
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    "https://cms.hiilbox.com",

  apiBaseUrl:
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1",

  growfundApiBaseUrl:
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1",

  gfcmApiBaseUrl:
    process.env.NEXT_PUBLIC_GFCM_API_URL ||
    "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1",

  gfcmClientApiKey:
    process.env.GROWFUND_CLIENT_API_KEY || "",
};