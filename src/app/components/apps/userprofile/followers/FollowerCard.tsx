import React, { useContext } from "react";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDataContext } from '@/app/context/UserDataContext/index';
import InputPlaceholderAnimate from '@/app/components/animatedComponents/AnimatedInputPlaceholder';
import CardBox from "@/app/components/shared/CardBox";

const FollowerCard = () => {
  const { followers, toggleFollow, search, setSearch }: any = useContext(UserDataContext);

  return (
    <>
      <div className="md:flex justify-between mb-6">
        <h5 className="text-2xl flex gap-3 items-center sm:my-0 my-4">
          Followers <Badge variant={"secondary"}>{followers.length}</Badge>
        </h5>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon icon="solar:magnifer-line-duotone" height={18} className="text-darklink dark:text-bodytext"/>
          </span>
          <InputPlaceholderAnimate
            value={search}
            onChange={setSearch}
            placeholders={['Search followers...', 'Find followers...', 'Look up followers...']}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {followers.map((profile: {
          id: React.Key | null | undefined;
          avatar: string;
          name: React.ReactNode;
          country: React.ReactNode;
          isFollowed: boolean;
        }) => {
          return (
            <div
              className="lg:col-span-4 md:col-span-6 sm:col-span-6 col-span-12"
              key={profile.id}
            >
              <CardBox>
                <div className="flex gap-3 items-center">
                  <Avatar className="shrink-0">
                    <AvatarImage src={profile.avatar} alt={String(profile.name)} />
                    <AvatarFallback>{String(profile.name).charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h6 className="text-base">{profile.name}</h6>
                    <p className="flex gap-1 items-center mt-0.5">
                      <Icon icon="solar:map-point-outline" height="14" className="text-darklink dark:text-bodytext"/>
                      <span className="truncate line-clamp-1 text-wrap text-darklink dark:text-bodytext">
                        {profile.country}
                      </span>
                    </p>
                  </div>

                  <div className="ms-auto">
                    {profile.isFollowed ? (
                      <Button onClick={() => toggleFollow(profile.id)}>
                        Followed
                      </Button>
                    ) : (
                      <Button variant={"outline"} onClick={() => toggleFollow(profile.id)}>
                        Follow
                      </Button>
                    )}
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

export default FollowerCard;
