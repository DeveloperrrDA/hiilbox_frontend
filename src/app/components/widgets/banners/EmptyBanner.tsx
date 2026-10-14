import { Button } from "@/components/ui/button";
import CardBox from "../../shared/CardBox";
import Image from "next/image";

const EmptyBanner = () => {
  return (
    <>
      <CardBox>
        <Image src={"/images/products/empty-shopping-bag.gif"} width={192} height={192} alt="banner" className="mx-auto  w-48" />
        <div className="text-center mx-auto">
          <h5 className="text-lg">Oop, Your cart is empty!</h5>
          <p className="text-bodytext mt-2">
          Get back to shopping and get rewards from it.
          </p>
          <div className="flex justify-center mt-5">
            <Button>Go for shopping</Button>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default EmptyBanner;
