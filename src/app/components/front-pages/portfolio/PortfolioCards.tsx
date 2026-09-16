import React, { useContext } from "react";
import { TbDotsVertical } from "react-icons/tb";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import CardBox from "@/app/components/shared/CardBox";
import Image from "next/image";
import { UserDataContext } from "@/app/context/UserDataContext/index";

const PortfolioCards = () => {
  const { gallery }: any = useContext(UserDataContext);
  const [search, setSearchLocal] = React.useState("");

  const filterPhotos = (photos: any[], cSearch: string) => {
    if (photos)
      return photos.filter((t: { name: string }) =>
        t.name.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase())
      );
    return photos;
  };

  const getPhotos = filterPhotos(gallery, search);

  return (
    <>
      <div className="md:flex justify-between mb-6!">
        <h5 className="text-2xl flex gap-3 items-center sm:my-0 my-4!">
          Portfolio <Badge variant="secondary">{getPhotos.length}</Badge>
        </h5>

        <div className="relative md:w-1/3 w-full">
          <Icon
            icon="solar:magnifer-line-duotone"
            height={18}
            className="absolute left-3 top-3 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Search Gallery"
            className="pl-9 form-control"
            onChange={(e) => setSearchLocal(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-[30px]">
        {getPhotos.map((photo) => {
          return (
            <div
              className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12"
              key={photo.id}
            >
              <CardBox className="overflow-hidden p-0 card-hover">
                <div className="h-[220px]  overflow-hidden">
                  <Image
                    src={photo.cover}
                    height={220}
                    width={500}
                    alt="gllery"
                    className="object-center object-cover h-full"
                  />
                </div>
                <div className="pt-4 p-6 flex">
                  <div>
                    <h6 className="text-sm">{photo.name}jpg</h6>
                    <p className="text-xs font-medium text-dark dark:text-bodytext">
                      {" "}
                      {format(new Date(photo.time), "E, MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="ms-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                          <TbDotsVertical size={22} />
                        </span>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="flex gap-3">
                          <span>{photo.name}.jpg</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardBox>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PortfolioCards;
