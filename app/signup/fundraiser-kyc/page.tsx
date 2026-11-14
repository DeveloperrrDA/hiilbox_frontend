"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardApi } from "@/lib/dashboard/api";
import { Icon } from "@iconify/react";

type KycForm = {
  gfcm_kyc_type: "myself" | "someone_else" | "organization";
  gfcm_kyc_contact_name: string;
  gfcm_kyc_contact_phone: string;
  gfcm_kyc_contact_address: string;
  gfcm_kyc_contact_city: string;
  gfcm_kyc_rep_name: string;
  gfcm_kyc_rep_role: string;
  gfcm_kyc_rep_phone: string;
  gfcm_kyc_rep_address: string;
  gfcm_kyc_rep_city: string;
  gfcm_kyc_fundraiser_id_number: string;
  gfcm_kyc_auth_id_number: string;
  gfcm_kyc_id_number: string;
  gfcm_kyc_beneficiary_name: string;
  gfcm_kyc_beneficiary_relation: string;
  gfcm_kyc_beneficiary_contact: string;
  gfcm_kyc_org_name: string;
  gfcm_kyc_org_type: string;
  gfcm_kyc_org_reg_number: string;
  gfcm_kyc_org_website: string;
  gfcm_kyc_recipient_type: "fundraiser" | "beneficiary";
  gfcm_kyc_payout_method: "mobile_money" | "bank";
  gfcm_kyc_mobile_provider: string;
  gfcm_kyc_mobile_name: string;
  gfcm_kyc_mobile_number: string;
  gfcm_kyc_bank_name: string;
  gfcm_kyc_bank_account_name: string;
  gfcm_kyc_bank_account_number: string;
  swift_bic: string;
  gfcm_kyc_payout_currency: "USD" | "SLSH" | "KES";
  gfcm_kyc_payout_currency_org: "USD" | "SLSH" | "KES";
  gfcm_kyc_consent: boolean;
};

const blank: KycForm = {
  gfcm_kyc_type: "myself",
  gfcm_kyc_contact_name: "", gfcm_kyc_contact_phone: "", gfcm_kyc_contact_address: "", gfcm_kyc_contact_city: "",
  gfcm_kyc_rep_name: "", gfcm_kyc_rep_role: "", gfcm_kyc_rep_phone: "", gfcm_kyc_rep_address: "", gfcm_kyc_rep_city: "",
  gfcm_kyc_fundraiser_id_number: "", gfcm_kyc_auth_id_number: "", gfcm_kyc_id_number: "",
  gfcm_kyc_beneficiary_name: "", gfcm_kyc_beneficiary_relation: "", gfcm_kyc_beneficiary_contact: "",
  gfcm_kyc_org_name: "", gfcm_kyc_org_type: "", gfcm_kyc_org_reg_number: "", gfcm_kyc_org_website: "",
  gfcm_kyc_recipient_type: "fundraiser", gfcm_kyc_payout_method: "mobile_money",
  gfcm_kyc_mobile_provider: "Edahab", gfcm_kyc_mobile_name: "", gfcm_kyc_mobile_number: "",
  gfcm_kyc_bank_name: "", gfcm_kyc_bank_account_name: "", gfcm_kyc_bank_account_number: "", swift_bic: "",
  gfcm_kyc_payout_currency: "USD", gfcm_kyc_payout_currency_org: "USD", gfcm_kyc_consent: false,
};

type FileKey = "gfcm_kyc_id_upload" | "gfcm_kyc_fundraiser_id" | "gfcm_kyc_auth_id" | "gfcm_kyc_org_cert";

function userName() {
  try {
    const user = JSON.parse(localStorage.getItem("auth_user") || "null");
    return [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.display_name || user?.username || "";
  } catch { return ""; }
}

async function uploadDocument(file: File) {
  const token = localStorage.getItem("access_token") || "";
  const body = new FormData();
  body.append("images[]", file);
  const response = await fetch("/api/campaigns/media", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body });
  const data: any = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Unable to upload KYC document.");
  const image = Array.isArray(data?.images) ? data.images[0] : null;
  return image?.url || image?.id || "";
}

export default function FundraiserKycPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<KycForm>(blank);
  const [files, setFiles] = useState<Partial<Record<FileKey, File>>>({});
  const [status, setStatus] = useState("not_started");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response: any = await dashboardApi("fundraiser/kyc");
        if (cancelled) return;
        setStatus(String(response?.status || "not_started"));
        const data = response?.data || {};
        const initialName = userName();
        setForm((current) => ({
          ...current,
          ...Object.fromEntries(Object.keys(current).map((key) => [key, data[key] ?? current[key as keyof KycForm]])),
          gfcm_kyc_contact_name: data?.gfcm_kyc_contact_name || initialName || current.gfcm_kyc_contact_name,
          gfcm_kyc_consent: false,
        }) as KycForm);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unable to load your KYC details.");
      } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const isOrganization = form.gfcm_kyc_type === "organization";
  const isSomeoneElse = form.gfcm_kyc_type === "someone_else";
  
  // Name Matching Logic
  const payoutAccountName = form.gfcm_kyc_payout_method === "mobile_money" ? form.gfcm_kyc_mobile_name : form.gfcm_kyc_bank_account_name;
  const expectedAccountName = isSomeoneElse && form.gfcm_kyc_recipient_type === "beneficiary" ? form.gfcm_kyc_beneficiary_name : isOrganization ? form.gfcm_kyc_rep_name : form.gfcm_kyc_contact_name;
  const namesMismatch = !isOrganization && Boolean(expectedAccountName && payoutAccountName && expectedAccountName.trim().toLowerCase() !== payoutAccountName.trim().toLowerCase());

  function set<K extends keyof KycForm>(key: K, value: KycForm[K]) { setForm((current) => ({ ...current, [key]: value })); }
  function chooseFile(key: FileKey, file: File | undefined) { setFiles((current) => ({ ...current, [key]: file })); }

  // Step Validation Logic
  function canGoNext() {
    if (step === 1) return true;
    if (step === 2) {
      if (isOrganization) return !!(form.gfcm_kyc_rep_name && form.gfcm_kyc_rep_role && form.gfcm_kyc_rep_phone && form.gfcm_kyc_rep_address && form.gfcm_kyc_rep_city && form.gfcm_kyc_fundraiser_id_number && form.gfcm_kyc_auth_id_number);
      return !!(form.gfcm_kyc_contact_name && form.gfcm_kyc_contact_phone && form.gfcm_kyc_contact_address && form.gfcm_kyc_contact_city);
    }
    if (step === 3) {
      if (form.gfcm_kyc_type === "myself") return !!form.gfcm_kyc_id_number;
      if (isSomeoneElse) return !!(form.gfcm_kyc_beneficiary_name && form.gfcm_kyc_beneficiary_relation && form.gfcm_kyc_beneficiary_contact);
      if (isOrganization) return !!(form.gfcm_kyc_org_name && form.gfcm_kyc_org_type && form.gfcm_kyc_org_website);
    }
    if (step === 4) {
      if (namesMismatch) return false;
      if (form.gfcm_kyc_payout_method === "mobile_money") return !!(form.gfcm_kyc_mobile_provider && form.gfcm_kyc_mobile_name && form.gfcm_kyc_mobile_number);
      return !!(form.gfcm_kyc_bank_name && form.gfcm_kyc_bank_account_name && form.gfcm_kyc_bank_account_number);
    }
    return false;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (step < 5) {
      if (canGoNext()) setStep(step + 1);
      return;
    }
    
    setError("");
    if (namesMismatch) { setError(`Payout account name must exactly match ${expectedAccountName}.`); return; }
    if (!form.gfcm_kyc_consent) return;

    setSaving(true);
    try {
      const payload: Record<string, any> = { ...form, gfcm_kyc_consent: true };
      for (const [key, file] of Object.entries(files) as [FileKey, File][]) {
        if (file) payload[key] = await uploadDocument(file);
      }
      const response: any = await dashboardApi("fundraiser/kyc", { method: "POST", body: JSON.stringify(payload) });
      setStatus(String(response?.status || "submitted"));
      window.dispatchEvent(new Event("hiilbox-kyc-changed"));
      router.push("/dashboard/fundraiser-wallet");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to submit KYC."); }
    finally { setSaving(false); }
  }

  const input = "mt-1.5 w-full h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm text-[#16324F] shadow-sm outline-none transition focus:border-[#01A14B] focus:ring-1 focus:ring-[#01A14B]";
  const label = "block text-sm font-semibold text-gray-800";
  const Field = ({ title, required = true, children }: { title: string; required?: boolean; children: ReactNode }) => (
    <label className={label}>
      {title} {required && <span className="text-red-500">*</span>}
      {children}
    </label>
  );

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6FAF7] px-4">
      <div className="flex flex-col items-center gap-4 text-[#01A14B]">
        <Icon icon="solar:spinner-broken" className="animate-spin text-4xl" />
        <p className="text-sm font-bold text-[#16324F]">Loading your KYC profile...</p>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#F6FAF7] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto w-full max-w-3xl">
        
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center">
            <span className="text-3xl font-extrabold tracking-tight text-[#01A14B]">Hiil<span className="text-[#16324F]">box</span></span>
          </Link>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[#16324F] sm:text-4xl">Start Your Campaign</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
            Complete your identity verification to raise funds for a cause you care about. It's easy to get started.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,45,65,0.08)] sm:p-10">
          
          {/* Progress Header */}
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#16324F]">
                {step === 1 && "Let's Get Started"}
                {step === 2 && "Contact Information"}
                {step === 3 && (form.gfcm_kyc_type === "myself" ? "Identity Verification" : isSomeoneElse ? "Beneficiary Information" : "Organization Details")}
                {step === 4 && "Withdrawal Setup"}
                {step === 5 && "Finalize & Submit"}
              </h3>
              <span className="rounded-full bg-[#01A14B]/10 px-3 py-1 text-xs font-bold text-[#01A14B]">
                Step {step} of 5
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-[#01A14B] transition-all duration-500 ease-out" style={{ width: `${(step / 5) * 100}%` }} />
            </div>
          </div>

          {error && <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"><Icon icon="solar:danger-circle-bold" className="text-xl shrink-0" />{error}</div>}

          <form onSubmit={submit}>
            
            {/* ================= STEP 1: FUNDRAISER TYPE ================= */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="mb-5 text-sm text-gray-500">Tell us who you are raising funds for.</p>
                <div className="grid gap-4">
                  
                  <label className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${form.gfcm_kyc_type === "myself" ? "border-[#01A14B] bg-[#01A14B]/5" : "border-gray-200 hover:border-[#01A14B]/40"}`}>
                    <input type="radio" className="peer sr-only" checked={form.gfcm_kyc_type === "myself"} onChange={() => set("gfcm_kyc_type", "myself")} />
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${form.gfcm_kyc_type === "myself" ? "bg-[#01A14B] text-white" : "bg-gray-100 text-gray-500"}`}><Icon icon="solar:user-bold" className="text-2xl" /></div>
                      <div>
                        <strong className="block text-base text-[#16324F]">Myself</strong>
                        <p className="mt-1 text-sm text-gray-500">Raising funds for your own needs.</p>
                      </div>
                    </div>
                    {form.gfcm_kyc_type === "myself" && <Icon icon="solar:check-circle-bold" className="absolute right-5 top-5 text-2xl text-[#01A14B]" />}
                  </label>

                  <label className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${form.gfcm_kyc_type === "someone_else" ? "border-[#01A14B] bg-[#01A14B]/5" : "border-gray-200 hover:border-[#01A14B]/40"}`}>
                    <input type="radio" className="peer sr-only" checked={form.gfcm_kyc_type === "someone_else"} onChange={() => set("gfcm_kyc_type", "someone_else")} />
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${form.gfcm_kyc_type === "someone_else" ? "bg-[#01A14B] text-white" : "bg-gray-100 text-gray-500"}`}><Icon icon="solar:users-group-two-rounded-bold" className="text-2xl" /></div>
                      <div>
                        <strong className="block text-base text-[#16324F]">Someone else</strong>
                        <p className="mt-1 text-sm text-gray-500">Raise funds for another person or family.</p>
                      </div>
                    </div>
                    {form.gfcm_kyc_type === "someone_else" && <Icon icon="solar:check-circle-bold" className="absolute right-5 top-5 text-2xl text-[#01A14B]" />}
                  </label>

                  <label className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${form.gfcm_kyc_type === "organization" ? "border-[#01A14B] bg-[#01A14B]/5" : "border-gray-200 hover:border-[#01A14B]/40"}`}>
                    <input type="radio" className="peer sr-only" checked={form.gfcm_kyc_type === "organization"} onChange={() => set("gfcm_kyc_type", "organization")} />
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${form.gfcm_kyc_type === "organization" ? "bg-[#01A14B] text-white" : "bg-gray-100 text-gray-500"}`}><Icon icon="solar:buildings-bold" className="text-2xl" /></div>
                      <div>
                        <strong className="block text-base text-[#16324F]">Organization</strong>
                        <p className="mt-1 text-sm text-gray-500">Raise funds for a charity, NGO, or community project.</p>
                      </div>
                    </div>
                    {form.gfcm_kyc_type === "organization" && <Icon icon="solar:check-circle-bold" className="absolute right-5 top-5 text-2xl text-[#01A14B]" />}
                  </label>
                </div>
              </div>
            )}

            {/* ================= STEP 2: CONTACT INFO ================= */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                {!isOrganization ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field title="Full Name"><input required className={input} value={form.gfcm_kyc_contact_name} onChange={e=>set("gfcm_kyc_contact_name",e.target.value)} placeholder="E.g. Hebel Hebel" /></Field>
                    <Field title="Phone Number"><input required type="tel" className={input} value={form.gfcm_kyc_contact_phone} onChange={e=>set("gfcm_kyc_contact_phone",e.target.value.replace(/[^0-9+]/g, ''))} placeholder="E.g. 252XXXXXXXXX" /></Field>
                    <Field title="Address"><input required className={input} value={form.gfcm_kyc_contact_address} onChange={e=>set("gfcm_kyc_contact_address",e.target.value)} placeholder="E.g. Wado ama Street" /></Field>
                    <Field title="City"><input required className={input} value={form.gfcm_kyc_contact_city} onChange={e=>set("gfcm_kyc_contact_city",e.target.value)} placeholder="E.g. Magaalo ama City" /></Field>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field title="Representative Full Name"><input required className={input} value={form.gfcm_kyc_rep_name} onChange={e=>set("gfcm_kyc_rep_name",e.target.value)} placeholder="E.g. Hebel Hebel" /></Field>
                      <Field title="Organization Role"><input required className={input} value={form.gfcm_kyc_rep_role} onChange={e=>set("gfcm_kyc_rep_role",e.target.value)} placeholder="E.g. Director" /></Field>
                      <Field title="Representative Phone"><input required type="tel" className={input} value={form.gfcm_kyc_rep_phone} onChange={e=>set("gfcm_kyc_rep_phone",e.target.value.replace(/[^0-9+]/g, ''))} placeholder="E.g. 252XXXXXXXXX" /></Field>
                      <Field title="Representative Address"><input required className={input} value={form.gfcm_kyc_rep_address} onChange={e=>set("gfcm_kyc_rep_address",e.target.value)} placeholder="E.g. Wado ama Street" /></Field>
                      <div className="sm:col-span-2"><Field title="Representative City"><input required className={input} value={form.gfcm_kyc_rep_city} onChange={e=>set("gfcm_kyc_rep_city",e.target.value)} placeholder="E.g. Magaalo ama City" /></Field></div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-6 grid gap-5 sm:grid-cols-2">
                      <Field title="Your Passport / ID Number"><input required className={input} value={form.gfcm_kyc_fundraiser_id_number} onChange={e=>set("gfcm_kyc_fundraiser_id_number",e.target.value)} placeholder="Enter your ID Number" /></Field>
                      <Field title="Upload Your ID" required={false}><input className="mt-1.5 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-[#01A14B]/10 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#01A14B] hover:file:bg-[#01A14B]/20" type="file" accept="image/*,.pdf" onChange={e=>chooseFile("gfcm_kyc_fundraiser_id",e.target.files?.[0])} /></Field>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="mb-4 font-bold text-[#16324F]">Authorized Person Verification</h4>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field title="Authorized Person ID Number"><input required className={input} value={form.gfcm_kyc_auth_id_number} onChange={e=>set("gfcm_kyc_auth_id_number",e.target.value)} placeholder="Enter ID Number" /></Field>
                        <Field title="Authorized Person ID Upload" required={false}><input className="mt-1.5 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-[#01A14B]/10 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#01A14B] hover:file:bg-[#01A14B]/20" type="file" accept="image/*,.pdf" onChange={e=>chooseFile("gfcm_kyc_auth_id",e.target.files?.[0])} /></Field>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= STEP 3: VERIFICATION ================= */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                {form.gfcm_kyc_type === "myself" && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field title="Passport / ID Number"><input required className={input} value={form.gfcm_kyc_id_number} onChange={e=>set("gfcm_kyc_id_number",e.target.value)} placeholder="Enter ID Number" /></Field>
                    <Field title="Upload National ID / Passport" required={false}><input className="mt-1.5 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-[#01A14B]/10 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#01A14B] hover:file:bg-[#01A14B]/20" type="file" accept="image/*,.pdf" onChange={e=>chooseFile("gfcm_kyc_id_upload",e.target.files?.[0])} /></Field>
                  </div>
                )}
                
                {isSomeoneElse && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field title="Beneficiary Full Name"><input required className={input} value={form.gfcm_kyc_beneficiary_name} onChange={e=>set("gfcm_kyc_beneficiary_name",e.target.value)} placeholder="E.g. Hebel Hebel" /></Field>
                    <Field title="Relationship to Beneficiary"><input required className={input} value={form.gfcm_kyc_beneficiary_relation} onChange={e=>set("gfcm_kyc_beneficiary_relation",e.target.value)} placeholder="E.g. Isku Reer ama Family" /></Field>
                    <Field title="Beneficiary Contact"><input required type="tel" className={input} value={form.gfcm_kyc_beneficiary_contact} onChange={e=>set("gfcm_kyc_beneficiary_contact",e.target.value.replace(/[^0-9+]/g, ''))} placeholder="E.g. 252XXXXXXXXX" /></Field>
                    <Field title="Recipient of Funds"><select className={`${input} cursor-pointer`} value={form.gfcm_kyc_recipient_type} onChange={e=>set("gfcm_kyc_recipient_type",e.target.value as KycForm["gfcm_kyc_recipient_type"])}><option value="fundraiser">Myself (Fundraiser)</option><option value="beneficiary">The Beneficiary</option></select></Field>
                  </div>
                )}

                {isOrganization && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field title="Organization Name"><input required className={input} value={form.gfcm_kyc_org_name} onChange={e=>set("gfcm_kyc_org_name",e.target.value)} placeholder="E.g. Magaca Organization ka" /></Field>
                    <Field title="Organization Type">
                      <select required className={`${input} cursor-pointer`} value={form.gfcm_kyc_org_type} onChange={e=>set("gfcm_kyc_org_type",e.target.value)}>
                        <option value="">Select an organization type...</option>
                        <option value="NGO">NGO (Non-Governmental Organization)</option>
                        <option value="Non-Profit">Non-Profit Organization</option>
                        <option value="Charity">Registered Charity</option>
                        <option value="Community_Group">Community Group</option>
                        <option value="Corporate">Corporate / Business</option>
                        <option value="Other">Other</option>
                      </select>
                    </Field>
                    <Field title="Registration Number" required={false}><input className={input} value={form.gfcm_kyc_org_reg_number} onChange={e=>set("gfcm_kyc_org_reg_number",e.target.value)} placeholder="E.g. 123456789" /></Field>
                    <Field title="Website / Social Links"><input required className={input} value={form.gfcm_kyc_org_website} onChange={e=>set("gfcm_kyc_org_website",e.target.value)} placeholder="E.g. www.website.org" /></Field>
                    <div className="sm:col-span-2">
                      <Field title="Upload Registration Certificate" required={false}><input className="mt-1.5 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-[#01A14B]/10 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#01A14B] hover:file:bg-[#01A14B]/20" type="file" accept="image/*,.pdf" onChange={e=>chooseFile("gfcm_kyc_org_cert",e.target.files?.[0])} /></Field>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= STEP 4: WITHDRAWAL SETUP ================= */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">Choose Payout Method <span className="text-red-500">*</span></label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={`relative cursor-pointer rounded-2xl border-2 p-4 text-center transition-all ${form.gfcm_kyc_payout_method === "mobile_money" ? "border-[#01A14B] bg-[#01A14B]/5" : "border-gray-200 hover:border-[#01A14B]/40"}`}>
                      <input type="radio" className="sr-only" checked={form.gfcm_kyc_payout_method === "mobile_money"} onChange={() => set("gfcm_kyc_payout_method", "mobile_money")} />
                      <div className="flex items-center justify-center gap-2 font-bold text-[#16324F]">
                        <Icon icon="solar:smartphone-bold" className="text-xl text-[#01A14B]" /> Mobile Money
                      </div>
                    </label>
                    <label className={`relative cursor-pointer rounded-2xl border-2 p-4 text-center transition-all ${form.gfcm_kyc_payout_method === "bank" ? "border-[#01A14B] bg-[#01A14B]/5" : "border-gray-200 hover:border-[#01A14B]/40"}`}>
                      <input type="radio" className="sr-only" checked={form.gfcm_kyc_payout_method === "bank"} onChange={() => set("gfcm_kyc_payout_method", "bank")} />
                      <div className="flex items-center justify-center gap-2 font-bold text-[#16324F]">
                        <Icon icon="solar:bank-bold" className="text-xl text-[#01A14B]" /> Bank Transfer
                      </div>
                    </label>
                  </div>
                </div>

                {form.gfcm_kyc_payout_method === "mobile_money" ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field title="Select Mobile Money Provider">
                        <select className={`${input} cursor-pointer`} value={form.gfcm_kyc_mobile_provider} onChange={e=>set("gfcm_kyc_mobile_provider",e.target.value)}>
                          <option value="Edahab">eDahab</option>
                          <option value="Zaad">Zaad</option>
                          <option value="EVC">EVC Plus</option>
                          <option value="Sahal">Sahal</option>
                          <option value="Mpessa">M-Pesa</option>
                        </select>
                      </Field>
                    </div>
                    <Field title="Mobile Money Account Name"><input required className={input} value={form.gfcm_kyc_mobile_name} onChange={e=>set("gfcm_kyc_mobile_name",e.target.value)} placeholder="E.g. Hebel Hebel" /></Field>
                    <div className="space-y-1.5">
                      <label className={label}>Mobile Money Account Number <span className="text-red-500">*</span></label>
                      <div className="flex h-12 overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm focus-within:border-[#01A14B] focus-within:ring-1 focus-within:ring-[#01A14B]">
                        <span className="flex items-center justify-center bg-gray-50 px-4 text-sm font-bold text-gray-600 border-r border-gray-300">252</span>
                        <input required type="tel" className="w-full bg-transparent px-4 text-sm text-[#16324F] outline-none" placeholder="XXXXXXX" value={form.gfcm_kyc_mobile_number.replace(/^252/, '')} onChange={e=>set("gfcm_kyc_mobile_number", `252${e.target.value.replace(/[^0-9]/g, '')}`)} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field title="Bank Name"><input required className={input} value={form.gfcm_kyc_bank_name} onChange={e=>set("gfcm_kyc_bank_name",e.target.value)} placeholder="E.g. Dahabshiil International Bank" /></Field>
                    <Field title="Account Holder Name"><input required className={input} value={form.gfcm_kyc_bank_account_name} onChange={e=>set("gfcm_kyc_bank_account_name",e.target.value)} placeholder="E.g. Hebel Hebel" /></Field>
                    <Field title="Account Number"><input required className={input} value={form.gfcm_kyc_bank_account_number} onChange={e=>set("gfcm_kyc_bank_account_number",e.target.value)} placeholder="E.g. 123456789" /></Field>
                    <Field title="SWIFT / BIC" required={false}><input className={input} value={form.swift_bic} onChange={e=>set("swift_bic",e.target.value)} /></Field>
                  </div>
                )}

                {/* Match Warning Logic */}
                <div className={`mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm font-medium transition-colors ${namesMismatch ? "border-red-200 bg-red-50 text-red-700" : "border-[#01A14B]/20 bg-[#01A14B]/5 text-[#01A14B]"}`}>
                  <Icon icon={namesMismatch ? "solar:danger-circle-bold" : "solar:info-circle-bold"} className="text-xl shrink-0 mt-0.5" />
                  <p>
                    {namesMismatch 
                      ? `Account name mismatch! The payout name must exactly match the registered name: "${expectedAccountName}".` 
                      : `The payout account name must exactly match the registered name of the recipient.`}
                  </p>
                </div>
              </div>
            )}

            {/* ================= STEP 5: FINALIZATION ================= */}
            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                
                <h4 className="mb-4 text-sm font-semibold text-gray-800">Preferred Payout Currency</h4>
                <div className="grid gap-3 sm:grid-cols-3 mb-8">
                  {(["USD","SLSH","KES"] as const).map(currency => {
                    const key = isOrganization ? "gfcm_kyc_payout_currency_org" : "gfcm_kyc_payout_currency";
                    return (
                      <label key={currency} className={`relative cursor-pointer rounded-2xl border-2 p-4 text-center transition-all ${form[key] === currency ? "border-[#01A14B] bg-[#01A14B]/5" : "border-gray-200 hover:border-[#01A14B]/40"}`}>
                        <input type="radio" className="sr-only" checked={form[key] === currency} onChange={() => set(key, currency)} />
                        <div className="font-bold text-[#16324F] flex items-center justify-center gap-2">
                          {currency === "USD" && "🇺🇸"}
                          {currency === "SLSH" && "🇸🇴"}
                          {currency === "KES" && "🇰🇪"}
                          {currency}
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input required type="checkbox" className="mt-1 h-5 w-5 shrink-0 rounded border-gray-300 text-[#01A14B] focus:ring-[#01A14B]" checked={form.gfcm_kyc_consent} onChange={e=>set("gfcm_kyc_consent", e.target.checked)} />
                    <span className="text-sm leading-relaxed text-gray-600">
                      I have read, understood, and agree to the Hiilbox <Link href="/terms-and-conditions" target="_blank" className="font-bold text-[#01A14B] hover:underline">Terms and Conditions</Link> and <Link href="/privacy-policy" target="_blank" className="font-bold text-[#01A14B] hover:underline">Privacy Policy</Link>. I confirm that the information provided is accurate and true.
                    </span>
                  </label>
                </div>

              </div>
            )}

            {/* ================= NAVIGATION BUTTONS ================= */}
            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between border-t border-gray-100 pt-8">
              
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="w-full sm:w-auto rounded-xl border-2 border-gray-200 bg-white px-8 py-3.5 text-[15px] font-bold text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-100">
                  Back
                </button>
              ) : (
                <div /> // Spacer
              )}

              {step < 5 ? (
                <button type="button" onClick={submit} disabled={!canGoNext()} className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#01A14B] px-10 py-3.5 text-[15px] font-bold text-white shadow-sm transition hover:bg-[#018b41] focus:outline-none focus:ring-4 focus:ring-[#01A14B]/20 disabled:opacity-50">
                  Continue <Icon icon="solar:arrow-right-line-duotone" className="text-lg" />
                </button>
              ) : (
                <button type="submit" disabled={saving || namesMismatch || !form.gfcm_kyc_consent} className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#01A14B] px-10 py-3.5 text-[15px] font-bold text-white shadow-sm transition hover:bg-[#018b41] focus:outline-none focus:ring-4 focus:ring-[#01A14B]/20 disabled:opacity-50">
                  {saving ? <Icon icon="solar:spinner-broken" className="animate-spin text-xl" /> : <Icon icon="solar:check-circle-bold" className="text-xl" />}
                  {saving ? "Submitting KYC..." : "Submit Verification"}
                </button>
              )}

            </div>

          </form>
        </div>

      </div>
    </main>
  );
}