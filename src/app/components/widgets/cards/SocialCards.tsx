"use client";
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandTwitter,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import CardBox from "../../shared/CardBox";

const profileCards = [
  {
    title: "Andrew Grant",
    subtitle: "Technology Director",
    avatar: "/images/profile/user-6.jpg",
  },
  {
    title: "Leo Pratt",
    subtitle: "Telecom Analyst",
    avatar: "/images/profile/user-2.jpg",
  },
  {
    title: "Charles Nunez",
    subtitle: "Environmental Specialist",
    avatar: "/images/profile/user-3.jpg",
  },
];

/*--Social Cards--*/
const socialiconCard = [
  {
    icon: <IconBrandFacebook size={17} />,
    color: "primary",
  },
  {
    icon: <IconBrandInstagram size={17} />,
    color: "error",
  },
  {
    icon: <IconBrandGithub size={17} />,
    color: "info",
  },
  {
    icon: <IconBrandTwitter size={17} />,
    color: "secondary",
  },
];
const SocialCards = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-7">
        {profileCards.map((item, i) => (
          <div className="lg:col-span-4  col-span-12 text-center" key={i}>
            <CardBox className="px-0 pb-4">
              <Image
                src={item.avatar}
                alt="materialm"
                className="h-20 w-20 rounded-full mx-auto"
                height={80}
                width={80}
              />
              <div>
                <h5 className="text-lg mt-3">{item.title}</h5>
                <p className="text-xs text-bodytext">{item.subtitle}</p>
              </div>
              <div className="flex justify-center gap-4 items-center border-t border-ld mt-4 pt-4">
                {socialiconCard.map((soc, index) => (
                  <Link href={""} className={`text-${soc.color}`} key={index}>
                    {soc.icon}
                  </Link>
                ))}
              </div>
            </CardBox>
          </div>
        ))}
      </div>
    </>
  );
};

export default SocialCards;
