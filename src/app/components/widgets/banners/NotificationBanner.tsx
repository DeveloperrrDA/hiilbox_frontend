import { Button } from "@/components/ui/button";
import CardBox from "../../shared/CardBox";
import Image from "next/image";

const NotificationBanner = () => {
  return (
    <>
      <CardBox>
        <p className="text-sm text-bodytext text-center mb-2">LEVEL UP</p>
        <Image src={"/images/backgrounds/gold.png"} width={150} height={150} alt="banner" className="mx-auto  w-[150px]" />
        <div className="text-center mx-auto mt-3">
          <h5 className="text-lg">You reach all Notifications</h5>
          <p className="text-bodytext mt-2 md:px-12">
          Congratulations, Tap to continue next task.
          </p>
          <div className="flex justify-center mt-3">
            <Button>Yes,Got it!</Button>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default NotificationBanner;
