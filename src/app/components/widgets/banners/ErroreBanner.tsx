import CardBox from "../../shared/CardBox";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ErroreBanner = () => {
  return (
    <>
      <CardBox>
        <Image src={"/images/backgrounds/website-under-construction.svg"} width={192} height={144} alt="banner" className="mx-auto  w-48" />
        <div className="text-center mx-auto">
          <h5 className="text-lg">Oops something went wrong!</h5>
          <p className="text-bodytext mt-2 md:px-12">
            Trying again to bypasses these temporary error.
          </p>
          <div className="flex justify-center mt-3">
            <Button variant={"error"}>Retry</Button>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default ErroreBanner;
