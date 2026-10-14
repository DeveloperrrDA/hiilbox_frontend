"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login({
        username: username,
        password,
      });

      if (!response.success) {
        throw new Error("Login failed.");
      }

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Username / Email */}
      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-medium text-[#16324F]"
        >
          Email or Username
        </label>

        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          placeholder="Enter your email or username"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#16324F] outline-none transition placeholder:text-gray-400 focus:border-[#18A558] focus:bg-white focus:ring-4 focus:ring-[#18A558]/10"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-[#16324F]"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          placeholder="Enter your password"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#16324F] outline-none transition placeholder:text-gray-400 focus:border-[#18A558] focus:bg-white focus:ring-4 focus:ring-[#18A558]/10"
        />
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#18A558] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#128044] focus:outline-none focus:ring-4 focus:ring-[#18A558]/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}