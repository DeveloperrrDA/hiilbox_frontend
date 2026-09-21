"use client";
import { useEffect,useState } from "react";
import { dashboardRole,savedDashboardUser,type DashboardRole } from "@/lib/dashboard/roles";
import AdminDonationManager from "@/app/components/growfund/admin/AdminDonationManager";
import FundraiserDonations from "@/app/components/growfund/fundraiser/FundraiserDonations";
export default function RoleDonationManager(){const[role,setRole]=useState<DashboardRole>("guest");useEffect(()=>setRole(dashboardRole(savedDashboardUser())),[]);if(role==="admin")return <AdminDonationManager/>;if(role==="fundraiser")return <FundraiserDonations/>;return <div className="rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">Donations are not available for this dashboard role.</div>}
