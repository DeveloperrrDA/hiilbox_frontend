"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CardBox from "@/app/components/shared/CardBox";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { dashboardRole, savedDashboardUser } from "@/lib/dashboard/roles";

type Category = { id: number; name: string; parent: number };
type LocationOption = { value: string; label: string };

type FormState = {
  title: string;
  description: string;
  story: string;
  category: string;
  sub_category: string;
  location: string;
  goal_amount: string;
  end_date: string;
  min_donation_amount: string;
  max_donation_amount: string;
  suggested: string;
  confirmation_title: string;
  confirmation_description: string;
  reaching_action: string;
  suggested_option_type: string;
  allow_custom_donation: string;
  is_featured: string;
};

function readId(value: any) {
  return String(value?.id ?? value?.term_id ?? value ?? "");
}

function readDate(value: any) {
  if (!value) return "";
  const text = String(value);
  return text.length >= 10 ? text.slice(0, 10) : text;
}

export default function CampaignEditor({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [campaignStatus, setCampaignStatus] = useState("");
  const [section, setSection] = useState<"basics" | "goal" | "options">("basics");
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
  const [images, setImages] = useState<any[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    story: "",
    category: "",
    sub_category: "",
    location: "",
    goal_amount: "",
    end_date: "",
    min_donation_amount: "0.1",
    max_donation_amount: "10000",
    suggested: "10,25,50,100",
    confirmation_title: "",
    confirmation_description: "",
    reaching_action: "continue",
    suggested_option_type: "amount-only",
    allow_custom_donation: "true",
    is_featured: "false",
  });

  const set = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token") || "";
    if (!accessToken) {
      setError("Please sign in to edit this campaign.");
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${accessToken}` };
    const isAdmin = dashboardRole(savedDashboardUser()) === "admin";
    const campaignEndpoint = isAdmin ? `/api/admin/growfund/campaigns/${id}` : `/api/dashboard/campaigns/${id}`;
    Promise.all([
      fetch(campaignEndpoint, { headers, cache: "no-store" }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || "Unable to load campaign.");
        return data;
      }),
      fetch("/api/campaigns/categories", { headers, cache: "no-store" }).then((response) => response.json()),
      fetch("/api/campaigns/locations?include_rest_of_the_world=true", { headers, cache: "no-store" }).then((response) => response.json()),
    ])
      .then(([campaignResponse, categoryResponse, locationResponse]) => {
        const campaign = campaignResponse?.data || {};
        setCampaignStatus(String(campaign.status ?? ""));

        const rawCategories = Array.isArray(categoryResponse?.data) ? categoryResponse.data : [];
        const normalizedCategories = rawCategories
          .map((item: any) => ({
            id: Number(item.id ?? item.term_id ?? item.value),
            name: String(item.name ?? item.label ?? item.title ?? ""),
            parent: Number(item.parent ?? item.parent_id ?? 0),
          }))
          .filter((item: Category) => item.id && item.name);
        setCategories(normalizedCategories);

        const locationOptions: LocationOption[] = [];
        const addLocation = (value: any, label: any) => {
          const normalizedValue = String(value ?? "").trim();
          const normalizedLabel = String(label ?? "").trim();
          if (normalizedValue && normalizedLabel && !locationOptions.some((item) => item.value === normalizedValue)) {
            locationOptions.push({ value: normalizedValue, label: normalizedLabel });
          }
        };
        const walkLocations = (node: any, prefix = "") => {
          if (Array.isArray(node)) {
            node.forEach((item) => walkLocations(item, prefix));
            return;
          }
          if (!node || typeof node !== "object") return;
          const value = node.value ?? node.code ?? node.location ?? node.id;
          const label = node.label ?? node.name ?? node.title;
          if (typeof value === "string" && value.includes(":")) addLocation(value, prefix && label ? `${prefix} — ${label}` : label ?? value);
          const country = String(node.country_name ?? node.country ?? "");
          for (const [key, nested] of Object.entries(node)) {
            if (!["value", "code", "location", "id", "label", "name", "title", "country_name", "country"].includes(key) && (Array.isArray(nested) || typeof nested === "object")) {
              walkLocations(nested, country || prefix);
            }
          }
        };
        const rawLocations = locationResponse?.data ?? locationResponse?.locations ?? locationResponse;
        if (rawLocations && typeof rawLocations === "object" && !Array.isArray(rawLocations)) {
          for (const [key, value] of Object.entries(rawLocations)) {
            if (typeof value === "string" && key.includes(":")) addLocation(key, value);
            else walkLocations(value, String(key).length <= 3 ? "" : String(key));
          }
        } else {
          walkLocations(rawLocations);
        }
        if (campaign.location && !locationOptions.some((item) => item.value === String(campaign.location))) {
          addLocation(campaign.location, campaign.location_label ?? campaign.location);
        }
        setLocations(locationOptions.sort((a, b) => a.label.localeCompare(b.label)));

        const suggestedOptions = Array.isArray(campaign.suggested_options)
          ? campaign.suggested_options
              .map((item: any) => Number(item?.amount ?? item))
              .filter((amount: number) => Number.isFinite(amount) && amount > 0)
              .join(",")
          : "10,25,50,100";

        setForm({
          title: String(campaign.title ?? ""),
          description: String(campaign.description ?? ""),
          story: String(campaign.story ?? campaign.description ?? ""),
          category: readId(campaign.category ?? campaign.category_id),
          sub_category: readId(campaign.sub_category ?? campaign.sub_category_id),
          location: String(campaign.location ?? ""),
          goal_amount: String(campaign.goal_amount ?? campaign.goal ?? ""),
          end_date: readDate(campaign.end_date ?? campaign.deadline),
          min_donation_amount: String(campaign.min_donation_amount ?? "0.1"),
          max_donation_amount: String(campaign.max_donation_amount ?? "10000"),
          suggested: suggestedOptions || "10,25,50,100",
          confirmation_title: String(campaign.confirmation_title ?? ""),
          confirmation_description: String(campaign.confirmation_description ?? ""),
          reaching_action: String(campaign.reaching_action ?? "continue"),
          suggested_option_type: String(campaign.suggested_option_type ?? "amount-only"),
          allow_custom_donation: String(campaign.allow_custom_donation ?? true),
          is_featured: String(campaign.is_featured ?? false),
        });
        const rawImages = Array.isArray(campaign.images) ? campaign.images : Array.isArray(campaign.gallery) ? campaign.gallery : [];
        setImages(rawImages);
        const rawFaqs = Array.isArray(campaign.faqs) ? campaign.faqs : [];
        setFaqs(rawFaqs.map((faq: any) => ({ question: String(faq?.question ?? faq?.title ?? ""), answer: String(faq?.answer ?? faq?.description ?? "") })));
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load campaign."))
      .finally(() => setLoading(false));
  }, [id]);

  const parents = useMemo(() => categories.filter((category) => category.parent === 0), [categories]);
  const children = useMemo(() => categories.filter((category) => category.parent === Number(form.category)), [categories, form.category]);

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;
    const accessToken = localStorage.getItem("access_token") || "";
    if (!accessToken) return;
    setUploadingImages(true); setError("");
    try {
      const body = new FormData(); Array.from(files).forEach((file) => body.append("images[]", file));
      const response = await fetch("/api/campaigns/media", { method:"POST", headers:{Authorization:`Bearer ${accessToken}`}, body });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Image upload failed.");
      const uploaded = Array.isArray(data?.images) ? data.images : Array.isArray(data?.data?.images) ? data.data.images : [];
      setImages((current) => [...current, ...uploaded]);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Image upload failed."); }
    finally { setUploadingImages(false); }
  }

  function validate() {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = "Campaign title is required.";
    if (!form.description.trim()) errors.description = "Short description is required.";
    if (!form.story.trim()) errors.story = "Campaign story is required.";
    if (!form.category) errors.category = "Select a category.";
    if (!form.location) errors.location = "Select a location.";
    if (!Number.isFinite(Number(form.goal_amount)) || Number(form.goal_amount) <= 0) errors.goal_amount = "Enter a goal greater than zero.";
    if (!form.end_date) errors.end_date = "Select an end date.";
    const min = Number(form.min_donation_amount);
    const max = Number(form.max_donation_amount);
    if (!Number.isFinite(min) || min < 0.1) errors.min_donation_amount = "Minimum donation must be at least $0.10.";
    if (!Number.isFinite(max) || max <= 0) errors.max_donation_amount = "Enter a valid maximum donation.";
    if (Number.isFinite(min) && Number.isFinite(max) && max < min) errors.max_donation_amount = "Maximum donation must be at least the minimum.";

    const suggested = form.suggested.split(",").map((value) => Number(value.trim())).filter((value) => Number.isFinite(value) && value > 0);
    if (!suggested.length) errors.suggested = "Add at least one suggested donation amount.";
    setFieldErrors(errors);
    return { valid: Object.keys(errors).length === 0, suggested };
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token") || "";
    if (!accessToken) return;

    const result = validate();
    if (!result.valid) return;

    setSaving(true);
    setError("");
    try {
      const suggestedOptions = result.suggested.map((amount, index) => ({
        amount,
        is_default: index === Math.min(1, result.suggested.length - 1),
        description: "",
      }));

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        story: form.story.trim(),
        category: Number(form.category),
        sub_category: form.sub_category ? Number(form.sub_category) : 0,
        location: form.location,
        end_date: `${form.end_date} 23:59:59`,
        has_goal: true,
        goal_type: "raised-amount",
        goal_amount: Number(form.goal_amount),
        reaching_action: form.reaching_action,
        allow_custom_donation: form.allow_custom_donation === "true",
        min_donation_amount: form.min_donation_amount,
        max_donation_amount: form.max_donation_amount,
        suggested_option_type: form.suggested_option_type,
        suggested_options: suggestedOptions,
        images: images.map((image:any) => Number(image?.id ?? image?.media_id ?? image)).filter((value:number) => Number.isFinite(value) && value > 0),
        is_featured: form.is_featured === "true",
        confirmation_title: form.confirmation_title.trim(),
        confirmation_description: form.confirmation_description.trim(),
        faqs: faqs.filter((faq) => faq.question.trim() || faq.answer.trim()),
      };

      const isAdmin = dashboardRole(savedDashboardUser()) === "admin";
      const updateEndpoint = isAdmin ? `/api/admin/growfund/campaigns/${id}/update` : `/api/dashboard/campaigns/${id}`;
      const response = await fetch(updateEndpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data?.details && typeof data.details === "object") {
          const normalized: Record<string, string> = {};
          for (const [key, value] of Object.entries(data.details)) {
            normalized[key] = Array.isArray(value) ? value.join(" ") : String(value);
          }
          setFieldErrors(normalized);
        }
        throw new Error(data?.message || "Unable to update campaign.");
      }

      sessionStorage.setItem("growfund_campaign_updated", id);
      router.push(`/dashboard/campaigns/${id}/overview`);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to update campaign.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <CardBox><div className="py-12 text-center text-darklink">Loading campaign…</div></CardBox>;

  const suggestedValues = form.suggested.split(",").map((v)=>v.trim()).filter(Boolean);
  const imageUrl=(image:any)=>String(image?.url??image?.src??image?.source_url??image?.sizes?.medium??"");

  return <form onSubmit={submit} className="min-h-screen bg-lightgray/40">
    <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-ld bg-white px-5 py-4 dark:bg-darkgray">
      <div className="flex items-center gap-3"><Button type="button" variant="ghost" size="sm" onClick={()=>router.push("/dashboard/campaigns")}><Icon icon="solar:arrow-left-linear"/></Button><h2 className="text-xl font-semibold">Edit Campaign</h2></div>
      <div className="flex items-center gap-2">{[["basics","Basic","solar:rocket-2-line-duotone"],["goal","Goal","solar:dollar-minimalistic-line-duotone"],["options","Options","solar:card-2-line-duotone"]].map(([key,label,icon])=><button key={key} type="button" onClick={()=>setSection(key as any)} className={`flex items-center gap-2 rounded-xl px-5 py-3 ${section===key?"bg-white text-success shadow-sm":"text-dark"}`}><Icon icon={icon}/>{label}</button>)}</div>
      <div className="flex gap-2"><Button type="button" variant="outline" asChild><Link href={`/campaign/${id}`}>Preview <Icon icon="solar:square-arrow-right-up-linear"/></Link></Button><Button type="submit" disabled={saving||uploadingImages}>{saving?"Saving…":"Save Changes"}</Button></div>
    </div>
    <div className="mx-auto max-w-6xl p-5 lg:p-8">
      {error&&<div className="mb-5 rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}
      <div className="mb-5 rounded-md border border-warning/30 bg-lightwarning px-4 py-3 text-sm text-warning">Saving campaign edits sends supported GrowFund changes for review. Current status: <strong>{campaignStatus||"unknown"}</strong>.</div>

      {section==="basics"&&<div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <CardBox><div className="space-y-5"><Field label="Title" value={form.title} onChange={(v:string)=>set("title",v)} error={fieldErrors.title}/><TextArea label="Description" value={form.description} onChange={(v:string)=>set("description",v)} error={fieldErrors.description} rows={5}/><TextArea label="Story" value={form.story} onChange={(v:string)=>set("story",v)} error={fieldErrors.story} rows={12}/>
        <div><div className="mb-2 text-sm font-medium">Images</div><input type="file" multiple accept="image/*" onChange={e=>void uploadImages(e.target.files)} disabled={uploadingImages} className="block w-full text-sm"/><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{images.map((image:any,index:number)=>{const url=imageUrl(image);return <div key={String(image?.id??index)} className="relative overflow-hidden rounded-lg border border-ld">{url?<img src={url} alt="" className="aspect-square w-full object-cover"/>:<div className="aspect-square bg-lightgray"/>}<button type="button" onClick={()=>setImages(x=>x.filter((_,i)=>i!==index))} className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white">Remove</button>{index===0&&<span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">Featured</span>}</div>})}</div></div></div></CardBox>
        <div className="space-y-5"><CardBox><div className="flex items-center gap-2 text-sm text-success"><Icon icon="solar:verified-check-bold"/> Campaign is {campaignStatus||"available"}</div></CardBox><CardBox><label className="flex items-center justify-between gap-4"><span><span className="block font-medium">Feature this campaign</span><span className="text-xs text-darklink">Appears prominently on lists & pages.</span></span><input type="checkbox" checked={form.is_featured==="true"} onChange={e=>set("is_featured",String(e.target.checked))} className="h-5 w-5"/></label><div className="mt-5"><SelectField label="Category" value={form.category} onChange={(v:string)=>{set("category",v);set("sub_category","")}} error={fieldErrors.category}><option value="">Select category</option>{parents.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</SelectField></div><div className="mt-4"><SelectField label="Sub-category" value={form.sub_category} onChange={(v:string)=>set("sub_category",v)} disabled={!form.category||!children.length}><option value="">No sub-category</option>{children.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</SelectField></div><div className="mt-4"><SelectField label="Location" value={form.location} onChange={(v:string)=>set("location",v)} error={fieldErrors.location}><option value="">Select location</option>{locations.map(l=><option key={l.value} value={l.value}>{l.label}</option>)}</SelectField></div></CardBox></div>
      </div>}

      {section==="goal"&&<CardBox className="mx-auto max-w-3xl"><h3 className="mb-5 text-xl font-semibold">Goal</h3><div className="rounded-xl border border-ld p-5"><div className="mb-5 flex items-center justify-between"><span className="font-medium">Campaign Goal</span><span className="h-6 w-11 rounded-full bg-success p-1"><span className="ml-auto block h-4 w-4 rounded-full bg-white"/></span></div><div className="grid gap-4 sm:grid-cols-2"><SelectField label="Goal Type" value="raised-amount" onChange={()=>{}}><option value="raised-amount">Raised Amount</option></SelectField><Field label="Target Goal" type="number" min="1" step="0.01" value={form.goal_amount} onChange={(v:string)=>set("goal_amount",v)} error={fieldErrors.goal_amount}/></div><div className="mt-5"><div className="mb-2 font-medium">When donation is reached the goal</div><div className="flex flex-wrap gap-6"><label><input type="radio" checked={form.reaching_action==="close"} onChange={()=>set("reaching_action","close")}/> Auto close campaign</label><label><input type="radio" checked={form.reaching_action==="continue"} onChange={()=>set("reaching_action","continue")}/> Keep receiving donations</label></div></div></div>
      <div className="mt-5 rounded-xl border border-ld p-5"><h4 className="mb-4 font-medium">Suggested Options</h4><div className="mb-4 flex gap-6"><label><input type="radio" checked={form.suggested_option_type==="amount-only"} onChange={()=>set("suggested_option_type","amount-only")}/> Amount Only</label><label><input type="radio" checked={form.suggested_option_type==="amount-description"} onChange={()=>set("suggested_option_type","amount-description")}/> Amount & Description</label></div><div className="space-y-3">{suggestedValues.map((value,index)=><div key={index} className="flex items-center gap-3 rounded-xl border border-ld px-5 py-4"><Icon icon="solar:hamburger-menu-linear"/><span className="font-semibold">${Number(value||0).toFixed(2)}</span><button type="button" className="ml-auto text-xs text-error" onClick={()=>set("suggested",suggestedValues.filter((_,i)=>i!==index).join(","))}>Remove</button></div>)}</div><Button type="button" variant="outline" className="mt-3 w-full" onClick={()=>set("suggested",[...suggestedValues,"10"].join(","))}><Icon icon="solar:add-circle-linear"/> Add Amount</Button>{fieldErrors.suggested&&<div className="mt-1 text-xs text-error">{fieldErrors.suggested}</div>}<label className="mt-5 flex items-center gap-2"><input type="checkbox" checked={form.allow_custom_donation==="true"} onChange={e=>set("allow_custom_donation",String(e.target.checked))}/> Allow custom donation amount</label><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Min Amount" type="number" min="0.1" step="0.01" value={form.min_donation_amount} onChange={(v:string)=>set("min_donation_amount",v)} error={fieldErrors.min_donation_amount}/><Field label="Max Amount" type="number" min="0.1" step="0.01" value={form.max_donation_amount} onChange={(v:string)=>set("max_donation_amount",v)} error={fieldErrors.max_donation_amount}/></div><div className="mt-4"><Field label="End date" type="date" value={form.end_date} onChange={(v:string)=>set("end_date",v)} error={fieldErrors.end_date}/></div></div></CardBox>}

      {section==="options"&&<div className="mx-auto max-w-3xl space-y-5"><CardBox><h3 className="mb-5 text-lg font-semibold">Donation Confirmation Message</h3><Field label="Title" value={form.confirmation_title} onChange={(v:string)=>set("confirmation_title",v)}/><div className="mt-4"><TextArea label="Description" value={form.confirmation_description} onChange={(v:string)=>set("confirmation_description",v)} rows={5}/></div></CardBox><CardBox><h3 className="mb-5 text-lg font-semibold">Frequently Asked Questions</h3><div className="space-y-3">{faqs.map((faq,index)=><div key={index} className="rounded-xl border border-ld p-4"><Field label="Question" value={faq.question} onChange={(v:string)=>setFaqs(x=>x.map((f,i)=>i===index?{...f,question:v}:f))}/><div className="mt-3"><TextArea label="Answer" value={faq.answer} onChange={(v:string)=>setFaqs(x=>x.map((f,i)=>i===index?{...f,answer:v}:f))} rows={3}/></div><button type="button" className="mt-2 text-sm text-error" onClick={()=>setFaqs(x=>x.filter((_,i)=>i!==index))}>Remove FAQ</button></div>)}</div><Button type="button" variant="outline" className="mt-4 w-full" onClick={()=>setFaqs(x=>[...x,{question:"",answer:""}])}><Icon icon="solar:add-circle-linear"/> Add FAQ</Button></CardBox></div>}
    </div>
  </form>;
}

function Field({ label, value, onChange, error, hint, className = "", type = "text", ...inputProps }: any) {
  return <label className={className}>
    <span className="mb-1.5 block text-sm font-medium text-dark">{label}</span>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-md border bg-transparent px-3 py-2.5 outline-none focus:border-primary ${error ? "border-error" : "border-ld"}`} {...inputProps} />
    {error ? <span className="mt-1 block text-xs text-error">{error}</span> : hint ? <span className="mt-1 block text-xs text-darklink">{hint}</span> : null}
  </label>;
}

function TextArea({ label, value, onChange, error, className = "", rows = 5 }: any) {
  return <label className={className}>
    <span className="mb-1.5 block text-sm font-medium text-dark">{label}</span>
    <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-md border bg-transparent px-3 py-2.5 outline-none focus:border-primary ${error ? "border-error" : "border-ld"}`} />
    {error && <span className="mt-1 block text-xs text-error">{error}</span>}
  </label>;
}

function SelectField({ label, value, onChange, error, className = "", children, disabled = false }: any) {
  return <label className={className}>
    <span className="mb-1.5 block text-sm font-medium text-dark">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className={`w-full rounded-md border bg-transparent px-3 py-2.5 outline-none focus:border-primary disabled:opacity-60 ${error ? "border-error" : "border-ld"}`}>{children}</select>
    {error && <span className="mt-1 block text-xs text-error">{error}</span>}
  </label>;
}
