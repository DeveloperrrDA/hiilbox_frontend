"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CardBox from "@/app/components/shared/CardBox";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

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
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    story: "",
    category: "",
    sub_category: "",
    location: "",
    goal_amount: "",
    end_date: "",
    min_donation_amount: "5",
    max_donation_amount: "10000",
    suggested: "10,25,50,100",
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
    Promise.all([
      fetch(`/api/dashboard/campaigns/${id}`, { headers, cache: "no-store" }).then(async (response) => {
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
          min_donation_amount: String(campaign.min_donation_amount ?? "5"),
          max_donation_amount: String(campaign.max_donation_amount ?? "10000"),
          suggested: suggestedOptions || "10,25,50,100",
        });
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load campaign."))
      .finally(() => setLoading(false));
  }, [id]);

  const parents = useMemo(() => categories.filter((category) => category.parent === 0), [categories]);
  const children = useMemo(() => categories.filter((category) => category.parent === Number(form.category)), [categories, form.category]);

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
    if (!Number.isFinite(min) || min < 0) errors.min_donation_amount = "Enter a valid minimum donation.";
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
        reaching_action: "close",
        allow_custom_donation: true,
        min_donation_amount: form.min_donation_amount,
        max_donation_amount: form.max_donation_amount,
        suggested_option_type: "amount-only",
        suggested_options: suggestedOptions,
      };

      const response = await fetch(`/api/dashboard/campaigns/${id}`, {
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

  return <div className="space-y-6">
    <CardBox>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h5 className="card-title">Edit campaign</h5>
          <p className="mt-1 text-sm text-darklink">Update the fundraiser-facing fields supported by GrowFund.</p>
        </div>
        <Button variant="outline" asChild><Link href={`/dashboard/campaigns/${id}/overview`}><Icon icon="solar:chart-2-line-duotone" /> Overview</Link></Button>
      </div>
      <div className="mt-5 rounded-md border border-warning/30 bg-lightwarning px-4 py-3 text-sm text-warning">
        GrowFund sends fundraiser edits back to <strong>pending review</strong>. Current status: <strong>{campaignStatus || "unknown"}</strong>.
      </div>
      {error && <div className="mt-4 rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}
    </CardBox>

    <CardBox>
      <form onSubmit={submit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Campaign title" value={form.title} onChange={(value: string) => set("title", value)} error={fieldErrors.title} className="md:col-span-2" />
        <TextArea label="Short description" value={form.description} onChange={(value: string) => set("description", value)} error={fieldErrors.description} className="md:col-span-2" rows={3} />
        <TextArea label="Campaign story" value={form.story} onChange={(value: string) => set("story", value)} error={fieldErrors.story} className="md:col-span-2" rows={10} />

        <SelectField label="Category" value={form.category} onChange={(value: string) => { set("category", value); set("sub_category", ""); }} error={fieldErrors.category}>
          <option value="">Select category</option>
          {parents.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </SelectField>
        <SelectField label="Sub-category" value={form.sub_category} onChange={(value: string) => set("sub_category", value)} error={fieldErrors.sub_category} disabled={!form.category || children.length === 0}>
          <option value="">No sub-category</option>
          {children.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </SelectField>

        <SelectField label="Location" value={form.location} onChange={(value: string) => set("location", value)} error={fieldErrors.location} className="md:col-span-2">
          <option value="">Select location</option>
          {locations.map((location) => <option key={location.value} value={location.value}>{location.label}</option>)}
        </SelectField>

        <Field label="Goal amount" type="number" min="0" step="0.01" value={form.goal_amount} onChange={(value: string) => set("goal_amount", value)} error={fieldErrors.goal_amount} />
        <Field label="End date" type="date" value={form.end_date} onChange={(value: string) => set("end_date", value)} error={fieldErrors.end_date} />
        <Field label="Minimum donation" type="number" min="0" step="0.01" value={form.min_donation_amount} onChange={(value: string) => set("min_donation_amount", value)} error={fieldErrors.min_donation_amount} />
        <Field label="Maximum donation" type="number" min="0" step="0.01" value={form.max_donation_amount} onChange={(value: string) => set("max_donation_amount", value)} error={fieldErrors.max_donation_amount} />
        <Field label="Suggested donation amounts" value={form.suggested} onChange={(value: string) => set("suggested", value)} error={fieldErrors.suggested} hint="Comma separated, for example: 10,25,50,100" className="md:col-span-2" />

        <div className="flex flex-wrap gap-3 pt-2 md:col-span-2">
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/campaigns")} disabled={saving}>Cancel</Button>
        </div>
      </form>
    </CardBox>
  </div>;
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
