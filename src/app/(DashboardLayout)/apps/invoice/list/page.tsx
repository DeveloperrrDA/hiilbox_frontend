
import React from 'react'
import { Card } from '@/components/ui/card';
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import InvoiceList from '@/app/components/apps/invoice/Invoice-list/index'
import DetailCard from '@/app/components/apps/invoice/Invoice-list/detailCard';
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Invoice List App",
};
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Invoice List",
    },
];
function List() {
    return (
        <InvoiceProvider>
            <BreadcrumbComp title="Invoice List" items={BCrumb} />
            <DetailCard />
            <Card>
                <InvoiceList />
            </Card>
        </InvoiceProvider>
    )
}
export default List;
