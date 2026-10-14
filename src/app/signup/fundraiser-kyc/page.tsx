"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardApi } from "@/lib/dashboard/api";

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
  gfcm_kyc_contact_name: "",
  gfcm_kyc_contact_phone: "",
  gfcm_kyc_contact_address: "",
  gfcm_kyc_contact_city: "",
  gfcm_kyc_rep_name: "",
  gfcm_kyc_rep_role: "",
  gfcm_kyc_rep_phone: "",
  gfcm_kyc_rep_address: "",
  gfcm_kyc_rep_city: "",
  gfcm_kyc_fundraiser_id_number: "",
  gfcm_kyc_auth_id_number: "",
  gfcm_kyc_id_number: "",
  gfcm_kyc_beneficiary_name: "",
  gfcm_kyc_beneficiary_relation: "",
  gfcm_kyc_beneficiary_contact: "",
  gfcm_kyc_org_name: "",
  gfcm_kyc_org_type: "",
  gfcm_kyc_org_reg_number: "",
  gfcm_kyc_org_website: "",
  gfcm_kyc_recipient_type: "fundraiser",
  gfcm_kyc_payout_method: "mobile_money",
  gfcm_kyc_mobile_provider: "Edahab",
  gfcm_kyc_mobile_name: "",
  gfcm_kyc_mobile_number: "",
  gfcm_kyc_bank_name: "",
  gfcm_kyc_bank_account_name: "",
  gfcm_kyc_bank_account_number: "",
  swift_bic: "",
  gfcm_kyc_payout_currency: "USD",
  gfcm_kyc_payout_currency_org: "USD",
  gfcm_kyc_consent: false,
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
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Unable to upload KYC document.");
  const image = Array.isArray(data?.images) ? data.images[0] : null;
  return image?.url || image?.id || "";
}

export default function FundraiserKycPage() {
  const router = useRouter();
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
        const response = await dashboardApi("fundraiser/kyc");
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
  const payoutAccountName = form.gfcm_kyc_payout_method === "mobile_money" ? form.gfcm_kyc_mobile_name : form.gfcm_kyc_bank_account_name;
  const expectedAccountName = isSomeoneElse && form.gfcm_kyc_recipient_type === "beneficiary" ? form.gfcm_kyc_beneficiary_name : isOrganization ? form.gfcm_kyc_rep_name : form.gfcm_kyc_contact_name;
  const namesMismatch = !isOrganization && Boolean(expectedAccountName && payoutAccountName && expectedAccountName.trim().toLowerCase() !== payoutAccountName.trim().toLowerCase());

  function set<K extends keyof KycForm>(key: K, value: KycForm[K]) { setForm((current) => ({ ...current, [key]: value })); }
  function chooseFile(key: FileKey, file: File | undefined) { setFiles((current) => ({ ...current, [key]: file })); }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (namesMismatch) { setError(`Payout account name must exactly match ${expectedAccountName}.`); return; }
    setSaving(true);
    try {
      const payload: Record<string, any> = { ...form, gfcm_kyc_consent: true };
      for (const [key, file] of Object.entries(files) as [FileKey, File][]) {
        if (file) payload[key] = await uploadDocument(file);
      }
      const response = await dashboardApi("fundraiser/kyc", { method: "POST", body: JSON.stringify(payload) });
      setStatus(String(response?.status || "submitted"));
      window.dispatchEvent(new Event("hiilbox-kyc-changed"));
      router.push("/dashboard/fundraiser-wallet");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to submit KYC."); }
    finally { setSaving(false); }
  }

  const input = "mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#16324F] outline-none transition focus:border-[#18A558] focus:bg-white focus:ring-4 focus:ring-[#18A558]/10";
  const label = "block text-sm font-medium text-[#16324F]";
  const Field = ({ title, children }: { title: string; children: ReactNode }) => <label className={label}>{title}{children}</label>;

  if (loading) return <main className="min-h-screen bg-[#F6FAF7] px-4 py-12"><div className="mx-auto max-w-3xl rounded-2xl bg-white p-10 text-center text-sm text-gray-500">Loading KYC…</div></main>;

  return <main className="min-h-screen bg-[#F6FAF7] px-4 py-8 sm:px-6 lg:py-12">
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8 text-center"><Link href="/" className="inline-flex items-center"><span className="text-3xl font-extrabold tracking-tight text-[#18A558]">Hiil<span className="text-[#16324F]">box</span></span></Link><h1 className="mt-7 text-3xl font-bold tracking-tight text-[#16324F] sm:text-4xl">Fundraiser verification</h1><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">Complete the same KYC information used by GrowFund and save the payout method directly to your fundraiser wallet.</p>{status !== "not_started" && <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#18A558]">KYC status: {status.replaceAll("_", " ")}</p>}</div>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_10px_40px_rgba(15,45,65,0.08)] sm:p-8">
        {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={submit} className="space-y-8">
          <section><h2 className="text-lg font-semibold text-[#16324F]">Who are you raising funds for?</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{[["myself","Myself"],["someone_else","Someone else"],["organization","Organization"]].map(([value,title])=><label key={value} className={`cursor-pointer rounded-xl border p-4 ${form.gfcm_kyc_type===value?"border-[#18A558] bg-[#F1FBF5]":"border-gray-200"}`}><input type="radio" className="mr-2" checked={form.gfcm_kyc_type===value} onChange={()=>set("gfcm_kyc_type",value as KycForm["gfcm_kyc_type"])} />{title}</label>)}</div></section>

          {!isOrganization ? <section><h2 className="text-lg font-semibold text-[#16324F]">Contact information</h2><div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field title="Full name *"><input required className={input} value={form.gfcm_kyc_contact_name} onChange={e=>set("gfcm_kyc_contact_name",e.target.value)} /></Field>
            <Field title="Phone number *"><input required className={input} value={form.gfcm_kyc_contact_phone} onChange={e=>set("gfcm_kyc_contact_phone",e.target.value)} /></Field>
            <Field title="Address *"><input required className={input} value={form.gfcm_kyc_contact_address} onChange={e=>set("gfcm_kyc_contact_address",e.target.value)} /></Field>
            <Field title="City *"><input required className={input} value={form.gfcm_kyc_contact_city} onChange={e=>set("gfcm_kyc_contact_city",e.target.value)} /></Field>
          </div></section> : <section><h2 className="text-lg font-semibold text-[#16324F]">Representative verification</h2><div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field title="Representative full name *"><input required className={input} value={form.gfcm_kyc_rep_name} onChange={e=>set("gfcm_kyc_rep_name",e.target.value)} /></Field>
            <Field title="Organization role *"><input required className={input} value={form.gfcm_kyc_rep_role} onChange={e=>set("gfcm_kyc_rep_role",e.target.value)} /></Field>
            <Field title="Representative phone *"><input required className={input} value={form.gfcm_kyc_rep_phone} onChange={e=>set("gfcm_kyc_rep_phone",e.target.value)} /></Field>
            <Field title="Representative address *"><input required className={input} value={form.gfcm_kyc_rep_address} onChange={e=>set("gfcm_kyc_rep_address",e.target.value)} /></Field>
            <Field title="Representative city *"><input required className={input} value={form.gfcm_kyc_rep_city} onChange={e=>set("gfcm_kyc_rep_city",e.target.value)} /></Field>
            <Field title="Your passport / ID number *"><input required className={input} value={form.gfcm_kyc_fundraiser_id_number} onChange={e=>set("gfcm_kyc_fundraiser_id_number",e.target.value)} /></Field>
            <Field title="Upload your ID"><input className={input} type="file" accept="image/*,.pdf" onChange={e=>chooseFile("gfcm_kyc_fundraiser_id",e.target.files?.[0])} /></Field>
            <Field title="Authorized person ID number *"><input required className={input} value={form.gfcm_kyc_auth_id_number} onChange={e=>set("gfcm_kyc_auth_id_number",e.target.value)} /></Field>
            <Field title="Authorized person ID upload"><input className={input} type="file" accept="image/*,.pdf" onChange={e=>chooseFile("gfcm_kyc_auth_id",e.target.files?.[0])} /></Field>
          </div></section>}

          {form.gfcm_kyc_type === "myself" && <section><h2 className="text-lg font-semibold text-[#16324F]">Identity verification</h2><div className="mt-4 grid gap-5 sm:grid-cols-2"><Field title="Passport / ID number *"><input required className={input} value={form.gfcm_kyc_id_number} onChange={e=>set("gfcm_kyc_id_number",e.target.value)} /></Field><Field title="National ID / passport upload"><input className={input} type="file" accept="image/*,.pdf" onChange={e=>chooseFile("gfcm_kyc_id_upload",e.target.files?.[0])} /></Field></div></section>}

          {isSomeoneElse && <section><h2 className="text-lg font-semibold text-[#16324F]">Beneficiary information</h2><div className="mt-4 grid gap-5 sm:grid-cols-2"><Field title="Beneficiary full name *"><input required className={input} value={form.gfcm_kyc_beneficiary_name} onChange={e=>set("gfcm_kyc_beneficiary_name",e.target.value)} /></Field><Field title="Relationship to beneficiary *"><input required className={input} value={form.gfcm_kyc_beneficiary_relation} onChange={e=>set("gfcm_kyc_beneficiary_relation",e.target.value)} /></Field><Field title="Beneficiary contact *"><input required className={input} value={form.gfcm_kyc_beneficiary_contact} onChange={e=>set("gfcm_kyc_beneficiary_contact",e.target.value)} /></Field><Field title="Recipient of funds *"><select className={input} value={form.gfcm_kyc_recipient_type} onChange={e=>set("gfcm_kyc_recipient_type",e.target.value as KycForm["gfcm_kyc_recipient_type"])}><option value="fundraiser">Myself (Fundraiser)</option><option value="beneficiary">The Beneficiary</option></select></Field></div></section>}

          {isOrganization && <section><h2 className="text-lg font-semibold text-[#16324F]">Organization verification</h2><div className="mt-4 grid gap-5 sm:grid-cols-2"><Field title="Organization name *"><input required className={input} value={form.gfcm_kyc_org_name} onChange={e=>set("gfcm_kyc_org_name",e.target.value)} /></Field><Field title="Organization type *"><select required className={input} value={form.gfcm_kyc_org_type} onChange={e=>set("gfcm_kyc_org_type",e.target.value)}><option value="">Select organization type</option><option value="NGO">NGO</option><option value="Non-Profit">Non-Profit Organization</option><option value="Charity">Registered Charity</option><option value="Community_Group">Community Group</option><option value="Corporate">Corporate / Business</option><option value="Other">Other</option></select></Field><Field title="Registration number"><input className={input} value={form.gfcm_kyc_org_reg_number} onChange={e=>set("gfcm_kyc_org_reg_number",e.target.value)} /></Field><Field title="Website *"><input required className={input} value={form.gfcm_kyc_org_website} onChange={e=>set("gfcm_kyc_org_website",e.target.value)} /></Field><Field title="Organization certificate"><input className={input} type="file" accept="image/*,.pdf" onChange={e=>chooseFile("gfcm_kyc_org_cert",e.target.files?.[0])} /></Field></div></section>}

          <section><h2 className="text-lg font-semibold text-[#16324F]">Withdrawal setup</h2><div className="mt-4 grid gap-5 sm:grid-cols-2"><Field title="Payout method *"><select className={input} value={form.gfcm_kyc_payout_method} onChange={e=>set("gfcm_kyc_payout_method",e.target.value as KycForm["gfcm_kyc_payout_method"])}><option value="mobile_money">Mobile Money</option><option value="bank">Bank Transfer</option></select></Field>{form.gfcm_kyc_payout_method === "mobile_money" ? <><Field title="Mobile money provider *"><select className={input} value={form.gfcm_kyc_mobile_provider} onChange={e=>set("gfcm_kyc_mobile_provider",e.target.value)}><option value="Edahab">eDahab</option><option value="Zaad">Zaad</option><option value="EVC">EVC Plus</option><option value="Sahal">Sahal</option><option value="Mpessa">M-Pesa</option></select></Field><Field title="Mobile money account name *"><input required className={input} value={form.gfcm_kyc_mobile_name} onChange={e=>set("gfcm_kyc_mobile_name",e.target.value)} /></Field><Field title="Mobile money account number *"><input required className={input} value={form.gfcm_kyc_mobile_number} onChange={e=>set("gfcm_kyc_mobile_number",e.target.value)} /></Field></> : <><Field title="Bank name *"><input required className={input} value={form.gfcm_kyc_bank_name} onChange={e=>set("gfcm_kyc_bank_name",e.target.value)} /></Field><Field title="Account holder name *"><input required className={input} value={form.gfcm_kyc_bank_account_name} onChange={e=>set("gfcm_kyc_bank_account_name",e.target.value)} /></Field><Field title="Account number *"><input required className={input} value={form.gfcm_kyc_bank_account_number} onChange={e=>set("gfcm_kyc_bank_account_number",e.target.value)} /></Field><Field title="SWIFT / BIC"><input className={input} value={form.swift_bic} onChange={e=>set("swift_bic",e.target.value)} /></Field></>}</div>{namesMismatch && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Account name must exactly match {expectedAccountName}.</div>}</section>

          <section><h2 className="text-lg font-semibold text-[#16324F]">Preferred payout currency</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{(["USD","SLSH","KES"] as const).map(currency=>{const key=isOrganization?"gfcm_kyc_payout_currency_org":"gfcm_kyc_payout_currency";return <label key={currency} className={`cursor-pointer rounded-xl border p-4 text-center ${form[key]===currency?"border-[#18A558] bg-[#F1FBF5]":"border-gray-200"}`}><input type="radio" className="mr-2" checked={form[key]===currency} onChange={()=>set(key,currency)} />{currency}</label>})}</div></section>

          <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 text-sm text-gray-600"><input required type="checkbox" className="mt-1" checked={form.gfcm_kyc_consent} onChange={e=>set("gfcm_kyc_consent",e.target.checked)} /><span>I have read and agree to the website <Link href="/terms-and-conditions" target="_blank" className="text-[#18A558] underline">Terms and Conditions</Link> and <Link href="/privacy-policy" target="_blank" className="text-[#18A558] underline">Privacy Policy</Link>.</span></label>
          <button disabled={saving || namesMismatch || !form.gfcm_kyc_consent} className="w-full rounded-xl bg-[#18A558] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#128044] disabled:opacity-50">{saving?"Submitting KYC…":"Submit KYC and save payout method"}</button>
        </form>
      </div>
    </div>
  </main>;
}
