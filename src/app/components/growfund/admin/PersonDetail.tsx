"use client";
import {useEffect,useMemo,useState} from "react";
import {useParams} from "next/navigation";
import CardBox from "@/app/components/shared/CardBox";
import {adminApi,dataFrom,rowsFrom} from "./adminApi";
import {Button} from "@/components/ui/button";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table";
import {dashboardRole,savedDashboardUser} from "@/lib/dashboard/roles";
function donorId(d:any){return Number(d?.donor?.id??d?.donor?.ID??d?.donor?.user_id??d?.user?.id??d?.user?.ID??d?.donor_id??d?.user_id??0)}
function donorEmail(d:any){return String(d?.donor?.email??d?.donor?.user_email??d?.user?.email??d?.user?.user_email??d?.email??d?.user_email??"").trim().toLowerCase()}
function personEmail(d:any){return String(d?.email??d?.user_email??"").trim().toLowerCase()}
function completed(d:any){const s=String(d?.payment_status??d?.status??d?.donation_status??"").toLowerCase();return !s||["completed","complete","paid","approved","success","successful"].includes(s)}
function donationAmount(d:any){return Number(d?.amount??d?.donation_amount??d?.total??0)}
function donationDate(d:any){const raw=d?.created_at??d?.date_created??d?.date;const date=raw?new Date(raw):null;return date&&!Number.isNaN(date.getTime())?date:null}
export default function PersonDetail({kind}:{kind:"donor"|"fundraiser"}){
const { id } = useParams<{ id: string }>();

const [p, setP] = useState<any>({});
const [don, setDon] = useState<any[]>([]);
const [campaigns, setCampaigns] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [tab, setTab] = useState<
  "overview" | "campaigns" | "donations"
>("overview");

const [page, setPage] = useState(1); 
 useEffect(()=>{(async()=>{setLoading(true);setError("");setCampaigns([]);try{const role=dashboardRole(savedDashboardUser());if(kind==="donor"&&role==="fundraiser"){const token=localStorage.getItem("access_token")||"",headers={Authorization:`Bearer ${token}`};const[dr,rr]=await Promise.all([fetch("/api/dashboard/fundraiser-donors",{headers,cache:"no-store"}),fetch("/api/dashboard/fundraiser-donations",{headers,cache:"no-store"})]);const dj=await dr.json(),rj=await rr.json();if(!dr.ok)throw new Error(dj?.message||"Unable to load donor.");const donors=Array.isArray(dj?.data)?dj.data:[],person=donors.find((x:any)=>Number(x?.id??x?.user_id??x?.donor_id)===Number(id));if(!person)throw new Error("This donor was not found among donors to your campaigns.");setP(person);const all=Array.isArray(rj?.data)?rj.data:[],selectedId=Number(person?.id??person?.user_id??person?.donor_id??id),selectedEmail=personEmail(person);setDon(all.filter((x:any)=>completed(x)&&((selectedId>0&&donorId(x)===selectedId)||(!donorId(x)&&selectedEmail&&donorEmail(x)===selectedEmail))));}else{const x=dataFrom(await adminApi(`${kind}/${id}/overview`));setP(x?.[kind]||x);setLoading(false);try{if(kind==="donor"){setDon(rowsFrom(await adminApi(`donor/${id}/donations?page=1&per_page=100`)))}else{
const campaignRows = rowsFrom(
  await adminApi(
    `campaigns?page=1&per_page=100&status=all`
  )
);

const owned = campaignRows.filter(
  (c: any) =>
    Number(
      c?.author?.id ??
        c?.author_id ??
        c?.fundraiser?.id ??
        c?.fundraiser_id ??
        c?.user_id ??
        c?.created_by ??
        c?.owner_id ??
        0
    ) === Number(id)
);

setCampaigns(owned);

const batches = await Promise.all(
  owned.map((c: any) =>
    adminApi(
      `donations/paginated?page=1&per_page=100&campaign_id=${Number(
        c?.id ?? 0
      )}&orderby=id&order=desc`
    )
      .then(rowsFrom)
      .catch(() => [])
  )
); const seen=new Set<number>();const onlyPaid=batches.flat().filter((d:any)=>{const donationId=Number(d?.id??d?.donation_id??0);if(donationId&&seen.has(donationId))return false;if(donationId)seen.add(donationId);return completed(d)});setDon(onlyPaid)}}catch{setDon([])}}}catch(e){setError(e instanceof Error?e.message:"Unable to load details.");}finally{setLoading(false)}})()},[id,kind]);
 const sorted=useMemo(()=>[...don].sort((a,b)=>(donationDate(b)?.getTime()||0)-(donationDate(a)?.getTime()||0)),[don]);const pages=Math.max(1,Math.ceil(sorted.length/10)),pageRows=sorted.slice((page-1)*10,page*10);
 if(loading)return <CardBox>Loading…</CardBox>;if(error)return <CardBox><div className="rounded-md bg-lighterror px-4 py-3 text-error">{error}</div></CardBox>;
 const name=[p.first_name,p.last_name].filter(Boolean).join(" ")||p.display_name||p.name||`${kind} #${id}`,scopedTotal=don.reduce((s,d)=>s+donationAmount(d),0),total=kind==="fundraiser"?scopedTotal:(don.length?scopedTotal:Number(p.total_given??p.total_contributions??0)),count=kind==="fundraiser"?don.length:(don.length||Number(p.donations_count??p.number_of_contributions??0)),avg=count?total/count:0,camps =
  kind === "fundraiser"
    ? campaigns.length
    : new Set(
        don
          .map(
            (d) =>
              d?.campaign?.id ??
              d?.campaign_id
          )
          .filter(Boolean)
      ).size;
 return <div className="space-y-5"><h2 className="text-xl font-semibold">{name}</h2><div className="flex gap-2 border-b border-ld">
    <button
  className={`px-4 py-3 text-sm font-medium ${
    tab === "overview"
      ? "border-b-2 border-primary text-primary"
      : "text-darklink"
  }`}
  onClick={() => {
    setTab("overview");
    setPage(1);
  }}
>
  Overview
</button>

{kind === "fundraiser" && (
  <button
    className={`px-4 py-3 text-sm font-medium ${
      tab === "campaigns"
        ? "border-b-2 border-primary text-primary"
        : "text-darklink"
    }`}
    onClick={() => {
      setTab("campaigns");
      setPage(1);
    }}
  >
    Campaigns
  </button>
)}

<button
  className={`px-4 py-3 text-sm font-medium ${
    tab === "donations"
      ? "border-b-2 border-primary text-primary"
      : "text-darklink"
  }`}
  onClick={() => {
    setTab("donations");
    setPage(1);
  }}
>
  Donations
</button>
 </div>
 {tab==="overview"&&<><div className="grid grid-cols-2 gap-5 xl:grid-cols-4">{[
  [
    kind === "fundraiser"
      ? "Total Raised"
      : "Total Donated",
    `$${total.toFixed(2)}`,
  ],
  [
    "Average Donation",
    `$${avg.toFixed(2)}`,
  ],
  [
    kind === "fundraiser"
      ? "Total Campaigns"
      : "Donated Campaigns",
    camps,
  ],
  [
    kind === "fundraiser"
      ? "Donations Received"
      : "Total Donations",
    count,
  ],
].map(([a,b])=><CardBox key={String(a)}><p className="text-darklink">{a}</p><h3 className="mt-3 text-2xl font-semibold">{b}</h3></CardBox>)}</div><div className="grid gap-5 lg:grid-cols-[430px_1fr]"><CardBox>
  <div className="flex items-center gap-4">
    {p.avatar_url ||
    p.profile_image ||
    p.image ||
    p.avatar ? (
      <img
        src={
          p.avatar_url ??
          p.profile_image ??
          p.image ??
          p.avatar
        }
        alt={name}
        className="h-16 w-16 rounded-full object-cover"
      />
    ) : (
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lightprimary text-xl font-semibold text-primary">
        {name.charAt(0).toUpperCase()}
      </div>
    )}

    <div className="min-w-0">
      <h3 className="truncate text-lg font-semibold">
        {name}
      </h3>

      <p className="mt-1 text-sm text-darklink">
        {kind === "fundraiser"
          ? "Fundraiser"
          : "Donor"}{" "}
        · ID #{id}
      </p>
    </div>
  </div>

  <div className="mt-6 space-y-5">
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-darklink">
        Email
      </p>

      <p className="mt-1 break-all font-medium">
        {p.email ??
          p.user_email ??
          "—"}
      </p>
    </div>

    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-darklink">
        Verification Status
      </p>

      <div className="mt-2">
        {[
  true,
  1,
  "1",
  "true",
  "verified",
  "yes",
].includes(
  typeof (
    p.is_verified ??
    p.verified ??
    p.email_verified ??
    p.is_email_verified ??
    p.verification_status
  ) === "string"
    ? (
        p.is_verified ??
        p.verified ??
        p.email_verified ??
        p.is_email_verified ??
        p.verification_status
      ).toLowerCase()
    : (
        p.is_verified ??
        p.verified ??
        p.email_verified ??
        p.is_email_verified ??
        p.verification_status
      )
) ?  (
          <span className="inline-flex rounded-full bg-lightsuccess px-3 py-1 text-xs font-medium text-success">
            Verified
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-lightwarning px-3 py-1 text-xs font-medium text-warning">
            Not verified
          </span>
        )}
      </div>
    </div>

    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-darklink">
        Joined Date
      </p>

      <p className="mt-1 font-medium">
        {p.joined_at ||
        p.user_registered ||
        p.date_created ||
        p.created_at
          ? new Date(
              p.joined_at ??
                p.user_registered ??
                p.date_created ??
                p.created_at
            ).toLocaleDateString()
          : "—"}
      </p>
    </div>
  </div>
</CardBox><CardBox><h3 className="text-lg font-semibold">{kind==="donor"?"Donor Activities":"Activity Logs"}</h3><div className="mt-5 divide-y divide-ld">{sorted.length?sorted.slice(0,10).map((d,i)=><div key={d.id||d.donation_id||i} className="py-3"><p className="font-medium">{kind==="donor"?"Donation":"Donation received"} #{d.id||d.donation_id||"—"}</p><p className="mt-1 text-sm text-darklink">{d.campaign?.title||d.campaign_title||`Campaign #${d.campaign?.id||d.campaign_id||"—"}`} · ${donationAmount(d).toFixed(2)} · {donationDate(d)?.toLocaleDateString()||"—"}</p></div>):<p className="py-10 text-center text-darklink">No activities found.</p>}</div></CardBox></div></>}
 {tab === "campaigns" && kind === "fundraiser" && (
  <CardBox>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">
          Campaigns
        </h3>

        <p className="mt-1 text-sm text-darklink">
          {campaigns.length} total campaign
          {campaigns.length === 1 ? "" : "s"}
        </p>
      </div>
    </div>

    <div className="mt-5 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Goal</TableHead>
            <TableHead>Raised</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {campaigns.length ? (
            campaigns.map((campaign: any) => {
              const campaignId =
                campaign?.id ?? "—";

              const title =
                campaign?.title ??
                campaign?.name ??
                `Campaign #${campaignId}`;

              const status =
                campaign?.status ??
                "—";

              const goal = Number(
                campaign?.goal_amount ??
                  campaign?.goal ??
                  0
              );

              const raised = Number(
                campaign?.fund_raised ??
                  campaign?.raised_amount ??
                  0
              );

              const rawDate =
                campaign?.created_at ??
                campaign?.start_date ??
                campaign?.date_created;

              const createdDate = rawDate
                ? new Date(rawDate)
                : null;

              return (
                <TableRow key={campaignId}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {title}
                      </p>

                      <p className="mt-1 text-xs text-darklink">
                        #{campaignId}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="capitalize">
                    {String(status)
                      .replace(/-/g, " ")
                      .replace(/_/g, " ")}
                  </TableCell>

                  <TableCell>
                    ${goal.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    ${raised.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    {createdDate &&
                    !Number.isNaN(
                      createdDate.getTime()
                    )
                      ? createdDate.toLocaleDateString()
                      : "—"}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-10 text-center text-darklink"
              >
                No campaigns found for this
                fundraiser.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </CardBox>
)}
 {tab==="donations"&&<CardBox><h3 className="text-lg font-semibold">Donations</h3><div className="mt-5 overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Donation</TableHead><TableHead>Campaign</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>{pageRows.length?pageRows.map((d,i)=><TableRow key={d.id||d.donation_id||i}><TableCell>#{d.id||d.donation_id}</TableCell><TableCell>{d.campaign?.title||d.campaign_title||`#${d.campaign?.id||d.campaign_id||"—"}`}</TableCell><TableCell>${donationAmount(d).toFixed(2)}</TableCell><TableCell>{donationDate(d)?.toLocaleDateString()||"—"}</TableCell></TableRow>):<TableRow><TableCell colSpan={4} className="py-10 text-center text-darklink">No donations found.</TableCell></TableRow>}</TableBody></Table></div><div className="mt-4 flex items-center justify-between"><p className="text-sm text-darklink">Page {page} of {pages} · 10 items per page</p><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page<=1} onClick={()=>setPage(x=>x-1)}>Previous</Button><Button size="sm" variant="outline" disabled={page>=pages} onClick={()=>setPage(x=>x+1)}>Next</Button></div></div></CardBox>}
 </div>;
}
