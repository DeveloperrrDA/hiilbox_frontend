"use client";

import { refreshAccessToken } from "@/lib/auth";

let refreshPromise: Promise<string> | null = null;

async function getFreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem("refresh_token") || "";
    if (!refreshToken) throw new Error("Your session has expired. Please sign in again.");

    const refreshed = await refreshAccessToken(refreshToken);
    if (!refreshed?.success || !refreshed.access_token) {
      throw new Error("Your session has expired. Please sign in again.");
    }

    localStorage.setItem("access_token", refreshed.access_token);
    return refreshed.access_token;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = localStorage.getItem("access_token") || "";
  if (!token) throw new Error("Please sign in with your fundraiser account first.");

  const firstHeaders = new Headers(init.headers || {});
  firstHeaders.set("Authorization", `Bearer ${token}`);

  let response = await fetch(input, { ...init, headers: firstHeaders });
  if (response.status !== 401) return response;

  try {
    const freshToken = await getFreshAccessToken();
    const retryHeaders = new Headers(init.headers || {});
    retryHeaders.set("Authorization", `Bearer ${freshToken}`);
    response = await fetch(input, { ...init, headers: retryHeaders });
    return response;
  } catch (error) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    throw error;
  }
}
