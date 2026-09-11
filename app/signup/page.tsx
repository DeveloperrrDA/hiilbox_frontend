"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { register } from "@/lib/auth";

export default function SignupPage() {
  const [userType, setUserType] = useState<"donor" | "fundraiser">("donor");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        user_type: userType,
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      if (!result.success) {
        throw new Error(result.message || "Registration failed.");
      }

      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token);
      }

      if (result.refresh_token) {
        localStorage.setItem("refresh_token", result.refresh_token);
      }

      setSuccess(
        userType === "fundraiser"
          ? "Your fundraiser account has been created. Please continue with the KYC process."
          : "Your donor account has been created successfully."
      );

      setForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong during registration."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6FAF7] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto w-full max-w-2xl">

        {/* Logo / Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center">
            <span className="text-3xl font-extrabold tracking-tight text-[#18A558]">
              Hiil
              <span className="text-[#16324F]">box</span>
            </span>
          </Link>

          <h1 className="mt-7 text-3xl font-bold tracking-tight text-[#16324F] sm:text-4xl">
            Create your account
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
            Join Hiilbox and help create meaningful impact through trusted
            crowdfunding.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_10px_40px_rgba(15,45,65,0.08)] sm:p-8">

          {/* Account Type */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-[#16324F]">
              How would you like to register?
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose the account that best describes what you want to do.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">

              {/* Donor */}
              <button
                type="button"
                onClick={() => setUserType("donor")}
                className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                  userType === "donor"
                    ? "border-[#18A558] bg-[#E9F8EF] shadow-sm"
                    : "border-gray-200 bg-white hover:border-[#A8DDBD] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                      userType === "donor"
                        ? "bg-[#18A558] text-white"
                        : "bg-[#EEF4F0] text-[#16324F]"
                    }`}
                  >
                    ♥
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#16324F]">
                        Donor
                      </span>

                      {userType === "donor" && (
                        <span className="text-xs font-semibold text-[#18A558]">
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      Donate to campaigns and support causes.
                    </p>
                  </div>
                </div>
              </button>

              {/* Fundraiser */}
              <button
                type="button"
                onClick={() => setUserType("fundraiser")}
                className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                  userType === "fundraiser"
                    ? "border-[#18A558] bg-[#E9F8EF] shadow-sm"
                    : "border-gray-200 bg-white hover:border-[#A8DDBD] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                      userType === "fundraiser"
                        ? "bg-[#18A558] text-white"
                        : "bg-[#EEF4F0] text-[#16324F]"
                    }`}
                  >
                    +
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#16324F]">
                        Fundraiser
                      </span>

                      {userType === "fundraiser" && (
                        <span className="text-xs font-semibold text-[#18A558]">
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      Create and manage fundraising campaigns.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
            >
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700"
            >
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Names */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="first_name"
                  className="mb-2 block text-sm font-medium text-[#16324F]"
                >
                  First name
                </label>

                <input
                  id="first_name"
                  type="text"
                  value={form.first_name}
                  onChange={(e) =>
                    updateField("first_name", e.target.value)
                  }
                  required
                  autoComplete="given-name"
                  placeholder="Enter your first name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#16324F] outline-none transition placeholder:text-gray-400 focus:border-[#18A558] focus:bg-white focus:ring-4 focus:ring-[#18A558]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="mb-2 block text-sm font-medium text-[#16324F]"
                >
                  Last name
                </label>

                <input
                  id="last_name"
                  type="text"
                  value={form.last_name}
                  onChange={(e) =>
                    updateField("last_name", e.target.value)
                  }
                  required
                  autoComplete="family-name"
                  placeholder="Enter your last name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#16324F] outline-none transition placeholder:text-gray-400 focus:border-[#18A558] focus:bg-white focus:ring-4 focus:ring-[#18A558]/10"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-[#16324F]"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={form.username}
                onChange={(e) =>
                  updateField("username", e.target.value)
                }
                required
                autoComplete="username"
                placeholder="Choose a username"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#16324F] outline-none transition placeholder:text-gray-400 focus:border-[#18A558] focus:bg-white focus:ring-4 focus:ring-[#18A558]/10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#16324F]"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
                required
                autoComplete="email"
                placeholder="Enter your email address"
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
                type="password"
                value={form.password}
                onChange={(e) =>
                  updateField("password", e.target.value)
                }
                required
                autoComplete="new-password"
                placeholder="Create a password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#16324F] outline-none transition placeholder:text-gray-400 focus:border-[#18A558] focus:bg-white focus:ring-4 focus:ring-[#18A558]/10"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="password_confirmation"
                className="mb-2 block text-sm font-medium text-[#16324F]"
              >
                Confirm password
              </label>

              <input
                id="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={(e) =>
                  updateField(
                    "password_confirmation",
                    e.target.value
                  )
                }
                required
                autoComplete="new-password"
                placeholder="Confirm your password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#16324F] outline-none transition placeholder:text-gray-400 focus:border-[#18A558] focus:bg-white focus:ring-4 focus:ring-[#18A558]/10"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#18A558] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#128044] focus:outline-none focus:ring-4 focus:ring-[#18A558]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating account..."
                : userType === "fundraiser"
                  ? "Create fundraiser account"
                  : "Create donor account"}
            </button>
          </form>

          {/* Login */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#18A558] transition hover:text-[#128044]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          By creating an account, you&apos;re joining Hiilbox&apos;s
          crowdfunding community.
        </p>
      </div>
    </main>
  );
}