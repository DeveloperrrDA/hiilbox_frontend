
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
}

export interface SystemTokenResponse {
  success: boolean;
  system_token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: AuthUser;
}

export interface RegisterRequest {
  user_type: "donor" | "fundraiser";
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

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  access_token: string;
  expires_in: number;
}

export interface CurrentUserResponse {
  success: boolean;
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

export interface ApiError {
  code?: string;
  message?: string;
  data?: {
    status?: number;
  };
}


export type SignupUserType = "donor" | "fundraiser";

export interface RegisterRequest {
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

