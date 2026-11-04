import { uniqueId } from "lodash";

export interface ChildItem {
  disabled?: any;
  badge?: boolean;
  badgeType?: string;
  badgeContent?: string;
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

const SidebarContent: MenuItem[] = [
  {
    id: 1,
    name: "Dashboard",
    items: [
      {
        heading: "Dashboards",
        children: [
          { name: "Home", icon: "solar:home-2-line-duotone", id: uniqueId(), url: "/" },
          { name: "Overview", icon: "solar:widget-add-line-duotone", id: uniqueId(), url: "/dashboard" },
          { name: "Campaigns", icon: "solar:flag-2-line-duotone", id: uniqueId(), url: "/dashboard/campaigns" },
          { name: "Donations", icon: "solar:hand-money-line-duotone", id: uniqueId(), url: "/dashboard/donations" },
          { name: "Withdrawals", icon: "solar:wallet-money-line-duotone", id: uniqueId(), url: "/dashboard/withdrawals" },
          { name: "Donors", icon: "solar:users-group-rounded-line-duotone", id: uniqueId(), url: "/dashboard/donors" },
          { name: "Fundraisers", icon: "solar:user-heart-rounded-line-duotone", id: uniqueId(), url: "/dashboard/fundraisers" },
          { name: "Users", icon: "solar:users-group-rounded-line-duotone", id: uniqueId(), url: "/dashboard/users" },
          { name: "KYC", icon: "solar:shield-check-line-duotone", id: uniqueId(), url: "/dashboard/kyc" },
          { name: "Analytics", icon: "solar:chart-line-duotone", id: uniqueId(), url: "/dashboard/analytics" },
        ],
      },
    ],
  },
];

export default SidebarContent;