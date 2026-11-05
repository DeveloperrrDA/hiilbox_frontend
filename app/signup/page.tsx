"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";
import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/FullLogo";
import { Icon } from "@iconify/react";
import SignupSidebarPart from "@/app/auth/auth1/SignupSidebarPart";

export default function SignupPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"donor" | "fundraiser">("donor");

  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (type === "fundraiser") setUserType("fundraiser");
  }, []);

  const [form, setForm] = useState({
    first_name: "", last_name: "", username: "", email: "", password: "", password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
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
        ...form
      });

      if (!result.success) throw new Error(result.message || "Registration failed.");

      if (result.access_token) localStorage.setItem("access_token", result.access_token);
      if (result.refresh_token) localStorage.setItem("refresh_token", result.refresh_token);

      const userId = Number(result.user_id || 0);
      localStorage.setItem("auth_user", JSON.stringify({
        id: userId, user_id: userId, username: result.username || form.username,
        email: result.email || form.email, first_name: form.first_name, last_name: form.last_name,
        roles: [userType],
      }));
      window.dispatchEvent(new Event("hiilbox-auth-changed"));

      if (userType === "fundraiser") {
        setSuccess("Account created. Continue to verification.");
        router.push(`/signup/fundraiser-kyc?fundraiser_id=${encodeURIComponent(String(userId))}`);
        return;
      }

      setSuccess("Your donor account has been created successfully.");
      router.push("/dashboard");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-white lg:bg-[#021f12]">
      
      {/* ========================================================
          RIGHT SIDE: ANIMATED SIDEBAR (Desktop Background)
      ======================================================== */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-1/2">
        <SignupSidebarPart />
      </div>

      {/* Main Grid Workspace - Locked to Screen Height */}
      <div className="relative z-10 w-full h-full grid grid-cols-12 gap-0 lg:px-12 xl:px-24">
        
        {/* ========================================================
            LEFT SIDE: FLOATING FORM CARD
        ======================================================== */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex items-center justify-center h-full p-4 lg:p-0 z-20">
          
          <div className="w-full h-full lg:h-auto lg:max-h-[90vh] lg:max-w-[650px] bg-white lg:rounded-3xl p-6 sm:p-10 lg:p-8 shadow-none lg:shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-none lg:border lg:border-white/10 flex flex-col justify-start overflow-y-auto no-scrollbar">
            
            <div className="mb-6 shrink-0 pt-2 lg:pt-0">
              <Link href="/" className="inline-block mb-6 origin-left scale-110">
                <FullLogo />
              </Link>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F1F17]">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-[#687280]">
                Join Hiilbox and help create meaningful impact through trusted crowdfunding.
              </p>
            </div>

            <div className="mb-6 shrink-0">
              <div className="grid gap-3 sm:grid-cols-2">
                <button 
                  type="button" 
                  onClick={() => setUserType("donor")} 
                  className={`relative rounded-xl border p-3 text-left transition-all duration-200 ${
                    userType === "donor" 
                    ? "border-[#01A14B] bg-[#01A14B]/5" 
                    : "border-gray-200 bg-white hover:border-[#01A14B]/50"
                  }`}
                >
                  {userType === "donor" && <div className="absolute top-2 right-2 text-[#01A14B]"><Icon icon="solar:check-circle-bold" className="text-lg" /></div>}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${userType === "donor" ? "bg-[#01A14B] text-white" : "bg-gray-100 text-gray-500"}`}><Icon icon="solar:heart-bold" className="text-lg" /></div>
                  <span className="block font-bold text-[#0F1F17] text-sm mb-0.5">Donor</span>
                  <span className="block text-[11px] text-[#687280] leading-tight">Donate to campaigns.</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => setUserType("fundraiser")} 
                  className={`relative rounded-xl border p-3 text-left transition-all duration-200 ${
                    userType === "fundraiser" 
                    ? "border-[#01A14B] bg-[#01A14B]/5" 
                    : "border-gray-200 bg-white hover:border-[#01A14B]/50"
                  }`}
                >
                  {userType === "fundraiser" && <div className="absolute top-2 right-2 text-[#01A14B]"><Icon icon="solar:check-circle-bold" className="text-lg" /></div>}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${userType === "fundraiser" ? "bg-[#01A14B] text-white" : "bg-gray-100 text-gray-500"}`}><Icon icon="solar:hand-money-bold" className="text-lg" /></div>
                  <span className="block font-bold text-[#0F1F17] text-sm mb-0.5">Fundraiser</span>
                  <span className="block text-[11px] text-[#687280] leading-tight">Create & manage.</span>
                </button>
              </div>
            </div>

            {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium shrink-0">{error}</div>}
            {success && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-medium shrink-0">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4 shrink-0 pb-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="first_name" className="text-sm font-semibold text-[#0F1F17]">First name</label>
                  <input id="first_name" type="text" required autoComplete="given-name" placeholder="John" value={form.first_name} onChange={(e) => updateField("first_name", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-transparent focus-visible:ring-1 focus-visible:ring-[#01A14B] focus-visible:border-[#01A14B] shadow-none transition-colors text-[#0F1F17] text-sm placeholder:text-gray-400" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="last_name" className="text-sm font-semibold text-[#0F1F17]">Last name</label>
                  <input id="last_name" type="text" required autoComplete="family-name" placeholder="Doe" value={form.last_name} onChange={(e) => updateField("last_name", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-transparent focus-visible:ring-1 focus-visible:ring-[#01A14B] focus-visible:border-[#01A14B] shadow-none transition-colors text-[#0F1F17] text-sm placeholder:text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="username" className="text-sm font-semibold text-[#0F1F17]">Username</label>
                <input id="username" type="text" required autoComplete="username" placeholder="Choose a unique username" value={form.username} onChange={(e) => updateField("username", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-transparent focus-visible:ring-1 focus-visible:ring-[#01A14B] focus-visible:border-[#01A14B] shadow-none transition-colors text-[#0F1F17] text-sm placeholder:text-gray-400" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-[#0F1F17]">Email address</label>
                <input id="email" type="email" required autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-transparent focus-visible:ring-1 focus-visible:ring-[#01A14B] focus-visible:border-[#01A14B] shadow-none transition-colors text-[#0F1F17] text-sm placeholder:text-gray-400" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 relative">
                  <label htmlFor="password" className="text-sm font-semibold text-[#0F1F17]">Password</label>
                  <input id="password" type={showPassword ? "text" : "password"} required autoComplete="new-password" placeholder="••••••••" value={form.password} onChange={(e) => updateField("password", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-transparent focus-visible:ring-1 focus-visible:ring-[#01A14B] focus-visible:border-[#01A14B] shadow-none transition-colors text-[#0F1F17] text-sm placeholder:text-gray-400" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="password_confirmation" className="text-sm font-semibold text-[#0F1F17]">Confirm password</label>
                  <input id="password_confirmation" type={showPassword ? "text" : "password"} required autoComplete="new-password" placeholder="••••••••" value={form.password_confirmation} onChange={(e) => updateField("password_confirmation", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-transparent focus-visible:ring-1 focus-visible:ring-[#01A14B] focus-visible:border-[#01A14B] shadow-none transition-colors text-[#0F1F17] text-sm placeholder:text-gray-400" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full h-12 rounded-lg bg-[#01A14B] hover:bg-[#018b41] text-white font-bold text-[15px] shadow-none mt-2 transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
                {loading ? "Creating account..." : (userType === "fundraiser" ? "Create fundraiser account" : "Create donor account")}
              </button>
            </form>

            <div className="mt-4 text-center text-sm font-medium text-[#687280] pt-4 shrink-0">
              Already have an account? <Link href="/login" className="text-[#01A14B] font-bold hover:text-[#018b41] transition-colors">Sign in</Link>
            </div>
            
          </div>
        </div>

      </div>
    </main>
  );
}