"use client";
import { useEffect,useState } from "react";
import { dashboardRole,savedDashboardUser,type DashboardRole } from "@/lib/dashboard/roles";
import AdminDonorManager from "@/app/components/growfund/admin/AdminDonorManager";
import FundraiserDonors from "@/app/components/growfund/fundraiser/FundraiserDonors";
export default function RoleDonorManager(){const[role,setRole]=useState<DashboardRole>("guest");useEffect(()=>setRole(dashboardRole(savedDashboardUser())),[]);if(role==="admin")return <AdminDonorManager/>;if(role==="fundraiser")return <FundraiserDonors/>;return <div className="rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">Donor management is not available for this dashboard role.</div>}
