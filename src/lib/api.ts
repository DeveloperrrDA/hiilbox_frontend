import { config } from "./config";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  let data: T | { message?: string; code?: string };

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `The server returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    const error = data as {
      message?: string;
      code?: string;
    };

    throw new Error(
      error.message ||
        error.code ||
        `API request failed with status ${response.status}`
    );
  }

  return data as T;
}