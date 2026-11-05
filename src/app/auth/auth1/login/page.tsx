"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
      const response = await login({ username, password });
      if (!response.success) throw new Error("Login failed.");

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Email / Username Group */}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-semibold text-gray-800">
          Email or Username
        </Label>
        <Input 
          id="username" 
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          placeholder="Enter your email or username"
          className="h-12 px-4 rounded-lg border border-gray-300 bg-transparent focus-visible:ring-1 focus-visible:ring-[#01A14B] focus-visible:border-[#01A14B] shadow-none transition-colors text-gray-900" 
        />
      </div>

      {/* Password Group */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-sm font-semibold text-gray-800">
            Password
          </Label>
          <Link href="/auth/auth1/forgot-password" className="text-xs font-bold text-[#01A14B] hover:text-[#018b41] transition-colors">
            Forgot Password?
          </Link>
        </div>
        <Input 
          id="password"
          name="password"
          type="password" 
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          placeholder="••••••••••••"
          className="h-12 px-4 rounded-lg border border-gray-300 bg-transparent focus-visible:ring-1 focus-visible:ring-[#01A14B] focus-visible:border-[#01A14B] shadow-none transition-colors text-gray-900" 
        />
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2 pt-1">
        <Checkbox 
          id="accept" 
          className="border-gray-300 data-[state=checked]:bg-[#01A14B] data-[state=checked]:border-[#01A14B] rounded shadow-none h-4 w-4" 
        />
        <Label htmlFor="accept" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
          Remember this device
        </Label>
      </div>

      {/* Error State */}
      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button  
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-lg bg-[#01A14B] hover:bg-[#018b41] text-white font-bold text-[15px] shadow-none mt-2"
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

    </form>
  );
}