"use client";
import {
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import Image from "next/image";
import CardBox from "../../shared/CardBox";

const musicCard = [
  {
    title: "Uptown Funk",
    subheader: "Jon Bon Jovi",
    img: "/images/blog/blog-img8.jpg",
  },
  {
    title: "Blank Space",
    subheader: "Madonna",
    img: "/images/blog/blog-img9.jpg",
  },
  {
    title: "Lean On",
    subheader: "Jennifer Lopez",
    img: "/images/blog/blog-img7.jpg",
  },
];

const MusicCards = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-7">
        {musicCard.map((item, i) => (
          <div className="lg:col-span-4 col-span-12" key={i}>
            <CardBox className="overflow-hidden p-0">
              <div className="grid grid-cols-12 gap-7">
                <div className="col-span-6 p-6">
                  <h5 className="text-lg ">{item.title}</h5>
                  <p className="text-bodytext">{item.subheader}</p>
                  <div className="flex justify-between items-center pt-12 cursor-pointer">
                    <IconPlayerSkipBack size={18} />
                    <IconPlayerPlay className="text-error" size={18} />
                    <IconPlayerSkipForward size={18} />
                  </div>
                </div>
                <div className="col-span-6">
                  <Image
                    src={item.img}
                    alt="materialm"
                    className="h-full object-cover"
                    width={200}
                    height={165}
                  />
                </div>
              </div>
            </CardBox>
          </div>
        ))}
      </div>
    </>
  );
};

export default MusicCards;
