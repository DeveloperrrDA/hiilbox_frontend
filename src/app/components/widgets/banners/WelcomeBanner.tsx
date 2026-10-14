import CardBox from "../../shared/CardBox";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const WelcomeBanner = () => {
  return (
    <>
      <CardBox className="bg-primary-gt shadow-none pb-0 pe-0">
        <div className="grid grid-cols-12 gap-7">
          <div className="md:col-span-6 col-span-12">
            <h5 className="text-lg text-white mt-2">Welcome back David!</h5>
            <p className="text-white opacity-75 text-sm font-medium py-5">
              You have earned 54% more than last month which is great thing.
            </p>
            <Button variant={'error'}>Check</Button>
          </div>
          <div className="md:col-span-6 col-span-12">
            <Image src={"/images/backgrounds/welcome-bg2.png"} alt="banner" className="ms-auto" width={285} height={178}/>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default WelcomeBanner;
