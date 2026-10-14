"use client";

import ProductFilter from "@/app/components/apps/ecommerce/productGrid/ProductFilter";
import ProductList from "@/app/components/apps/ecommerce/productGrid/ProductList";
import { ProductProvider } from "@/app/context/Ecommercecontext/index";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // <- ShadCN Sheet
import { useState } from "react";
import CardBox from "@/app/components/shared/CardBox";

const EcommerceShop = () => {
  const [isOpenShop, setIsOpenShop] = useState(false);

  return (
    <ProductProvider>
      <CardBox className="p-0">
        <div className="flex">
          {/* ------------------------------------------- */}
          {/* Left Filter Sidebar for mobile using Sheet */}
          {/* ------------------------------------------- */}
          <div className="lg:relative lg:block hidden max-w-[250px] w-full">
            <ProductFilter />
          </div>

          {/* Mobile Filter using Sheet/Drawer */}
          <Sheet open={isOpenShop} onOpenChange={setIsOpenShop}>
            <SheetContent side="left" className="w-[250px] p-0 lg:hidden">
              <ProductFilter />
            </SheetContent>
          </Sheet>

          {/* ------------------------------------------- */}
          {/* Product List */}
          {/* ------------------------------------------- */}
          <div className="p-6 w-full">
            <ProductList openShopFilter={setIsOpenShop} />
          </div>
        </div>
      </CardBox>
    </ProductProvider>
  );
};

export default EcommerceShop;
