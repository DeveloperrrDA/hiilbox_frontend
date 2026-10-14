"use client";
import { useEffect,useState } from "react";
import { dashboardRole,savedDashboardUser,type DashboardRole } from "@/lib/dashboard/roles";
import AdminWithdrawalManager from "@/app/components/growfund/admin/AdminWithdrawalManager";
import FundraiserWithdrawals from "@/app/components/growfund/fundraiser/FundraiserWithdrawals";
export default function RoleWithdrawalManager(){const[role,setRole]=useState<DashboardRole>("guest");useEffect(()=>setRole(dashboardRole(savedDashboardUser())),[]);if(role==="admin")return <AdminWithdrawalManager/>;if(role==="fundraiser")return <FundraiserWithdrawals/>;return <div className="rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">Withdrawals are available to fundraisers and administrators.</div>}
