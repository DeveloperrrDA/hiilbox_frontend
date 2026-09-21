export type SignupUserType = "donor" | "fundraiser";

export interface RegisterPayload {
  user_type: SignupUserType;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  access_token?: string;
  refresh_token?: string;
  user_id?: number;
  username?: string;
  email?: string;
  expires_in?: number;
  code?: string;
  data?: unknown;
  errors?: Record<string, string[]>;
}

const API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://hiilbox.com/wp-json/growfund-currency-manager/v1";

export async function registerUser(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.code ||
        `Registration failed (${response.status}).`
    );
  }

  return data;
}