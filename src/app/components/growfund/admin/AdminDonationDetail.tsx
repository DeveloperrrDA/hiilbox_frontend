"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CardBox from "@/app/components/shared/CardBox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { adminApi, dataFrom, fmtDate, money, rowsFrom } from "./adminApi";
import { campaignImage as campaignImageUrl } from "@/lib/dashboard/campaignMedia";

function deepValue(input: any, keys: string[]): any {
  if (!input || typeof input !== "object") return undefined;
  for (const key of keys) {
    if (input[key] !== undefined && input[key] !== null && input[key] !== "") return input[key];
  }
  for (const value of Object.values(input)) {
    if (value && typeof value === "object") {
      const found = deepValue(value, keys);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function paymentMethodLabel(value: any) {
  if (!value) return "—";
  if (typeof value === "string") {
    try { const parsed = JSON.parse(value); if (parsed && typeof parsed === "object") return String(parsed.label ?? parsed.name ?? parsed.type ?? value); } catch {}
    return value;
  }
  if (typeof value === "object") return String(value.label ?? value.name ?? value.type ?? "—");
  return String(value);
}

function statusOf(row: any) {
  return String(deepValue(row, ["payment_status", "status", "donation_status"]) ?? "unknown").toLowerCase();
}

function badgeVariant(status: string): "lightSuccess" | "lightError" | "lightWarning" | "lightPrimary" {
  if (["completed", "complete", "paid", "approved", "success", "successful"].includes(status)) return "lightSuccess";
  if (["failed", "declined", "cancelled", "canceled", "trash", "trashed"].includes(status)) return "lightError";
  if (["pending", "processing", "review"].includes(status)) return "lightWarning";
  return "lightPrimary";
}

function activityText(activity: any) {
  return String(
    deepValue(activity, ["description", "message", "activity", "content", "title", "action", "event"]) ??
      "Donation activity",
  );
}

function activityDate(activity: any) {
  return deepValue(activity, ["created_at", "date_created", "created", "date", "timestamp"]);
}

type Props = { donationId: number };

export default function AdminDonationDetail({ donationId }: Props) {
  const router = useRouter();
  const [donation, setDonation] = useState<any>({});
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!donationId) return;
    setLoading(true);
    setError("");
    try {
      const [detailResponse, activityResponse] = await Promise.all([
        adminApi(`donations/${donationId}`),
        adminApi(`donation/activities?page=1&per_page=100&donation_id=${donationId}`).catch(() => null),
      ]);
      const detail = dataFrom(detailResponse);
      setDonation(detail?.donation ?? detail);
      setActivities(activityResponse ? rowsFrom(activityResponse) : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load donation details.");
      setDonation({});
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [donationId]);

  useEffect(() => void load(), [load]);

  const status = statusOf(donation);
  const amount = deepValue(donation, ["amount", "donation_amount", "total"]);
  const currency = String(deepValue(donation, ["currency_symbol", "currency", "currency_code"]) ?? "$");
  const campaignTitle = String(deepValue(donation, ["campaign_title", "campaign_name", "title"]) ?? (deepValue(donation, ["campaign_id"]) ? `Campaign #${deepValue(donation, ["campaign_id"])}` : "Campaign"));
  const campaignImage = campaignImageUrl(donation);
  const campaignGoal = Number(deepValue(donation, ["goal_amount", "campaign_goal", "goal"]) ?? 0);
  const campaignRaised = Number(deepValue(donation, ["raised_amount", "campaign_raised", "raised"]) ?? amount ?? 0);
  const donorName = String(deepValue(donation, ["donor_name", "display_name", "full_name", "name"]) ?? "Anonymous");
  const donorEmail = String(deepValue(donation, ["email", "donor_email", "user_email"]) ?? "—");
  const billingAddress = deepValue(donation, ["billing_address", "address"]);
  const paymentMethod = paymentMethodLabel(deepValue(donation, ["payment_method", "payment_engine", "gateway"]));
  const originalCurrency = String(deepValue(donation, ["original_payment_currency", "original_currency", "order_currency", "payment_currency", "currency"]) ?? "—").toUpperCase();
  const gatewayFeeRaw = Number(deepValue(donation, ["gateway_fee", "payment_gateway_fee", "processing_fee"]) ?? 0);
  const gatewayFee = Number.isFinite(gatewayFeeRaw) ? gatewayFeeRaw / 100 : 0;
  const netAmount = Number(deepValue(donation, ["net_amount", "amount_after_fees", "net"]) ?? amount ?? 0);
  const createdAt = deepValue(donation, ["created_at", "date_created", "created_date", "date"]);
  const notes = deepValue(donation, ["notes", "note"]);

  const timeline = useMemo(() => {
    if (activities.length) return activities;
    if (!donationId) return [];
    return [{ id: `created-${donationId}`, description: "created this donation", date: createdAt }];
  }, [activities, donationId, createdAt]);

  async function deleteDonation() {
    if (!confirm("Move this donation to trash?")) return;
    setDeleting(true);
    setError("");
    try {
      await adminApi(`donation/${donationId}/delete`, {
        method: "POST",
        body: JSON.stringify({ is_permanent: false }),
      });
      router.push("/dashboard/donations");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete donation.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <CardBox><div className="py-16 text-center text-darklink">Loading donation…</div></CardBox>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/donations")} aria-label="Back to donations"><Icon icon="solar:arrow-left-linear" /></Button>
          <div><h2 className="text-xl font-semibold">Donation #{donationId}</h2><p className="text-sm text-darklink">Placed on {fmtDate(createdAt)}</p></div>
        </div>
        <Button variant="outline" className="text-error" disabled={deleting} onClick={deleteDonation}><Icon icon="solar:trash-bin-trash-line-duotone" /> {deleting ? "Deleting…" : "Delete Donation"}</Button>
      </div>

      {error && <div className="rounded-md bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <CardBox>
            <div className="flex gap-4">
              {campaignImage ? <img src={String(campaignImage)} alt="" className="h-28 w-28 shrink-0 rounded-md object-cover" /> : <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-md bg-lightgray"><Icon icon="solar:gallery-wide-line-duotone" className="text-3xl text-darklink" /></div>}
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold">{campaignTitle}</h3>
                <p className="mt-1 text-sm text-darklink">Donation linked to this campaign</p>
                {campaignGoal > 0 && <><div className="mt-4 h-2 overflow-hidden rounded-full bg-lightgray"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (campaignRaised / campaignGoal) * 100)}%` }} /></div><p className="mt-2 font-medium">{money(campaignRaised, currency)} of {money(campaignGoal, currency)}</p></>}
              </div>
            </div>
          </CardBox>

          <CardBox>
            <div className="mb-5 flex items-center justify-between"><h3 className="text-lg font-semibold">Donation</h3><Badge variant={badgeVariant(status)}>{status}</Badge></div>
            <div className="rounded-md border border-ld">
              <div className="flex items-center justify-between border-b border-ld px-4 py-3"><span>Donation</span><strong>{money(amount ?? 0, currency)}</strong></div>
              {gatewayFee > 0 && <div className="flex items-center justify-between border-b border-ld px-4 py-3"><span>Gateway Fee</span><span>{money(gatewayFee, currency)}</span></div>}
              <div className="flex items-center justify-between px-4 py-3"><strong>Total</strong><strong>{money(netAmount, currency)}</strong></div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-darklink sm:grid-cols-2"><p>Payment method <span className="font-medium text-dark dark:text-white">{paymentMethod}</span></p><p>Original payment currency <span className="font-medium text-dark dark:text-white">{originalCurrency}</span></p></div>
          </CardBox>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Timeline</h3>
            <CardBox>
              <div className="relative ml-4 border-l border-ld pl-8">
                {timeline.map((activity, index) => (
                  <div key={String(activity?.id ?? activity?.activity_id ?? index)} className="relative pb-8 last:pb-1">
                    <span className="absolute -left-[43px] top-1 flex h-8 w-8 items-center justify-center rounded-md bg-white dark:bg-dark"><span className="h-3 w-3 rounded-full bg-darklink" /></span>
                    <p className="font-medium">{activityText(activity)}</p>
                    {activityDate(activity) && <p className="mt-1 text-xs text-darklink">{fmtDate(activityDate(activity))}</p>}
                  </div>
                ))}
              </div>
            </CardBox>
          </div>
        </div>

        <div className="space-y-5">
          <CardBox>
            <h3 className="mb-5 text-lg font-semibold">Donor</h3>
            <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-lightgray text-base font-medium">{donorName.split(/\s+/).filter(Boolean).slice(0,2).map((x) => x[0]?.toUpperCase()).join("") || "AN"}</div><div><p className="font-medium">{donorName}</p><p className="text-xs text-darklink">Donation #{donationId}</p></div></div>
            <div className="mt-5 space-y-4 text-sm"><div className="flex gap-3"><Icon icon="solar:letter-line-duotone" className="mt-0.5 text-xl text-darklink" /><span className="break-all">{donorEmail}</span></div>{billingAddress && <div className="flex gap-3"><Icon icon="solar:map-point-line-duotone" className="mt-0.5 text-xl text-darklink" /><span>{typeof billingAddress === "string" ? billingAddress : Object.values(billingAddress).filter(Boolean).join(", ")}</span></div>}</div>
          </CardBox>
          {notes && <CardBox><h3 className="mb-3 text-lg font-semibold">Notes</h3><p className="whitespace-pre-wrap text-sm text-darklink">{String(notes)}</p></CardBox>}
        </div>
      </div>
    </div>
  );
}
