"use client";
import CreateInvoice from "@/app/components/apps/invoice/Add-invoice/create";
import { InvoiceProvider } from "@/app/context/InvoiceContext/index";
import CardBox from "@/app/components/shared/CardBox";

function CreateInvoiceApp() {
  return (
    <InvoiceProvider>
      <CardBox>
        <CreateInvoice />
      </CardBox>
    </InvoiceProvider>
  );
}
export default CreateInvoiceApp;
