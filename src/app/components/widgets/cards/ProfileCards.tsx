"use client";
import Image from "next/image";
import CardBox from "../../shared/CardBox";
import { IconMapPin } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
/*--Profile Cards--*/
const profilecards = [
  {
    title: "Andrew Grant",
    subtitle: "Sint Maarten",
    avatar: "/images/profile/user-6.jpg",
  },
  {
    title: "Leo Pratt",
    subtitle: "Bulgaria",
    avatar: "/images/profile/user-2.jpg",
  },
  {
    title: "Charles Nunez",
    subtitle: "Nepal",
    avatar: "/images/profile/user-3.jpg",
  },
];

const ProfileCards = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-7">
        {profilecards.map((item, i) => (
          <div className="lg:col-span-4 col-span-12" key={i}>
            <CardBox>
              <div className="flex items-center">
                <Image
                  src={item.avatar}
                  alt="materialm"
                  className="h-10 w-10 rounded-full"
                  height={40}
                  width={40}
                />
                <div className="ms-3">
                  <h5 className="text-lg">{item.title}</h5>
                  <p className="text-xs text-bodytext flex gap-1 items-center">
                    <IconMapPin size={15} /> {item.subtitle}
                  </p>
                </div>
                <Button className="w-fit ms-auto">Follow</Button>
              </div>
            </CardBox>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileCards;
