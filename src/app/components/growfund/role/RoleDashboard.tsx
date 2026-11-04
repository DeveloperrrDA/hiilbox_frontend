"use client";
import { useEffect,useState } from "react";
import { dashboardRole,savedDashboardUser,type DashboardRole } from "@/lib/dashboard/roles";
import FundraiserDashboard from "@/app/components/growfund/FundraiserDashboard";
import DonorDashboard from "@/app/components/growfund/donor/DonorDashboard";
import AdminDashboardOverview from "@/app/components/growfund/admin/AdminDashboardOverview";
export default function RoleDashboard(){const[role,setRole]=useState<DashboardRole>("guest");useEffect(()=>setRole(dashboardRole(savedDashboardUser())),[]);if(role==="admin")return <AdminDashboardOverview/>;if(role==="donor")return <DonorDashboard/>;if(role==="fundraiser")return <FundraiserDashboard/>;return <div className="py-12 text-center text-sm text-darklink">Loading dashboard…</div>}
