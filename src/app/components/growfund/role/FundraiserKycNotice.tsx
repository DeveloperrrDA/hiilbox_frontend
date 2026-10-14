"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { dashboardApi } from "@/lib/dashboard/api";

export default function FundraiserKycNotice(){
  const [show,setShow]=useState(false);
  const [dismissed,setDismissed]=useState(false);
  const [status,setStatus]=useState("not_started");

  useEffect(()=>{
    let cancelled=false;
    const check=async()=>{
      try{
        const response=await dashboardApi("fundraiser/kyc");
        if(cancelled)return;
        const nextStatus=String(response?.status||"not_started").toLowerCase();
        setStatus(nextStatus);
        setShow(response?.complete!==true && !["submitted","approved"].includes(nextStatus));
      }catch{
        if(!cancelled){setStatus("not_started");setShow(true);}
      }
    };
    void check();
    const onChanged=()=>void check();
    window.addEventListener("hiilbox-kyc-changed",onChanged);
    return()=>{cancelled=true;window.removeEventListener("hiilbox-kyc-changed",onChanged);};
  },[]);

  if(!show||dismissed)return null;
  const rejected=status==="rejected";
  return <div className="fixed bottom-5 right-5 z-[9999] w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl border border-amber-200 bg-white p-5 shadow-2xl dark:border-darkborder dark:bg-darkgray">
    <button aria-label="Dismiss KYC reminder" onClick={()=>setDismissed(true)} className="absolute right-3 top-3 rounded-full p-1 text-darklink hover:bg-gray-100 dark:hover:bg-dark"><Icon icon="solar:close-circle-line-duotone" height={20}/></button>
    <div className="flex gap-3 pr-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"><Icon icon="solar:shield-check-line-duotone" height={24}/></span><div><h6 className="font-semibold text-dark dark:text-white">{rejected?"Update your KYC":"Complete your KYC"}</h6><p className="mt-1 text-sm leading-5 text-darklink">{rejected?"Your KYC needs updated information before withdrawals can continue.":"Complete your identity and payout information before requesting a withdrawal."}</p></div></div>
    <Link href="/signup/fundraiser-kyc" className="mt-4 flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">{rejected?"Update KYC":"Complete KYC"}</Link>
  </div>;
}
