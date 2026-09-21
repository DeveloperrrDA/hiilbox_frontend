"use client";
import { useEffect, useMemo, useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog,DialogContent,DialogHeader,DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { currentUserId, dashboardApi } from "@/lib/dashboard/api";
import FundraiserWithdrawals from "@/app/components/growfund/fundraiser/FundraiserWithdrawals";

function deepValue(input:any, keys:string[]):any{
  if(!input||typeof input!=="object")return undefined;
  for(const key of keys){const value=input[key];if(value!==undefined&&value!==null&&value!=="")return value;}
  for(const value of Object.values(input)){if(value&&typeof value==="object"){const found=deepValue(value,keys);if(found!==undefined)return found;}}
  return undefined;
}
function firstNumber(obj:any, keys:string[]){const raw=deepValue(obj,keys);if(typeof raw==="string"){const cleaned=raw.replace(/[^0-9.-]/g,"");const n=Number(cleaned);if(Number.isFinite(n))return n;}const n=Number(raw);return Number.isFinite(n)?n:0;}
function unwrap(v:any){return v?.data?.data ?? v?.data ?? v ?? {};}

export default function FundraiserWallet(){
  const [wallet,setWallet]=useState<any>({}); const [amount,setAmount]=useState(""); const [withdrawOpen,setWithdrawOpen]=useState(false); const [loading,setLoading]=useState(true); const [working,setWorking]=useState(false); const [error,setError]=useState(""); const [notice,setNotice]=useState("");
  async function load(){const id=currentUserId();if(!id){setError("Unable to identify your fundraiser account.");setLoading(false);return;}setLoading(true);try{const data=await dashboardApi(`fundraiser/wallet/info?fundraiser_id=${id}`);setWallet(unwrap(data));}catch(e){setError(e instanceof Error?e.message:"Unable to load wallet.");}finally{setLoading(false);}}
  useEffect(()=>{load();},[]);
  const available=useMemo(()=>firstNumber(wallet,["available_balance","withdrawable_balance","available","wallet_balance","balance","net_balance","current_balance"]),[wallet]);
  const pending=useMemo(()=>firstNumber(wallet,["pending_balance","pending_amount","pending"]),[wallet]);
  const withdrawn=useMemo(()=>firstNumber(wallet,["withdrawn_amount","total_withdrawn","total_withdrawals","withdrawn"]),[wallet]);
  const netBalance=useMemo(()=>{const explicit=deepValue(wallet,["net_balance","wallet_balance","current_balance","balance"]);if(explicit!==undefined&&explicit!==null&&explicit!=="")return firstNumber({value:explicit},["value"]);return available;},[wallet,available]);
  async function requestWithdrawal(e:React.FormEvent){e.preventDefault();const id=currentUserId();const n=Number(amount);if(!id||!Number.isFinite(n)||n<=0){setError("Enter a valid withdrawal amount.");return;}setWorking(true);setError("");setNotice("");try{const data=await dashboardApi("fundraiser/withdrawal/request/create",{method:"POST",body:JSON.stringify({fundraiser_id:id,amount:Math.round(n*100)})});setNotice(data?.message||"Withdrawal request submitted.");setAmount("");setWithdrawOpen(false);await load();window.location.reload();}catch(e){setError(e instanceof Error?e.message:"Unable to request withdrawal.");}finally{setWorking(false);}}
  const payout=wallet?.payout_method ?? wallet?.payment_method ?? wallet?.payout ?? null;
  return <div className="space-y-7">
    {error&&<div className="rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}{notice&&<div className="rounded-md border border-success/30 bg-lightsuccess px-4 py-3 text-sm text-success">{notice}</div>}
    <CardBox><div className="flex items-start justify-between"><div><h2 className="text-3xl font-semibold">{loading?"…":`$${available.toFixed(2)}`}</h2><p className="mt-1 text-darklink">Available to withdraw</p></div><Button onClick={()=>setWithdrawOpen(true)}>Request Withdrawal</Button></div><div className="mt-7 grid rounded-md border border-ld sm:grid-cols-3">{[["Net Balance",netBalance],["Pending Payouts",pending],["Total Withdrawal",withdrawn]].map(([l,v],i)=><div key={String(l)} className={`p-5 ${i?"border-t sm:border-l sm:border-t-0 border-ld":""}`}><p className="text-darklink">{l}</p><p className="mt-2 font-medium">${Number(v).toFixed(2)}</p></div>)}</div></CardBox>
    {payout&&<p className="text-sm text-darklink">ⓘ The preferred payment method is selected as <b>{String(payout?.payment_method??payout?.method??payout)}</b>. You can change your <a href="/dashboard/settings" className="text-primary">Withdraw Preference</a>.</p>}
    <h3 className="text-xl font-semibold">All Withdrawals</h3><FundraiserWithdrawals />
    <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}><DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle className="text-2xl">Request a withdrawal?</DialogTitle></DialogHeader><div className="rounded-md bg-lightgray p-6"><p className="text-darklink">Available to withdraw</p><h3 className="mt-2 text-4xl font-semibold">${available.toFixed(2)}</h3><p className="mt-4">Minimum withdrawal $1.00</p></div><form onSubmit={requestWithdrawal} className="space-y-5"><div><Label htmlFor="withdrawAmount">Withdrawal amount</Label><Input id="withdrawAmount" type="number" min="1" max={available||undefined} step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="$5,000.00" className="mt-2" required/></div><div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={()=>setWithdrawOpen(false)}>Cancel</Button><Button disabled={working}>{working?"Submitting…":"Request Withdrawal"}</Button></div></form></DialogContent></Dialog>
  </div>;
}
