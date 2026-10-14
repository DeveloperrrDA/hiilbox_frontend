"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
/* import React from "react"; */
import { FormEvent, useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AuthLogin() {
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
    <>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          {/* Username / Email */}
          <div className="mb-2 block">
            <Label htmlFor="username">Email or Username</Label>
          </div>
          <Input 
            id="username" 
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            placeholder="Enter your email or username"
            className="form-control" 
          />
        </div>
        <div className="mb-4">
          {/* Password */}
          <div className="mb-2 block">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input 
            id="password"
            name="password"
            type="password" 
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="Enter your password"
            className="form-control" 
          />
        </div>
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer mb-0"
            >
              Remeber this Device
            </Label>
          </div>
          <Link
            href={"/auth/auth1/forgot-password"}
            className="text-primary text-sm font-medium"
          >
            Forgot Password ?
          </Link>
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
        <Button  
          type="submit"
          disabled={loading}
          className="w-full rounded-full"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </>
  );

}

/* const AuthLogin = () => {
  return (
    <>
      <form className="mt-6">
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="Username">Username</Label>
          </div>
          <Input id="username" type="text" className="form-control" />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="userpwd">Password</Label>
          </div>
          <Input id="userpwd" type="password" className="form-control" />
        </div>
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer mb-0"
            >
              Remeber this Device
            </Label>
          </div>
          <Link
            href={"/auth/auth1/forgot-password"}
            className="text-primary text-sm font-medium"
          >
            Forgot Password ?
          </Link>
        </div>
        <Button asChild className="w-full rounded-full">
          <Link href="/">Sign in</Link>
        </Button>
      </form>
    </>
  );
};

export default AuthLogin; */
