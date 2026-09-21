export interface CampaignImageSize {
  height: number;
  width: number;
  url: string;
  orientation: string;
}

export interface CampaignImage {
  id: string;
  filename: string;
  url: string;
  sizes?: {
    medium?: CampaignImageSize;
    thumbnail?: CampaignImageSize;
    woocommerce_thumbnail?: CampaignImageSize;
    woocommerce_gallery_thumbnail?: CampaignImageSize;
  };
  height: number;
  width: number;
  filesize: number;
  mime: string;
  type: string;
  thumb: string | null;
  author: string;
  author_name: string;
  date: string;
}

export interface CampaignUpdateImage {
  id: string;
  filename: string;
  url: string;
  sizes?: {
    medium?: CampaignImageSize;
    thumbnail?: CampaignImageSize;
    woocommerce_thumbnail?: CampaignImageSize;
    woocommerce_gallery_thumbnail?: CampaignImageSize;
  };
  height: number;
  width: number;
  filesize: number;
  mime: string;
  type: string;
  thumb: string | null;
  author: string;
  author_name: string;
  date: string;
}

export interface CampaignPerson {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email?: string | null;
  username?: string | null;
  image?: string | null;
  phone?: string | null;
}

export interface CampaignVideo {
  id: string;
  url: string;
}

export interface CampaignSuggestedOption {
  amount: number;
  description: string;
  is_default: boolean;
}

export interface CampaignFaq {
  question: string;
  answer: string;
}

export interface CampaignDonation {
  id: string;
  donor_name: string;
  amount: number;
  currency: string;
  created_at: string | null;
  is_anonymous: boolean;
}

export interface Campaign {
  id: number;
  title: string;
  slug: string;
  description: string;
  story: string;

  goal: number;
  raised_amount: number;
  image_url: string;

  fundraiser_name: string;
  fundraiser_id: string;

  created_at: string;
  deadline: string;
  status: string;

  images: CampaignImage[];
  video: CampaignVideo | null;

  is_featured: boolean;
  category: string | null;
  sub_category: string | null;

  start_date: string | null;
  end_date: string | null;
  location: string | null;

  tags: unknown[];
  collaborators: unknown[];
  show_collaborator_list: boolean;

  risk: string | null;

  has_goal: boolean;
  is_half_goal_achieved_already: boolean;
  goal_type: string;
  goal_amount: number;

  reaching_action: string;

  confirmation_title: string | null;
  confirmation_description: string | null;
  provide_confirmation_pdf_receipt: boolean;

  number_of_contributors: number;
  number_of_contributions: number;
  number_of_individual_contributions: number;

  appreciation_type: string | null;
  giving_thanks: string | null;
  rewards: unknown;

  allow_local_pickup: boolean;
  is_ready_for_pickup: boolean;

  allow_pledge_without_reward: boolean;
  min_pledge_amount: number | null;
  max_pledge_amount: number | null;
  uncharged_pledge_count: number | null;

  is_backed: boolean | null;
  is_paused: boolean;
  is_hidden: boolean;

  tribute_options: unknown[];
  last_decline_reason: string | null;

  author: CampaignPerson | null;
  fundraiser: CampaignPerson | null;

  is_interactive: boolean;
  is_launched: boolean;
  is_ended: boolean;

  fund_raised: number;

  preview_url: string | null;

  allow_custom_donation: boolean;
  min_donation_amount: number | null;
  max_donation_amount: number | null;

  suggested_option_type: string | null;
  suggested_options: CampaignSuggestedOption[];

  has_tribute: boolean;
  tribute_requirement: string | null;
  tribute_title: string | null;
  tribute_notification_preference: string | null;

  fund_selection_type: string | null;
  default_fund: unknown;
  fund_choices: unknown;

  faqs: CampaignFaq[];

  is_bookmarked: boolean;
  recent_donations: CampaignDonation[];
}

export interface CampaignUpdate {
  id: number;
  campaign_id: number;
  title: string;
  slug: string;

  image: CampaignUpdateImage[];

  description: string;

  created_by_id: number;
  created_by_name: string;
  created_by_role: string;
  created_by_image: string;

  created_at: string;
  comments: number;
  likes: number;

}

export interface CampaignPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface CampaignUpdatePagination {
  page: number;
  per_page: number;
}

export interface CampaignsResponse {
  success: boolean;
  data: Campaign[];
  pagination: CampaignPagination;
}

export interface CampaignUpdatesResponse {
  success: boolean;
  data: CampaignUpdate[];
  pagination: CampaignUpdatePagination;
}

export interface GetCampaignsParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_slug?: string;
  orderby?: string;
  order?: "asc" | "desc";
  is_featured?: boolean;
  status?: string;
}

export interface GetCampaignUpdatesParams {
  page?: number;
  per_page?: number;
  campaign_id?: number;
}


function parseMaybeJson(value: unknown): any {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
    try { return JSON.parse(trimmed); } catch { return value; }
  }
  return value;
}

function absoluteImageUrl(value: unknown): string {
  if (!value) return "";
  const parsed = parseMaybeJson(value);
  if (typeof parsed !== "string") return "";
  const url = parsed.trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const wp = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.hiilbox.com").replace(/\/$/, "");
  return `${wp}/${url.replace(/^\//, "")}`;
}

function normalizeCampaignImages(raw: any): CampaignImage[] {
  const parsed = parseMaybeJson(raw?.images);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === "object") return Object.values(parsed) as CampaignImage[];
  return [];
}

function normalizeCampaignUpdateImages(raw: any): CampaignUpdateImage[] {
  const parsed = parseMaybeJson(raw?.image);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === "object") return Object.values(parsed) as CampaignUpdateImage[];
  return [];
}

function campaignImageUrl(raw: any, images: CampaignImage[]): string {
  const first: any = images[0] ?? null;
  const candidates = [
    raw?.image_url,
    raw?.featured_image_url,
    raw?.featured_image,
    raw?.thumbnail_url,
    raw?.thumbnail,
    typeof raw?.image === "string" ? raw.image : null,
    raw?.image?.url,
    raw?.image?.src,
    first?.url,
    first?.src,
    first?.sizes?.large?.url,
    first?.sizes?.medium?.url,
    first?.sizes?.woocommerce_thumbnail?.url,
    first?.thumb,
  ];
  for (const candidate of candidates) {
    const url = absoluteImageUrl(candidate);
    if (url) return url;
  }
  return "";
}


function normalizeRecentDonations(raw: any): CampaignDonation[] {
  const candidates = [
    raw?.recent_donations,
    raw?.donations,
    raw?.recent_contributions,
    raw?.contributions,
    raw?.donation_feed,
    raw?.activity?.donations,
  ];
  const source = candidates.find(Array.isArray) ?? [];
  return source.map((item: any, index: number) => {
    const isAnonymous = Boolean(item?.is_anonymous ?? item?.anonymous ?? item?.hide_name);
    const person = item?.donor ?? item?.contributor ?? item?.user ?? null;
    const name = isAnonymous
      ? "Anonymous"
      : String(
          item?.donor_name ??
          item?.contributor_name ??
          item?.name ??
          person?.display_name ??
          [person?.first_name, person?.last_name].filter(Boolean).join(" ") ??
          "Supporter"
        ).trim() || "Supporter";
    return {
      id: String(item?.id ?? item?.donation_id ?? item?.contribution_id ?? index),
      donor_name: name,
      amount: Number(item?.amount ?? item?.donation_amount ?? item?.total ?? item?.value ?? 0),
      currency: String(item?.currency ?? item?.currency_code ?? "USD").toUpperCase(),
      created_at: item?.created_at ?? item?.date ?? item?.created ?? null,
      is_anonymous: isAnonymous,
    };
  }).filter((item: CampaignDonation) => Number.isFinite(item.amount) && item.amount >= 0);
}

/**
 * Normalize a raw campaign from the WordPress/GrowFund API
 * into the structure expected by the Next.js frontend.
 */
function normalizeCampaign(raw: any): Campaign {
  const normalizedImages = normalizeCampaignImages(raw);

  const fundraiser =
    raw?.fundraiser ??
    raw?.author ??
    null;

  return {
    id: Number(raw?.id ?? 0),

    title: raw?.title ?? "",

    slug: raw?.slug ?? "",

    description:
      raw?.description ??
      raw?.story ??
      "",

    story:
      raw?.story ??
      raw?.description ??
      "",

    goal: Number(
      raw?.goal_amount ??
      raw?.goal ??
      0
    ),

    raised_amount: Number(
      raw?.fund_raised ??
      raw?.raised_amount ??
      0
    ),

    image_url: campaignImageUrl(raw, normalizedImages),

    fundraiser_name:
      fundraiser?.display_name ||
      [
        fundraiser?.first_name,
        fundraiser?.last_name,
      ]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      "Anonymous fundraiser",

    fundraiser_id: String(
      fundraiser?.id ?? ""
    ),

    created_at:
      raw?.start_date ??
      raw?.created_at ??
      "",

    deadline:
      raw?.end_date ??
      raw?.deadline ??
      "",

    status:
      raw?.status ??
      "",

    images: normalizedImages,

    video:
      raw?.video ??
      null,

    is_featured:
      Boolean(raw?.is_featured),

    category:
      raw?.category !== undefined &&
      raw?.category !== null
        ? String(raw.category)
        : null,

    sub_category:
      raw?.sub_category !== undefined &&
      raw?.sub_category !== null
        ? String(raw.sub_category)
        : null,

    start_date:
      raw?.start_date ??
      null,

    end_date:
      raw?.end_date ??
      null,

    location:
      raw?.location ??
      null,

    tags:
      Array.isArray(raw?.tags)
        ? raw.tags
        : [],

    collaborators:
      Array.isArray(raw?.collaborators)
        ? raw.collaborators
        : [],

    show_collaborator_list:
      Boolean(
        raw?.show_collaborator_list
      ),

    risk:
      raw?.risk ??
      null,

    has_goal:
      Boolean(raw?.has_goal),

    is_half_goal_achieved_already:
      Boolean(
        raw?.is_half_goal_achieved_already
      ),

    goal_type:
      raw?.goal_type ??
      "",

    goal_amount:
      Number(
        raw?.goal_amount ??
        raw?.goal ??
        0
      ),

    reaching_action:
      raw?.reaching_action ??
      "",

    confirmation_title:
      raw?.confirmation_title ??
      null,

    confirmation_description:
      raw?.confirmation_description ??
      null,

    provide_confirmation_pdf_receipt:
      Boolean(
        raw?.provide_confirmation_pdf_receipt
      ),

    number_of_contributors:
      Number(
        raw?.number_of_contributors ??
        0
      ),

    number_of_contributions:
      Number(
        raw?.number_of_contributions ??
        0
      ),

    number_of_individual_contributions:
      Number(
        raw?.number_of_individual_contributions ??
        0
      ),

    appreciation_type:
      raw?.appreciation_type ??
      null,

    giving_thanks:
      raw?.giving_thanks ??
      null,

    rewards:
      raw?.rewards ??
      null,

    allow_local_pickup:
      Boolean(
        raw?.allow_local_pickup
      ),

    is_ready_for_pickup:
      Boolean(
        raw?.is_ready_for_pickup
      ),

    allow_pledge_without_reward:
      Boolean(
        raw?.allow_pledge_without_reward
      ),

    min_pledge_amount:
      raw?.min_pledge_amount !== null &&
      raw?.min_pledge_amount !== undefined
        ? Number(raw.min_pledge_amount)
        : null,

    max_pledge_amount:
      raw?.max_pledge_amount !== null &&
      raw?.max_pledge_amount !== undefined
        ? Number(raw.max_pledge_amount)
        : null,

    uncharged_pledge_count:
      raw?.uncharged_pledge_count !== null &&
      raw?.uncharged_pledge_count !== undefined
        ? Number(
            raw.uncharged_pledge_count
          )
        : null,

    is_backed:
      raw?.is_backed === null ||
      raw?.is_backed === undefined
        ? null
        : Boolean(raw.is_backed),

    is_paused:
      Boolean(raw?.is_paused),

    is_hidden:
      Boolean(raw?.is_hidden),

    tribute_options:
      Array.isArray(
        raw?.tribute_options
      )
        ? raw.tribute_options
        : [],

    last_decline_reason:
      raw?.last_decline_reason ??
      null,

    author:
      raw?.author ??
      null,

    fundraiser:
      raw?.fundraiser ??
      null,

    is_interactive:
      Boolean(raw?.is_interactive),

    is_launched:
      Boolean(raw?.is_launched),

    is_ended:
      Boolean(raw?.is_ended),

    fund_raised:
      Number(
        raw?.fund_raised ??
        raw?.raised_amount ??
        0
      ),

    preview_url:
      raw?.preview_url ??
      null,

    allow_custom_donation:
      Boolean(
        raw?.allow_custom_donation
      ),

    min_donation_amount:
      raw?.min_donation_amount !== null &&
      raw?.min_donation_amount !== undefined
        ? Number(
            raw.min_donation_amount
          )
        : null,

    max_donation_amount:
      raw?.max_donation_amount !== null &&
      raw?.max_donation_amount !== undefined
        ? Number(
            raw.max_donation_amount
          )
        : null,

    suggested_option_type:
      raw?.suggested_option_type ??
      null,

    suggested_options:
      Array.isArray(
        raw?.suggested_options
      )
        ? raw.suggested_options
        : [],

    has_tribute:
      Boolean(raw?.has_tribute),

    tribute_requirement:
      raw?.tribute_requirement ??
      null,

    tribute_title:
      raw?.tribute_title ??
      null,

    tribute_notification_preference:
      raw?.tribute_notification_preference ??
      null,

    fund_selection_type:
      raw?.fund_selection_type ??
      null,

    default_fund:
      raw?.default_fund ??
      null,

    fund_choices:
      raw?.fund_choices ??
      null,

    faqs:
      Array.isArray(raw?.faqs)
        ? raw.faqs
        : [],

    is_bookmarked:
      Boolean(raw?.is_bookmarked),

    recent_donations: normalizeRecentDonations(raw),
  };
}

/**
 * Normalize a raw campaign from the WordPress/GrowFund API
 * into the structure expected by the Next.js frontend.
 */
function normalizeCampaignUpdate(raw: any): CampaignUpdate {
  const normalizedImages = normalizeCampaignUpdateImages(raw);

  

  return {
    id: Number(raw?.id ?? 0),

    campaign_id: Number(raw?.campaign_id ?? 0),
    title: String(raw?.title ?? ""),
    slug: String(raw?.slug ?? ""),

    image: normalizedImages,

    description: String(raw?.description ?? ""),
    created_by_id: Number(raw?.created_by_id ?? 0),
    created_by_name: String(raw?.created_by_name ?? ""),
    created_by_role: String(raw?.created_by_role ?? ""),
    created_by_image: String(raw?.created_by_image.url ?? ""),

    created_at: String(raw?.created_at ?? ""),
    comments: Number(raw?.comments ?? ""),
    likes: Number(raw?.likes ?? ""),

  };
}

/**
 * Build query parameters for the campaigns endpoint.
 */
function buildQuery(
  params: GetCampaignsParams
): string {
  const searchParams =
    new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set(
      "page",
      String(params.page)
    );
  }

  if (params.per_page !== undefined) {
    searchParams.set(
      "per_page",
      String(params.per_page)
    );
  }

  if (params.search) {
    searchParams.set(
      "search",
      params.search
    );
  }

  if (params.category_slug) {
    searchParams.set(
      "category_slug",
      params.category_slug
    );
  }

  if (params.orderby) {
    searchParams.set(
      "orderby",
      params.orderby
    );
  }

  if (params.order) {
    searchParams.set(
      "order",
      params.order
    );
  }

  if (
    params.is_featured !== undefined
  ) {
    searchParams.set(
      "is_featured",
      String(params.is_featured)
    );
  }

  if (params.status) {
    searchParams.set(
      "status",
      params.status
    );
  }

  return searchParams.toString();
}

/**
 * Return the correct URL depending on where
 * this function is being executed.
 *
 * Browser:
 *   /api/campaigns
 *
 * Next.js server:
 *   http://localhost:3000/api/campaigns
 *
 * This fixes:
 * "Failed to parse URL from /api/campaigns"
 */
function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }

  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}
const WORDPRESS_API = (
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1"
).replace(/\/$/, "");

async function getGrowfundSystemToken(): Promise<string> {
  const apiKey = process.env.GROWFUND_CLIENT_API_KEY;

  if (!apiKey) {
    throw new Error("GROWFUND_CLIENT_API_KEY is not configured");
  }

  const response = await fetch(`${WORDPRESS_API}/auth/system-token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-API-Key": apiKey,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.system_access_token) {
    throw new Error(
      data?.message || "Unable to obtain GrowFund system access token."
    );
  }

  return String(data.system_access_token);
}

async function growfundServerFetch(path: string): Promise<Response> {
  const apiKey = process.env.GROWFUND_CLIENT_API_KEY;

  if (!apiKey) {
    throw new Error("GROWFUND_CLIENT_API_KEY is not configured");
  }

  const token = await getGrowfundSystemToken();

  return fetch(`${WORDPRESS_API}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "X-API-Key": apiKey,
    },
    cache: "no-store",
  });
}
/**
 * Extract campaigns from the different response
 * structures returned by the GrowFund API.
 *
 * Your current backend response uses:
 *
 * paginated.results
 *
 * not:
 *
 * data
 */
function extractCampaigns(
  responseData: any
): any[] {
  if (
    Array.isArray(responseData?.data)
  ) {
    return responseData.data;
  }

  if (
    Array.isArray(
      responseData?.paginated?.results
    )
  ) {
    return responseData.paginated.results;
  }

  if (
    Array.isArray(responseData?.results)
  ) {
    return responseData.results;
  }

  if (
    Array.isArray(responseData)
  ) {
    return responseData;
  }

  return [];
}

/**
 * Extract campaign updates from the different response
 * structures returned by the GrowFund API.
 *
 * Your current backend response uses:
 *
 * paginated.results
 *
 * not:
 *
 * data
 */
function extractCampaignUpdates(
  responseData: any
): any[] {
  if (
    Array.isArray(responseData?.data)
  ) {
    return responseData.data;
  }

  if (
    Array.isArray(
      responseData?.paginated?.results
    )
  ) {
    return responseData.paginated.results;
  }

  if (
    Array.isArray(responseData?.results)
  ) {
    return responseData.results;
  }

  if (
    Array.isArray(responseData)
  ) {
    return responseData;
  }

  return [];
}

/**
 * Get campaigns.
 */
export async function getCampaigns(
  params: GetCampaignsParams = {}
): Promise<CampaignsResponse> {
  const query =
    buildQuery(params);

  const baseUrl =
    getApiBaseUrl();

  const endpoint =
    `/api/campaigns${
      query ? `?${query}` : ""
    }`;

  const url =
    `${baseUrl}${endpoint}`;

  console.log(
    "GET CAMPAIGNS FROM:",
    url
  );
const response =
  typeof window === "undefined"
    ? await growfundServerFetch(
        `/campaigns${query ? `?${query}` : ""}`
      )
    : await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

  let data: any = null;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ??
        "Failed to load campaigns."
    );
  }

  const rawCampaigns =
    extractCampaigns(data);

  const campaigns =
    rawCampaigns.map(
      normalizeCampaign
    );

  /**
   * Your API currently returns:
   *
   * paginated: {
   *   results: [...],
   *   count: 4,
   *   total: 4,
   *   current_page: 1,
   *   per_page: 10,
   *   has_more: false,
   *   overall: 11
   * }
   */
  const paginated =
    data?.paginated;

  const pagination: CampaignPagination = {
    page:
      Number(
        paginated?.current_page ??
        data?.pagination?.page ??
        params.page ??
        1
      ),

    per_page:
      Number(
        paginated?.per_page ??
        data?.pagination?.per_page ??
        params.per_page ??
        campaigns.length
      ),

    total:
      Number(
        paginated?.total ??
        data?.pagination?.total ??
        campaigns.length
      ),

    total_pages:
      Number(
        data?.pagination?.total_pages ??
        Math.ceil(
          Number(
            paginated?.total ??
            campaigns.length
          ) /
          Math.max(
            1,
            Number(
              paginated?.per_page ??
              params.per_page ??
              campaigns.length
            )
          )
        )
      ),
  };

  return {
    success:
      Boolean(
        data?.success ??
        true
      ),

    data: campaigns,

    pagination,
  };
}

/**
 * Get one campaign by ID.
 *
 * This first tries the dedicated:
 *
 * /api/campaigns/[id]
 *
 * endpoint.
 *
 * If that endpoint does not exist, it falls back
 * to fetching the campaigns list and finding the
 * requested campaign by ID.
 */
export async function getCampaign(
  id: number
): Promise<{
  success: boolean;
  data: Campaign;
}> {
  if (!Number.isFinite(id)) {
    throw new Error(
      "Invalid campaign ID."
    );
  }

  const baseUrl =
    getApiBaseUrl();

  /**
   * First try the dedicated campaign endpoint.
   */
  const directUrl =
    `${baseUrl}/api/campaigns/${id}`;

  console.log(
    "GET CAMPAIGN FROM:",
    directUrl
  );

  let response: Response;

  try {
   response =
  typeof window === "undefined"
    ? await growfundServerFetch(`/campaigns/${id}`)
    : await fetch(directUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });
  } catch (error) {
    console.error(
      "DIRECT CAMPAIGN REQUEST ERROR:",
      error
    );

    response =
      new Response(null, {
        status: 500,
      });
  }

  let data: any = null;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }

  /**
   * If /api/campaigns/[id] works,
   * return that campaign.
   */
  if (
    response.ok &&
    data?.data
  ) {
    return {
      success:
        Boolean(
          data?.success ??
          true
        ),

      data:
        normalizeCampaign(
          data.data
        ),
    };
  }

  /**
   * FALLBACK:
   *
   * Fetch the campaigns list and find
   * the clicked campaign by ID.
   *
   * This is particularly important because
   * your current backend response is returning
   * campaigns inside paginated.results.
   */
  console.log(
    `Falling back to campaign list lookup for ID ${id}`
  );

  const campaignsResponse =
    await getCampaigns({
      page: 1,
      per_page: 100,
      status: "published",
    });

  const campaign =
    campaignsResponse.data.find(
      (item) =>
        Number(item.id) ===
        Number(id)
    );

  if (!campaign) {
    throw new Error(
      data?.message ??
        `Campaign ${id} was not found.`
    );
  }

  return {
    success: true,
    data: campaign,
  };
}
export async function getCampaignRecentDonations(id: number): Promise<CampaignDonation[]> {
  if (!Number.isFinite(id) || id <= 0) return [];

  const wordpressApi = (
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1"
  ).replace(/\/$/, "");
  const apiKey = process.env.GROWFUND_CLIENT_API_KEY;
  if (!apiKey) {
    console.error("Donation feed unavailable: GROWFUND_CLIENT_API_KEY is not configured on the server.");
    return [];
  }

  try {
    const tokenResponse = await fetch(`${wordpressApi}/auth/system-token`, {
      method: "POST",
      headers: { Accept: "application/json", "X-API-Key": apiKey },
      cache: "no-store",
    });
    const tokenData = await tokenResponse.json().catch(() => null);
    const token = tokenData?.system_access_token;
    if (!tokenResponse.ok || !token) return [];

    const all: any[] = [];
    const perPage = 100;
    const maxPages = 20;

    for (let page = 1; page <= maxPages; page += 1) {
      const url = `${wordpressApi}/campaigns/${id}/donation-feed?page=${page}&per_page=${perPage}`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-API-Key": apiKey,
        },
        cache: "no-store",
      });
      if (!response.ok) {
        console.error(`GrowFund donation feed request failed for campaign ${id}: ${response.status}`);
        break;
      }

      const payload = await response.json().catch(() => null);
      const batch = Array.isArray(payload?.data) ? payload.data : [];
      if (!batch.length) break;
      all.push(...batch);

      const totalPages = Number(payload?.pagination?.total_pages ?? 0);
      if ((totalPages > 0 && page >= totalPages) || batch.length < perPage) break;
    }

    return all
      .map((item: any, index: number): CampaignDonation & { status?: string } => ({
        id: String(item?.id ?? index),
        donor_name: String(item?.is_anonymous ? "Anonymous" : item?.donor_name || "Anonymous"),
        amount: Number(item?.amount ?? 0) || 0,
        currency: String(item?.currency ?? "USD").toUpperCase(),
        created_at: item?.created_at ?? item?.date ?? null,
        is_anonymous: Boolean(item?.is_anonymous),
        status: String(item?.status ?? "").toLowerCase(),
      }))
      .filter((item) => !["failed", "cancelled", "canceled", "refunded", "reversed", "void"].includes(item.status ?? ""))
      .sort((a, b) => {
        const aTime = a.created_at ? Date.parse(a.created_at) : 0;
        const bTime = b.created_at ? Date.parse(b.created_at) : 0;
        return bTime - aTime || Number(b.id) - Number(a.id);
      })
      .map(({ status: _status, ...donation }) => donation);
  } catch {
    return [];
  }
}

/**
 * Get campaign Updates.
 */
export async function getCampaignUpdates(
  params: GetCampaignUpdatesParams = {}
): Promise<CampaignUpdatesResponse> {
  // Build the query safely and natively
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.per_page) queryParams.append("per_page", params.per_page.toString());
  if (params.campaign_id) queryParams.append("campaign_id", params.campaign_id.toString());

  const query = queryParams.toString();

  const baseUrl =
    getApiBaseUrl();

  const endpoint = `/api/campaigns/updates${query ? `?${query}` : ""}`;

  const url =
    `${baseUrl}${endpoint}`;

  console.log(
    "GET CAMPAIGN UPDATES FROM:",
    url
  );

  const response =
    await fetch(url, {
      method: "GET",
      headers: {
        Accept:
          "application/json",
      },
      cache: "no-store",
    });

  let data: any = null;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ??
        "Failed to load campaign updates."
    );
  }

  const rawCampaignUpdates =
    extractCampaignUpdates(data);

  const campaignupdates =
    rawCampaignUpdates.map(
      normalizeCampaignUpdate
    );

  /**
   * Your API currently returns:
   *
   * paginated: {
   *   results: [...],
   *   count: 4,
   *   total: 4,
   *   current_page: 1,
   *   per_page: 10,
   *   has_more: false,
   *   overall: 11
   * }
   */
  const paginated =
    data?.paginated;

  const pagination: CampaignUpdatePagination = {
    page:
      Number(
        paginated?.current_page ??
        data?.pagination?.page ??
        params.page ??
        1
      ),

    per_page:
      Number(
        paginated?.per_page ??
        data?.pagination?.per_page ??
        params.per_page ??
        campaignupdates.length
      ),

    
  };

  return {
    success:
      Boolean(
        data?.success ??
        true
      ),

    data: campaignupdates,

    pagination,
  };
}

