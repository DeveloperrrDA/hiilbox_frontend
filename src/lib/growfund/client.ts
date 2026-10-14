import { config } from "@/lib/config";

export class GrowfundApiError extends Error {
  status: number;
  data: unknown;

  constructor(
    message: string,
    status: number,
    data?: unknown
  ) {
    super(message);
    this.name = "GrowfundApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = RequestInit & {
  token?: string;
};

export async function growfundFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers, ...requestOptions } = options;

  const url = `${config.growfundApiBaseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...headers,
    },
  });

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new GrowfundApiError(
      `Growfund API request failed with status ${response.status}`,
      response.status,
      data
    );
  }

  return data as T;
}