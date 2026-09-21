"use client";
import { useEffect,useState } from "react";
import { dashboardRole,savedDashboardUser,type DashboardRole } from "@/lib/dashboard/roles";
import CampaignManager from "@/app/components/growfund/CampaignManager";
import AdminCampaignManager from "@/app/components/growfund/admin/AdminCampaignManager";
export default function RoleCampaignManager(){const[role,setRole]=useState<DashboardRole>("guest");useEffect(()=>setRole(dashboardRole(savedDashboardUser())),[]);if(role==="admin")return <AdminCampaignManager/>;if(role==="fundraiser")return <CampaignManager/>;return <div className="rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">Campaign management is available to fundraisers and administrators.</div>}
