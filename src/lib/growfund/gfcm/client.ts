import { config } from "@/lib/config";

export class GfcmApiError extends Error {
  status: number;
  data: unknown;

  constructor(
    message: string,
    status: number,
    data?: unknown
  ) {
    super(message);
    this.name = "GfcmApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = RequestInit & {
  token?: string;
};

interface SystemTokenResponse {
  success: boolean;
  system_access_token: string;
  expires_in: number;
  token_type: string;
}

let cachedSystemToken: string | null = null;
let cachedSystemTokenExpiresAt = 0;

function clearSystemTokenCache() {
  cachedSystemToken = null;
  cachedSystemTokenExpiresAt = 0;
}

async function getSystemToken(): Promise<string> {
  const now = Date.now();

  if (
    cachedSystemToken &&
    now < cachedSystemTokenExpiresAt - 30_000
  ) {
    return cachedSystemToken;
  }

  if (!config.gfcmClientApiKey) {
    throw new Error(
      "GROWFUND_CLIENT_API_KEY is missing from the environment."
    );
  }

  const response = await fetch(
    `${config.gfcmApiBaseUrl}/auth/system-token`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-API-Key": config.gfcmClientApiKey,
      },
      cache: "no-store",
    }
  );

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new GfcmApiError(
      `GFCM system-token request failed with status ${response.status}`,
      response.status,
      data
    );
  }

  const tokenResponse = data as SystemTokenResponse;

  if (
    !tokenResponse.success ||
    !tokenResponse.system_access_token
  ) {
    throw new GfcmApiError(
      "GFCM did not return a valid system access token.",
      response.status,
      data
    );
  }

  cachedSystemToken =
    tokenResponse.system_access_token;

  cachedSystemTokenExpiresAt =
    Date.now() + tokenResponse.expires_in * 1000;

  return cachedSystemToken;
}

function isExpiredSystemTokenResponse(
  data: unknown
): boolean {
  if (!data || typeof data !== "object") {
    return false;
  }

  const responseData = data as {
    message?: unknown;
    errors?: unknown;
  };

  if (
    responseData.message ===
    "System token has expired"
  ) {
    return true;
  }

  if (Array.isArray(responseData.errors)) {
    return responseData.errors.some(
      (error) =>
        error === "System token has expired"
    );
  }

  return false;
}

async function makeGfcmRequest<T>(
  endpoint: string,
  accessToken: string,
  requestOptions: RequestInit,
  headers?: HeadersInit
): Promise<{
  response: Response;
  data: unknown;
}> {
  const url =
    `${config.gfcmApiBaseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...requestOptions,

    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",

      // Required by GFCM_Combined_Auth_Middleware
      "X-API-Key": config.gfcmClientApiKey,

      // Required by GFCM_Combined_Auth_Middleware
      Authorization: `Bearer ${accessToken}`,

      ...headers,
    },

    cache: "no-store",
  });

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return {
    response,
    data,
  };
}

export async function gfcmFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    token,
    headers,
    ...requestOptions
  } = options;

  /*
   * Explicit user/system token.
   */
  if (token) {
    const result =
      await makeGfcmRequest(
        endpoint,
        token,
        requestOptions,
        headers
      );

    if (!result.response.ok) {
      throw new GfcmApiError(
        `GFCM API request failed with status ${result.response.status}`,
        result.response.status,
        result.data
      );
    }

    return result.data as T;
  }

  /*
   * Normal GFCM client flow:
   *
   * 1. Obtain system JWT.
   * 2. Send BOTH API key and JWT.
   * 3. If JWT expired, obtain a new one.
   * 4. Retry once.
   */

  let accessToken =
    await getSystemToken();

  let result =
    await makeGfcmRequest(
      endpoint,
      accessToken,
      requestOptions,
      headers
    );

  /*
   * The API may tell us that the cached
   * system token has expired.
   */
  if (
    result.response.status === 401 &&
    isExpiredSystemTokenResponse(result.data)
  ) {
    clearSystemTokenCache();

    accessToken =
      await getSystemToken();

    result =
      await makeGfcmRequest(
        endpoint,
        accessToken,
        requestOptions,
        headers
      );
  }

  if (!result.response.ok) {
    throw new GfcmApiError(
      `GFCM API request failed with status ${result.response.status}`,
      result.response.status,
      result.data
    );
  }

  return result.data as T;
}