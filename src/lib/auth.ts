import { apiRequest } from "./api";

import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  CurrentUserResponse,
  RegisterRequest,
  RegisterResponse,
  SystemTokenResponse,
} from "@/types/auth";

/**
 * Fetches the system token from the WordPress backend.
 * @param apiKey The X-API-Key header value used for validation.
 */
export async function getSystemToken(): Promise<SystemTokenResponse> {
  const response = await fetch("/api/system-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data: SystemTokenResponse | { message?: string; code?: string };

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
        `System token request failed with status ${response.status}`
    );
  }

  return data as SystemTokenResponse;
}
export async function login(
  credentials: LoginRequest
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  const data: RefreshTokenRequest = {
    refresh_token: refreshToken,
  };

  return apiRequest<RefreshTokenResponse>("/auth/refresh-token", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCurrentUser(
  accessToken: string
): Promise<CurrentUserResponse> {
  return apiRequest<CurrentUserResponse>("/current-user", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
}

export async function logout(
  accessToken: string
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>("/logout", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
}