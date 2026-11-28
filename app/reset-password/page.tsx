
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

function ResetPasswordForm() {
  const params = useSearchParams();

  const key = params.get("key") || "";
  const login = params.get("login") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (password.length < 8 || password !== confirmPassword) {
      setError("Passwords must match and contain at least 8 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login,
          key,
          password,
          password_confirmation: confirmPassword,
        }),
      });

     
const data: { message?: string } = await response.json();


      if (!response.ok) {
        throw new Error(data.message || "Password reset failed.");
      }

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!key || !login) {
    return (
      <p className="mt-6 text-red-600">
        Invalid reset link.{" "}
        <Link href="/forgot-password" className="underline">
          Request a new link
        </Link>
      </p>
    );
  }

  if (success) {
    return (
      <div className="mt-6">
        <p className="text-green-700">
          Your password has been updated successfully.
        </p>
        <Link href="/login" className="text-[#01A14B] underline">
          Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input
        type="password"
        placeholder="New password"
        autoComplete="new-password"
        minLength={8}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <input
        type="password"
        placeholder="Confirm new password"
        autoComplete="new-password"
        minLength={8}
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      {error && <p role="alert" className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#01A14B] text-white p-3 rounded-lg disabled:opacity-60"
      >
        {loading ? "Updating..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#f5faf7] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="mt-3 text-gray-600">
          Enter your new password below.
        </p>

        <Suspense fallback={<p>Loading...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
