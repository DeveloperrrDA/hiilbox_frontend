import CardBox from "../../shared/CardBox";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const DownloaadBanner = () => {
  return (
    <>
      <CardBox className="bg-lightsecondary dark:bg-lightsecondary shadow-none pb-0 mt-7">
        <div className="grid grid-cols-12 gap-7">
          <div className="md:col-span-6 col-span-12">
            <h5 className="text-lg mt-2">Track your every Transaction Easily</h5>
            <p className="text-dark dark:text-white opacity-75 text-sm font-medium py-5">
            Track and record your every income and expence easily to control your balance
            </p>
            <Button color={'info'}>Download</Button>
          </div>
          <div className="md:col-span-6 col-span-12">
            <Image src={"/images/backgrounds/track-bg.png"} alt="banner" className="ms-auto" width={170} height={195} />
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default DownloaadBanner;
