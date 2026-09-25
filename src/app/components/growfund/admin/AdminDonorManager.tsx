"use client";

import Link from "next/link";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import ColumnVisibilityControl from "@/app/components/growfund/shared/ColumnVisibilityControl";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { adminApi, dataFrom, fmtDate, idOf, money, nameOf, rowsFrom } from "./adminApi";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import { isDateInRange, type DateRangeKey } from "@/lib/dashboard/dateRanges";
import { useRouter } from "next/navigation";

const blank = { first_name: "", last_name: "", email: "", username: "", password: "", phone: "" };
function donationCount(r: any) { return Number(r?.number_of_contributions ?? r?.donations_count ?? r?.donation_count ?? r?.total_donations ?? r?.donations?.length ?? 0); }
function totalGiven(r: any) { return Number(r?.total_contributions ?? r?.total_given ?? r?.total_donated ?? r?.donation_total ?? r?.total_amount ?? 0); }
function latestDonation(r: any) { return r?.latest_donation ?? r?.last_donation ?? (r?.latest_donation_date ? { date: r.latest_donation_date } : null) ?? r?.latest_donation_amount ?? r?.last_donation_amount; }
function createdDate(r: any) { return r?.joined_at ?? r?.date_created ?? r?.created_at ?? r?.registered_at ?? r?.user_registered; }
function isTrashedStatus(status: string) { return status === "trash" || status === "trashed"; }

export default function AdminDonorManager() {
  const router=useRouter();
  const [rows, setRows] = useState<any[]>([]), [loading, setLoading] = useState(true), [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState(""), [notice, setNotice] = useState(""), [search, setSearch] = useState(""), [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState<DateRangeKey>("this_year");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
const [open, setOpen] = useState(false),
  [editOpen, setEditOpen] = useState(false),
  [editingId, setEditingId] = useState(0),
  [form, setForm] = useState(blank),
  [sendingReset, setSendingReset] = useState(false);
  const load = useCallback(async () => { setLoading(true); setError(""); try { const q = new URLSearchParams({ page: "1", per_page: "100" }); if (search.trim()) q.set("search", search.trim()); if(status!=="all") q.set("status",status); setRows(rowsFrom(await adminApi(`donors/paginated?${q}`))); } catch (e) { setError(e instanceof Error ? e.message : "Unable to load donors."); } finally { setLoading(false); } }, [search,status]);
  useEffect(() => void load(), [load]);

  async function create(e: FormEvent) { e.preventDefault(); setError(""); try { const d = await adminApi("donor/create", { method: "POST", body: JSON.stringify(form) }); setNotice(d?.message || "Donor created successfully."); setOpen(false); setForm(blank); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to create donor."); } }
  async function beginEdit(r: any) { const id = idOf(r); setBusy(id); try { let source = r; try { source = dataFrom(await adminApi(`donor/${id}/overview`)); } catch {} source = source?.donor ?? source; setEditingId(id); setForm({ first_name: source?.first_name ?? r?.first_name ?? "", last_name: source?.last_name ?? r?.last_name ?? "", email: source?.email ?? source?.user_email ?? r?.email ?? r?.user_email ?? "", username: source?.username ?? source?.user_login ?? r?.username ?? r?.user_login ?? "", password: "", phone: source?.phone ?? r?.phone ?? "" }); setEditOpen(true); } finally { setBusy(null); } }
  async function saveEdit(e: FormEvent) { e.preventDefault(); try { const payload: any = { ...form }; if (!payload.password) delete payload.password; const d = await adminApi(`donor/${editingId}/update`, { method: "POST", body: JSON.stringify(payload) }); setNotice(d?.message || "Donor updated successfully."); setEditOpen(false); setForm(blank); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to update donor."); } }
  async function sendPasswordReset() {
  const email = form.email.trim();

  if (!email) {
    setError("This donor does not have an email address.");
    return;
  }

  setSendingReset(true);
  setError("");
  setNotice("");

  try {
    const d = await adminApi("auth/password-reset-mail", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    setNotice(
      d?.message ||
        `Password reset email sent successfully to ${email}.`
    );
  } catch (e) {
    setError(
      e instanceof Error
        ? e.message
        : "Unable to send password reset email."
    );
  } finally {
    setSendingReset(false);
  }
}
  async function remove(r: any, permanent = false) { const id = idOf(r); if (!confirm(permanent ? "Permanently delete this donor?" : "Move this donor to trash?")) return; setBusy(id); try { const d = await adminApi(`donor/${id}/delete`, { method: "DELETE", body: JSON.stringify({ delete_type: permanent ? "permanent" : "trash" }) }); setNotice(d?.message || (permanent ? "Donor permanently deleted." : "Donor moved to trash.")); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Donor action failed."); } finally { setBusy(null); } }
  async function restore(r: any) { const id = idOf(r); setBusy(id); try { const d = await adminApi("donors/bulk-action", { method: "POST", body: JSON.stringify({ ids: [id], action: "restore", is_permanent_delete: false }) }); setNotice(d?.message || "Donor restored."); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to restore donor."); } finally { setBusy(null); } }
  async function emptyTrash() { if (!confirm("Permanently delete all trashed donors?")) return; try { const d = await adminApi("donors/empty-trash", { method: "POST", body: "{}" }); setNotice(d?.message || "Donor trash emptied."); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to empty trash."); } }

  const visibleRows = useMemo(() => rows.filter((r:any)=>{const st=String(r.status||r.user_status||"active").toLowerCase(),raw=createdDate(r),d=raw?new Date(raw):null;if(startDate&&(!d||d<new Date(`${startDate}T00:00:00`)))return false;if(endDate&&(!d||d>new Date(`${endDate}T23:59:59`)))return false;return (status==="all"||st===status)&&isDateInRange(raw,dateRange);}), [rows,status,dateRange,startDate,endDate]);
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / 10));
  const totalDonors = visibleRows.length;
  const pageRows = visibleRows.slice((page - 1) * 10, page * 10);
  useEffect(() => setPage(1), [status,dateRange,search,startDate,endDate]);

  const fields = [["first_name", "First name", true], ["last_name", "Last name", false], ["email", "Email", true], ["username", "Username", true], ["password", "Password", false], ["phone", "Phone", false]] as const;
  const formMarkup = (label: string, submit: (e: FormEvent) => void) => <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">{fields.map(([k, l, req]) => <label key={k} className="text-sm">{l}<input required={req} type={k === "password" ? "password" : k === "email" ? "email" : "text"} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2" /></label>)}<div className="sm:col-span-2 flex justify-end"><Button type="submit">{label}</Button></div></form>;

  return <CardBox className="w-full !max-w-none">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h5 className="card-title">Donors</h5><p className="mt-1 text-sm text-darklink">Donor details, donations, total given, latest donation and account creation date.</p></div><div className="flex gap-2"><Button variant="outline" onClick={emptyTrash}><Icon icon="solar:trash-bin-trash-line-duotone" /> Empty trash</Button><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Icon icon="solar:user-plus-rounded-line-duotone" /> Create New Donor</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Create New Donor</DialogTitle></DialogHeader>{formMarkup("Create donor", create)}</DialogContent></Dialog></div></div>
    <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_200px]"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search donors" className="rounded-md border border-ld bg-transparent px-3 py-2.5" /><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-ld bg-transparent px-3"><option value="all">All statuses</option><option value="active">Active</option><option value="trash">Trash</option></select><DatePresetSelect value={dateRange} onChange={setDateRange}/><input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} aria-label="Start Date" className="rounded-md border border-ld bg-transparent px-3 py-2.5"/><input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} aria-label="End Date" className="rounded-md border border-ld bg-transparent px-3 py-2.5"/></div>
    {notice && <div className="mt-4 rounded-md bg-lightsuccess px-4 py-3 text-sm text-success">{notice}</div>}{error && <div className="mt-4 rounded-md bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}
    <div className="mt-4 flex justify-end"><ColumnVisibilityControl tableClass="admin-donors-table" columns={["Donor Details", "Donations", "Total Given", "Latest Donation", "Date Created", "Actions"]}/></div><div className="mt-4 overflow-x-auto"><Table className="admin-donors-table"><TableHeader><TableRow><TableHead>Donor Details</TableHead><TableHead>Donations</TableHead><TableHead>Total Given</TableHead><TableHead>Latest Donation</TableHead><TableHead>Date Created</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {loading ? <TableRow><TableCell colSpan={6} className="py-10 text-center">Loading donors…</TableCell></TableRow> : visibleRows.length === 0 ? <TableRow><TableCell colSpan={6} className="py-10 text-center text-darklink">No donors found.</TableCell></TableRow> : pageRows.map((r) => { const id = idOf(r), st = String(r.status || r.user_status || "active").toLowerCase(); const latest = latestDonation(r); return <TableRow key={id}>
        <TableCell><div className="flex items-start gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lightprimary text-primary"><Icon icon="solar:user-rounded-line-duotone" height={18}/></span><div><Link href={`/dashboard/donors/${id}`} className="font-medium hover:text-primary">{String(r?.first_name || nameOf(r) || `Donor #${id}`).trim().split(/\s+/)[0]}</Link><div className="text-xs text-darklink">{r.email || r.user_email || "—"}{r.phone ? ` · ${r.phone}` : ""}</div></div></div></TableCell><TableCell>{donationCount(r)}</TableCell><TableCell>{money(totalGiven(r), r.currency || "$ ")}</TableCell><TableCell>{latest && typeof latest === "object" ? `${latest.amount != null ? `${money(latest.amount, latest.currency || r.currency || "$ ")} · ` : ""}${fmtDate(latest.date || latest.created_at)}` : latest != null ? money(latest, r.currency || "$ ") : "—"}</TableCell><TableCell>{fmtDate(createdDate(r))}</TableCell>
        <TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" disabled={busy === id}><Icon icon="solar:menu-dots-bold" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52"><DropdownMenuItem onClick={() => beginEdit(r)}><Icon icon="solar:pen-2-line-duotone" /> Edit / Update</DropdownMenuItem><DropdownMenuItem onClick={()=>router.push(`/dashboard/donors/${id}`)}><Icon icon="solar:eye-line-duotone"/> View donor</DropdownMenuItem><DropdownMenuSeparator />{isTrashedStatus(st) ? <><DropdownMenuItem onClick={() => restore(r)}><Icon icon="solar:restart-line-duotone" /> Restore</DropdownMenuItem><DropdownMenuItem className="text-error" onClick={() => remove(r, true)}>Delete permanently</DropdownMenuItem></> : <DropdownMenuItem className="text-error" onClick={() => remove(r, false)}>Move to trash</DropdownMenuItem>}</DropdownMenuContent></DropdownMenu></TableCell>
      </TableRow>; })}
    </TableBody></Table></div>
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-darklink">
        Page {page} of {totalPages} · 10 items per page | {totalDonors} Donors
      </p>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          disabled={page <= 1} 
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>

        {/* DYNAMIC NUMBERED PAGES WITH ELLIPSIS */}
        {(() => {
          let pages = [];
          if (totalPages <= 5) {
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
          } else {
            if (page <= 3) {
              pages = [1, 2, 3, 4, '...', totalPages];
            } else if (page >= totalPages - 2) {
              pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
              pages = [1, '...', page - 1, page, page + 1, '...', totalPages];
            }
          }

          return pages.map((p, index) => {
            if (p === '...') {
              return (
                <span 
                  key={`ellipsis-${index}`} 
                  className="flex items-center justify-center px-2 text-sm text-gray-500"
                >
                  ...
                </span>
              );
            }
            return (
              <Button
                key={p}
                size="sm"
                variant={page === p ? "default" : "outline"} 
                onClick={() => setPage(p as number)}
              >
                {p}
              </Button>
            );
          });
        })()}

        <Button 
          size="sm" 
          variant="outline" 
          disabled={page >= totalPages} 
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
<Dialog open={editOpen} onOpenChange={setEditOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Donor</DialogTitle>
    </DialogHeader>

    {formMarkup("Save changes", saveEdit)}

    <div className="border-t border-ld pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">
            Password reset
          </p>
          <p className="mt-1 text-xs text-darklink">
            Send a password reset link to {form.email || "this donor"}.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={sendPasswordReset}
          disabled={sendingReset || !form.email.trim()}
        >
          <Icon icon="solar:letter-line-duotone" />
          {sendingReset
            ? "Sending..."
            : "Send reset password email"}
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
  </CardBox>;
}
