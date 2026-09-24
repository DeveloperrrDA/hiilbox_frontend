"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CardBox from "@/app/components/shared/CardBox";
import ColumnVisibilityControl from "@/app/components/growfund/shared/ColumnVisibilityControl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ListPagination from "@/app/components/growfund/shared/ListPagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { adminApi, adminToken, dataFrom, fmtDate, idOf, money, rowsFrom } from "./adminApi";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import { isDateInRange, type DateRangeKey } from "@/lib/dashboard/dateRanges";
import { campaignImage } from "@/lib/dashboard/campaignMedia";

const variants: Record<string, any> = {
  published: "lightSuccess",
  approved: "lightSuccess",
  pending: "lightWarning",
  draft: "lightPrimary",
  declined: "lightError",
  denied: "lightError",
  rejected: "lightError",
  trashed: "lightError",
  trash: "lightError",
  funded: "lightSuccess",
  completed: "lightSuccess",
  cancelled: "lightError",
};

function campaignStatus(row: any) {
  return String(
    row?.status ??
    row?.campaign_status ??
    row?.post_status ??
    "unknown"
  )
    .trim()
    .toLowerCase();
}

function statusMatches(row: any, wanted: string) {
  const actual = campaignStatus(row);

  if (wanted === "trash") {
    return ["trash", "trashed"].includes(actual);
  }

  if (wanted === "declined") {
    return ["declined", "denied", "rejected"].includes(actual);
  }

  if (wanted === "launched") {
    return ["launched", "published", "active"].includes(actual);
  }

  return actual === wanted;
}

function featured(row: any) {
  const value = row?.is_featured ?? row?.featured;

  if (typeof value === "string") {
    return ["1", "true", "yes", "featured"].includes(
      value.trim().toLowerCase()
    );
  }

  return value === true || value === 1;
}
function statusOf(row: any) {
  return String(row?.status ?? row?.campaign_status ?? row?.post_status ?? "").trim().toLowerCase();
}
function creator(row: any) {
  return row?.author?.display_name || row?.fundraiser?.display_name || row?.creator?.display_name || row?.author?.name || row?.fundraiser?.name || row?.creator?.name || row?.author_name || row?.fundraiser_name || row?.creator_name || "—";
}
function deepValue(input: any, keys: string[]): any {
  if (!input || typeof input !== "object") return undefined;
  for (const key of keys) if (input[key] !== undefined && input[key] !== null && input[key] !== "") return input[key];
  for (const value of Object.values(input)) if (value && typeof value === "object") { const found = deepValue(value, keys); if (found !== undefined) return found; }
  return undefined;
}
function numericValue(value: any): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

// The single-campaign endpoint is the same source used by the public campaign page.
// Prefer its campaign-specific totals before any overview wrapper. A recursive overview
// search can accidentally pick an aggregate total that belongs to another scope.
function raised(row: any) {
  const directCandidates = [
    row?.fund_raised,
    row?.raised_amount,
    row?.amount_raised,
    row?.total_raised,
    row?.raised,
  ];
  for (const value of directCandidates) {
    const n = numericValue(value);
    if (n !== null) return n;
  }

  const overview = row?.__overview;
  const overviewCandidates = [
    overview?.fund_raised,
    overview?.raised_amount,
    overview?.amount_raised,
    overview?.total_raised,
    overview?.raised,
    overview?.campaign?.fund_raised,
    overview?.campaign?.raised_amount,
    overview?.data?.fund_raised,
    overview?.data?.raised_amount,
  ];
  for (const value of overviewCandidates) {
    const n = numericValue(value);
    if (n !== null) return n;
  }
  return 0;
}
function goal(row: any) {
  for (const value of [row?.goal_amount, row?.goal, row?.target_amount, row?.campaign?.goal_amount]) {
    const n = numericValue(value);
    if (n !== null) return n;
  }
  return 0;
}
function donationCount(row: any) {
  const direct = [
    row?.number_of_contributions,
    row?.number_of_individual_contributions,
    row?.number_of_contributors,
    row?.donations_count,
    row?.donation_count,
    row?.total_donations,
    row?.number_of_donations,
  ];
  for (const value of direct) {
    const n = numericValue(value);
    if (n !== null) return n;
  }
  if (Array.isArray(row?.donations)) return row.donations.length;
  const overview = row?.__overview;
  for (const value of [overview?.number_of_contributions, overview?.donations_count, overview?.donation_count, overview?.total_donations]) {
    const n = numericValue(value);
    if (n !== null) return n;
  }
  return 0;
}
function createdDate(row: any) { return deepValue(row, ["date_created", "created_at", "created_date", "post_date", "date", "created"]); }

export default function AdminCampaignManager() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeKey>("this_year");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [updateCampaign, setUpdateCampaign] = useState<any | null>(null);
  const [updateForm, setUpdateForm] = useState({ title: "", description: "" });
  const [updateImages, setUpdateImages] = useState<any[]>([]);
  const [uploadingUpdateImage, setUploadingUpdateImage] = useState(false);
  const [postingUpdate, setPostingUpdate] = useState(false);
  const [updatesCampaign, setUpdatesCampaign] = useState<any | null>(null);
  const [campaignUpdates, setCampaignUpdates] = useState<any[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<any | null>(null);
  const [updateComments, setUpdateComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);
  const [paidCounts, setPaidCounts] = useState<Record<number, number>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const makeQs = (campaignStatus: string) => {
        const qs = new URLSearchParams({ page: "1", per_page: "100", status: campaignStatus });
        if (search.trim()) qs.set("search", search.trim());
        return qs;
      };

      // GrowFund's campaigns collection can default to launched campaigns even when
      // `status=all` is supplied on some backend builds. Admin must also see campaigns
      // awaiting review, so explicitly fetch pending campaigns and merge them into the
      // collection. This stays at two collection requests and never restores the old
      // per-campaign detail/overview request fan-out.
      if (status === "all") {
        const initial=rowsFrom(await adminApi(`campaigns?${makeQs("all")}`));
        setRows(initial);
        setLoading(false);
        void (async()=>{const merged:any[]=[...initial];for(const st of ["pending","rejected","draft"]){try{merged.push(...rowsFrom(await adminApi(`campaigns?${makeQs(st)}`)));}catch{}}const byId=new Map<string,any>();merged.forEach((row,index)=>{const key=String(row?.id??row?.ID??row?.campaign_id??`row-${index}`);if(!byId.has(key))byId.set(key,row);});setRows(Array.from(byId.values()));})();
      } else {
        // Fetch the all collection first and filter locally when it contains the requested state.
        // This prevents slow status endpoints from leaving the admin page stuck loading.
        const allRows = rowsFrom(
  await adminApi(`campaigns?${makeQs("all")}`)
);

const local = allRows.filter((r: any) =>
  statusMatches(r, status)
);

if (local.length) {
  setRows(local);
} else {
  // Some backend versions ignore the "trash" filter
  // and return every campaign.
  // Always filter the returned rows before displaying them.
  const statusRows = rowsFrom(
    await adminApi(`campaigns?${makeQs(status)}`)
  );

  setRows(
    statusRows.filter((r: any) =>
      statusMatches(r, status)
    )
  );
}}
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load campaigns.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => void load(), [load]);

  async function post(id: number, path: string, payload: any, msg: string) {
    setBusy(id);
    setError("");
    setNotice("");
    try {
      const data = await adminApi(path, { method: "POST", body: JSON.stringify(payload) });
setNotice(data?.message || msg);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusy(null);
    }
  }

  async function duplicate(r: any) {
  const id = idOf(r);

  setBusy(id);
  setError("");

  try {
    // Fetch the original campaign.
    const full = dataFrom(
      await adminApi(`campaigns/${id}`)
    );

    const source = full?.campaign ?? full;

    // Only copy campaign fields that should belong
    // to the new campaign.
    //
    // Do NOT copy:
    // id
    // created_at
    // updated_at
    // date_created
    // timestamps
    const payload: Record<string, any> = {};

    const copyFields = [
      "description",
      "story",
      "images",
      "video",
      "category",
      "sub_category",
      "start_date",
      "end_date",
      "location",
      "tags",
      "fundraiser_id",
      "collaborators",
      "show_collaborator_list",
      "risk",
      "has_goal",
      "goal_type",
      "reaching_action",
      "confirmation_title",
      "confirmation_description",
      "provide_confirmation_pdf_receipt",
      "goal_amount",
      "allow_custom_donation",
      "min_donation_amount",
      "max_donation_amount",
      "suggested_option_type",
      "suggested_options",
      "faqs",
      "author_id",
    ];

    for (const field of copyFields) {
      if (source?.[field] !== undefined) {
        payload[field] = source[field];
      }
    }

    payload.title =
      `Copy of ${
        source?.title ||
        r?.title ||
        `Campaign ${id}`
      }`;

    // A copied campaign starts as a new draft.
    payload.status = "draft";

    // Create an entirely new campaign.
    // The backend will generate the new creation timestamp.
    const result = await adminApi(
      "campaigns/create",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    setNotice(
      result?.message ||
      "Campaign copied successfully."
    );

    await load();
  } catch (e) {
    setError(
      e instanceof Error
        ? e.message
        : "Unable to copy campaign."
    );
  } finally {
    setBusy(null);
  }
}

  async function approve(r: any) {
    const id = idOf(r);
    if (confirm("Approve and publish this campaign?")) await post(id, `campaign/${id}/update-status`, { status: "published" }, "Campaign approved.");
  }

  async function decline(r: any) {
    const id = idOf(r);
    const reason = prompt("Reason for declining this campaign:", "");
    if (reason === null) return;
    await post(id, `campaign/${id}/update-status`, { status: "declined", decline_reason: reason }, "Campaign declined.");
  }

  async function trash(r: any) {
    const id = idOf(r);
    if (confirm("Move this campaign to trash?")) await post(id, `campaign/${id}/delete`, {}, "Campaign moved to trash.");
  }

  async function restore(r: any) {
    const id = idOf(r);
    await post(id, `campaign/${id}/restore`, {}, "Campaign restored.");
  }

  async function feature(r: any, value: boolean) {
    const id = idOf(r);
    await post(id, "campaign/update-featured-status", { ids: [id], is_featured: value }, value ? "Campaign featured." : "Campaign unfeatured.");
  }


  function openPostUpdate(r: any) {
    setUpdateCampaign(r);
    setUpdateForm({ title: "", description: "" });
    setUpdateImages([]);
    setError("");
  }

  async function uploadUpdateImages(files: FileList | null) {
    if (!files?.length) return;
    const token = adminToken();
    if (!token) { setError("Please sign in to upload media."); return; }
    setUploadingUpdateImage(true);
    setError("");
    try {
      const form = new FormData();
      Array.from(files).forEach((file) => form.append("images[]", file));
      const response = await fetch("/api/campaigns/media", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Image upload failed.");
      const uploaded = Array.isArray(data?.images) ? data.images : Array.isArray(data?.data?.images) ? data.data.images : [];
      setUpdateImages((current) => [...current, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed.");
    } finally {
      setUploadingUpdateImage(false);
    }
  }

  async function submitPostUpdate() {
    if (!updateCampaign) return;
    const title = updateForm.title.trim();
    const description = updateForm.description.trim();
    if (!title || !description) { setError("Title and description are required for a campaign update."); return; }
    setPostingUpdate(true);
    setError("");
    setNotice("");
    try {
      const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const result = await adminApi("campaign/update/create", {
        method: "POST",
        body: JSON.stringify({
          campaign_id: idOf(updateCampaign),
          title,
          slug,
          description,
          image: updateImages,
        }),
      });
      setNotice(result?.message || "Campaign update posted successfully.");
      setUpdateCampaign(null);
      setUpdateImages([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to post campaign update.");
    } finally {
      setPostingUpdate(false);
    }
  }

  function campaignUpdateId(row: any) {
    return Number(row?.id ?? row?.ID ?? row?.campaign_update_id ?? row?.post_id ?? 0);
  }

  async function openUpdates(r: any) {
    const campaignId = idOf(r);
    setUpdatesCampaign(r);
    setCampaignUpdates([]);
    setSelectedUpdate(null);
    setUpdateComments([]);
    setUpdatesLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ page: "1", per_page: "50", campaign_id: String(campaignId) });
      setCampaignUpdates(rowsFrom(await adminApi(`campaign/updates/paginated?${qs}`)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load campaign updates.");
    } finally {
      setUpdatesLoading(false);
    }
  }

  async function openUpdateDetail(update: any) {
    const id = campaignUpdateId(update);
    if (!id) return;
    setSelectedUpdate(update);
    setUpdateComments([]);
    setCommentsLoading(true);
    setCommentText("");
    try {
      const [detailResult, commentsResult] = await Promise.allSettled([
        adminApi(`campaign/update/${id}/detail`),
        adminApi(`campaign/update/comments/paginated?page=1&post_id=${id}`),
      ]);
      if (detailResult.status === "fulfilled") {
        const detail = dataFrom(detailResult.value);
        setSelectedUpdate(detail?.update ?? detail?.campaign_update ?? detail?.post ?? detail);
      }
      if (commentsResult.status === "fulfilled") setUpdateComments(rowsFrom(commentsResult.value));
    } finally {
      setCommentsLoading(false);
    }
  }

  async function addUpdateComment() {
    const postId = campaignUpdateId(selectedUpdate);
    const content = commentText.trim();
    if (!postId || !content) return;
    setCommentBusy(true);
    setError("");
    try {
      await adminApi("campaign/update/comment/create", { method: "POST", body: JSON.stringify({ post_id: postId, content }) });
      setCommentText("");
      setUpdateComments(rowsFrom(await adminApi(`campaign/update/comments/paginated?page=1&post_id=${postId}`)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to add comment.");
    } finally {
      setCommentBusy(false);
    }
  }

  async function emptyTrash() {
    if (!confirm("Permanently delete all trashed campaigns? This cannot be undone.")) return;
    try {
      const d = await adminApi("campaigns/empty-trash", { method: "POST", body: "{}" });
      setNotice(d?.message || "Campaign trash emptied.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to empty trash.");
    }
  }

  async function bulk(action: string) {
    if (!selected.length) return;
    try {
      const d = await adminApi("campaigns/bulk-action", { method: "POST", body: JSON.stringify({ ids: selected, action }) });
      setNotice(d?.message || "Campaigns updated.");
      setSelected([]);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk action failed.");
    }
  }

  const visibleRows = useMemo(() => rows.filter((r) => { const raw=createdDate(r); const d=raw?new Date(raw):null; if(startDate&&(!d||d<new Date(`${startDate}T00:00:00`)))return false; if(endDate&&(!d||d>new Date(`${endDate}T23:59:59`)))return false; return isDateInRange(raw,dateRange); }), [rows, dateRange, startDate, endDate]);
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / 10));
  const pageRows = visibleRows.slice((page - 1) * 10, page * 10);
  useEffect(() => {
    if (!pageRows.length) return;
    let cancelled = false;
    void Promise.all(pageRows.map(async (r:any) => {
      const cid=idOf(r); if(!cid) return [cid,0] as const;
      try { const result=await adminApi(`donations/paginated?page=1&per_page=100&campaign_id=${cid}&orderby=id&order=desc`); const donationRows=rowsFrom(result); const count=donationRows.filter((d:any)=>{const payment=String(d?.payment_status??"").toLowerCase();const status=String(d?.status??"").toLowerCase();return payment?payment==="paid":["paid","completed","complete","successful","success"].includes(status)}).length; return [cid,count] as const; } catch { return [cid,0] as const; }
    })).then(entries=>{if(!cancelled)setPaidCounts(current=>({...current,...Object.fromEntries(entries)}));});
    return()=>{cancelled=true;};
  }, [page, visibleRows]);

  useEffect(() => setPage(1), [status, search, dateRange, startDate, endDate]);

  const allSelected = useMemo(() => visibleRows.length > 0 && visibleRows.every((r) => selected.includes(idOf(r))), [visibleRows, selected]);
  const toggleAll = () => setSelected(allSelected ? [] : visibleRows.map(idOf).filter(Boolean));
  const toggle = (id: number) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  return (
    <CardBox>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div><h5 className="card-title">Campaigns</h5><p className="mt-1 text-sm text-darklink">Review and manage campaigns.</p></div>
        <div className="flex flex-wrap gap-2">
          {selected.length > 0 && <><Button variant="outline" onClick={() => bulk("publish")}>Approve selected</Button><Button variant="outline" onClick={() => bulk("restore")}><Icon icon="solar:restart-line-duotone" /> Restore selected</Button><Button variant="outline" onClick={() => bulk("trash")}>Trash selected</Button></>}
          <Button variant="outline" onClick={emptyTrash}><Icon icon="solar:trash-bin-trash-line-duotone" /> Empty trash</Button>
          <Button asChild><Link href="/create-campaign"><Icon icon="solar:add-circle-line-duotone" /> New Campaign</Link></Button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-ld bg-transparent px-3 py-2.5">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="launched">Launched</option>
          <option value="published">Published</option>
          <option value="active">Active</option>
          <option value="funded">Funded</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
          <option value="declined">Declined</option>
          <option value="cancelled">Cancelled</option>
          <option value="trash">Trash</option>
        </select>
        <div className="flex-1" />
        <div className="relative sm:w-72"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full rounded-md border border-ld bg-transparent px-3 py-2.5" />{search.trim()&&rows.length>0&&<div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-auto rounded-md border border-ld bg-white p-1 shadow-lg dark:bg-darkgray">{rows.slice(0,8).map((r:any)=>{const image=campaignImage(r),rid=idOf(r);return <Link key={rid} href={`/dashboard/campaigns/${rid}/overview`} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-lightgray">{image?<img src={String(image)} alt="" className="h-9 w-9 rounded-md object-cover"/>:<span className="h-9 w-9 rounded-md bg-lightgray"/>}<span className="min-w-0"><span className="block truncate font-medium">{r?.title||`Campaign #${rid}`}</span><span className="text-xs text-darklink">Campaign #{rid}</span></span></Link>})}</div>}</div>
<DatePresetSelect
  value={dateRange}
  onChange={setDateRange}
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={setStartDate}
  onEndDateChange={setEndDate}
/>      </div>

      {notice && <div className="mt-4 rounded-md bg-lightsuccess px-4 py-3 text-sm text-success">{notice}</div>}
      {error && <div className="mt-4 rounded-md bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}

      <div className="mt-4 flex justify-end"><ColumnVisibilityControl tableClass="admin-campaigns-table" columns={["Select", "ID", "Campaign", "Creator", "Status", "Raised / Goal", "Donations", "Created", "State", "Actions"]}/></div><div className="mt-4 overflow-x-auto">
        <Table className="admin-campaigns-table">
          <TableHeader><TableRow>
            <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
            <TableHead>ID</TableHead><TableHead>Featured</TableHead><TableHead>Campaign Name</TableHead><TableHead>Creator</TableHead><TableHead>Goal</TableHead><TableHead>Donations</TableHead><TableHead>Date Created</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={10} className="py-10 text-center">Loading campaigns…</TableCell></TableRow> : visibleRows.length === 0 ? <TableRow><TableCell colSpan={10} className="py-10 text-center text-darklink">No campaigns found.</TableCell></TableRow> : pageRows.map((r) => {
   const id = idOf(r),
         st = campaignStatus(r),
            isFeatured = featured(r),
                     isBusy = busy === id;            
                       const g = goal(r), a = raised(r), pct = g > 0 ? Math.min(100, Math.round((a / g) * 100)) : 0;
              return <TableRow key={id}>
                <TableCell><Checkbox checked={selected.includes(id)} onCheckedChange={() => toggle(id)} /></TableCell>
                <TableCell>#{id}</TableCell>
                <TableCell><button disabled={isBusy} onClick={() => feature(r, !isFeatured)} className="text-xl" title={isFeatured ? "Unfeature" : "Feature"}><Icon icon={isFeatured ? "solar:star-bold" : "solar:star-line-duotone"} /></button></TableCell>
                <TableCell><Link className="flex items-center gap-3 font-medium hover:text-primary" href={`/dashboard/campaigns/${id}/edit`}>{campaignImage(r) ? <img src={campaignImage(r)} alt="" className="h-11 w-11 rounded-md object-cover"/> : <span className="h-11 w-11 rounded-md bg-lightgray"/>}<span>{r.title || r.campaign_name || `Campaign #${id}`}</span></Link></TableCell>
                <TableCell>{creator(r)}</TableCell>
                <TableCell>{g > 0 ? <div className="min-w-48"><div className="text-xs">{pct}% funded</div><div className="my-1 h-1.5 rounded-full bg-lightgray"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div><div className="text-xs text-darklink">{money(a, r.currency || "$ ")} of {money(g, r.currency || "$ ")}</div></div> : <span className="text-darklink">-No Goal Set-</span>}</TableCell>
                <TableCell>{paidCounts[id] ?? "…"}</TableCell>
                <TableCell>{fmtDate(createdDate(r))}</TableCell>
                <TableCell>{["pending", "review", "submitted"].includes(st) ? <div className="flex gap-2"><Button size="sm" variant="outline" className="text-success" disabled={isBusy} onClick={() => approve(r)} title="Approve"><Icon icon="solar:check-circle-bold" /></Button><Button size="sm" variant="outline" className="text-error" disabled={isBusy} onClick={() => decline(r)} title="Decline"><Icon icon="solar:close-circle-bold" /></Button></div> : <Badge variant={variants[st] || "lightPrimary"}>{st}</Badge>}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" disabled={isBusy}><Icon icon="solar:menu-dots-bold" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => openPostUpdate(r)}><Icon icon="solar:document-add-line-duotone" /> Post an update</DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href={`/dashboard/campaigns/${id}/overview`}><Icon icon="solar:chart-2-line-duotone" /> Overview</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href={`/campaign/${id}`}><Icon icon="solar:eye-line-duotone" /> Preview</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => void duplicate(r)}> 
                      <Icon icon="solar:copy-line-duotone" /> Make a copy</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {st === "trashed" || st === "trash" ? <DropdownMenuItem onClick={() => restore(r)}><Icon icon="solar:restart-line-duotone" /> Restore</DropdownMenuItem> : <DropdownMenuItem className="text-error focus:text-error" onClick={() => trash(r)}><Icon icon="solar:trash-bin-trash-line-duotone" /> Move to trash</DropdownMenuItem>}
                  </DropdownMenuContent></DropdownMenu>
                </TableCell>
              </TableRow>;
            })}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between"><p className="text-sm text-darklink">Page {page} of {totalPages} · 10 items per page</p><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</Button><Button size="sm" variant="outline" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Next</Button></div></div>

      <Dialog open={Boolean(updateCampaign)} onOpenChange={(v) => !v && setUpdateCampaign(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Post an update</DialogTitle></DialogHeader>
          {updateCampaign && <div className="rounded-md border border-ld p-4"><div className="font-medium">{updateCampaign.title || `Campaign #${idOf(updateCampaign)}`}</div><div className="text-sm text-darklink">by {creator(updateCampaign)}</div></div>}
          <label className="text-sm">Title<input value={updateForm.title} onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })} placeholder="e.g. We already reached 50% of the revenue!" className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2.5" /></label>
          <div>
            <div className="mb-1 text-sm">Image</div>
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-ld bg-lightgray/30 px-4 text-center">
              <Icon icon="solar:gallery-add-line-duotone" className="text-3xl" />
              <span className="text-sm text-darklink">{uploadingUpdateImage ? "Uploading…" : "Click to upload an update image"}</span>
              <input type="file" accept="image/*" multiple className="hidden" disabled={uploadingUpdateImage} onChange={(e) => uploadUpdateImages(e.target.files)} />
            </label>
            {updateImages.length > 0 && <div className="mt-2 text-xs text-darklink">{updateImages.length} image{updateImages.length === 1 ? "" : "s"} uploaded.</div>}
          </div>
          <label className="text-sm">Description<textarea value={updateForm.description} onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })} rows={5} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2.5" /></label>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setUpdateCampaign(null)} disabled={postingUpdate}>Cancel</Button><Button onClick={submitPostUpdate} disabled={postingUpdate || uploadingUpdateImage}>{postingUpdate ? "Posting…" : "Post"}</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(updatesCampaign)} onOpenChange={(v) => { if (!v) { setUpdatesCampaign(null); setSelectedUpdate(null); } }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Campaign updates</DialogTitle></DialogHeader>
          {updatesCampaign && <div className="flex items-center justify-between rounded-md border border-ld p-4"><div><div className="font-medium">{updatesCampaign.title || `Campaign #${idOf(updatesCampaign)}`}</div><div className="text-sm text-darklink">Published updates for this campaign</div></div><Button size="sm" onClick={() => { const r = updatesCampaign; setUpdatesCampaign(null); openPostUpdate(r); }}><Icon icon="solar:add-circle-line-duotone" /> New update</Button></div>}
          <div className="max-h-[60vh] overflow-y-auto">
            {updatesLoading ? <div className="py-10 text-center text-darklink">Loading updates…</div> : campaignUpdates.length === 0 ? <div className="py-10 text-center text-darklink">No updates have been posted for this campaign.</div> : !selectedUpdate ? <div className="divide-y divide-border">{campaignUpdates.map((u) => { const uid = campaignUpdateId(u); return <button key={uid || JSON.stringify(u)} type="button" onClick={() => openUpdateDetail(u)} className="w-full px-2 py-4 text-left hover:bg-lightgray/30"><div className="flex items-start justify-between gap-4"><div><div className="font-medium">{u?.title || u?.post_title || `Update #${uid}`}</div><div className="mt-1 line-clamp-2 text-sm text-darklink">{u?.description || u?.content || u?.post_content || ""}</div></div><div className="whitespace-nowrap text-xs text-darklink">{fmtDate(u?.date_created || u?.created_at || u?.date || u?.post_date)}</div></div></button>; })}</div> : <div className="space-y-4 p-1">
              <Button variant="outline" size="sm" onClick={() => { setSelectedUpdate(null); setUpdateComments([]); }}><Icon icon="solar:arrow-left-line-duotone" /> Back to updates</Button>
              <div><h6 className="text-lg font-semibold">{selectedUpdate?.title || selectedUpdate?.post_title || "Campaign update"}</h6><div className="mt-1 text-xs text-darklink">{fmtDate(selectedUpdate?.date_created || selectedUpdate?.created_at || selectedUpdate?.date || selectedUpdate?.post_date)}</div><div className="mt-3 whitespace-pre-wrap text-sm">{selectedUpdate?.description || selectedUpdate?.content || selectedUpdate?.post_content || ""}</div></div>
              <div className="border-t border-border pt-4"><div className="mb-3 font-medium">Comments</div>{commentsLoading ? <div className="text-sm text-darklink">Loading comments…</div> : updateComments.length === 0 ? <div className="text-sm text-darklink">No comments yet.</div> : <div className="space-y-3">{updateComments.map((c, i) => <div key={c?.id || c?.comment_id || i} className="rounded-md border border-ld p-3"><div className="text-sm">{c?.content || c?.comment_content || c?.message || ""}</div><div className="mt-1 text-xs text-darklink">{c?.author_name || c?.user?.name || c?.name || ""}{(c?.date_created || c?.created_at || c?.date) ? ` • ${fmtDate(c?.date_created || c?.created_at || c?.date)}` : ""}</div></div>)}</div>}
                <div className="mt-4 flex gap-2"><input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment…" className="flex-1 rounded-md border border-ld bg-transparent px-3 py-2.5" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void addUpdateComment(); } }} /><Button onClick={addUpdateComment} disabled={commentBusy || !commentText.trim()}>{commentBusy ? "Posting…" : "Comment"}</Button></div>
              </div>
            </div>}
          </div>
        </DialogContent>
      </Dialog>
    </CardBox>
  );
}
