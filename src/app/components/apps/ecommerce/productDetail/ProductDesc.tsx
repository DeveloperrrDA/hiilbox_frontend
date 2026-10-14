"use client";

import OutlineCard from "@/app/components/shared/OutlineCard";
import { Icon } from "@iconify/react";
import React from "react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const ProductDesc = () => {
  const stars = 5;

  return (
    <>
      <Tabs defaultValue="description" className="">
        <TabsList className="mb-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* -------- DESCRIPTION TAB -------- */}
        <TabsContent value="description">
          <div className="py-4">
            <h5 className="text-lg mb-6">
              Sed at diam elit. Vivamus tortor odio, pellentesque eu tincidunt
              a, aliquet sit amet lorem pellentesque eu tincidunt a, aliquet sit
              amet lorem.
            </h5>
            <p className="text-sm text-darklink dark:text-bodytext mb-6">
              Cras eget elit semper, congue sapien id, pellentesque diam. Nulla
              faucibus diam nec fermentum ullamcorper. Praesent sed ipsum ut
              augue vestibulum malesuada. Duis vitae volutpat odio. Integer sit
              amet elit ac justo sagittis dignissim.
            </p>
            <p className="text-sm text-darklink dark:text-bodytext">
              Cras eget elit semper, congue sapien id, pellentesque diam. Nulla
              faucibus diam nec fermentum ullamcorper. Praesent sed ipsum ut
              augue vestibulum malesuada. Duis vitae volutpat odio. Integer sit
              amet elit ac justo sagittis dignissim.
            </p>
          </div>
        </TabsContent>

        {/* -------- REVIEWS TAB -------- */}
        <TabsContent value="reviews">
          <div className="py-4">
            <div className="grid grid-cols-12 gap-5">

              {/* ---- AVERAGE RATING ---- */}
              <div className="lg:col-span-4 col-span-12 flex items-stretch">
                <OutlineCard className="shadow-none">
                  <div className="flex flex-col justify-center items-center py-5">
                    <h6 className="text-sm">Average Rating</h6>
                    <h2 className="text-4xl text-primary my-3">4/5</h2>

                    {/* CUSTOM STARS (SHADCN does not have built-in Rating) */}
                    <div className="flex gap-1">
                      {[...Array(stars)].map((_, i) => (
                        <Icon
                          key={i}
                          icon="solar:star-bold"
                          height={20}
                          className={cn(
                            i < 4 ? "text-yellow-400" : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </OutlineCard>
              </div>

              {/* ---- PROGRESS BREAKDOWN ---- */}
              <div className="lg:col-span-4 col-span-12 flex items-stretch">
                <OutlineCard className="shadow-none">
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "1 Star", value: 45, count: 485 },
                      { label: "2 Stars", value: 30, count: 215 },
                      { label: "3 Stars", value: 25, count: 110 },
                      { label: "4 Stars", value: 80, count: 620 },
                      { label: "5 Stars", value: 20, count: 160 },
                    ].map((r) => (
                      <div
                        key={r.label}
                        className="flex items-center gap-5"
                      >
                        <span className="text-darklink dark:text-bodytext text-xs">
                          {r.label}
                        </span>
                        <div className="grow">
                          <Progress value={r.value} className="h-2" />
                        </div>
                        <span className="text-ld font-semibold text-sm">
                          ({r.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </OutlineCard>
              </div>

              {/* ---- WRITE REVIEW BTN ---- */}
              <div className="lg:col-span-4 col-span-12 flex items-stretch">
                <OutlineCard className="shadow-none">
                  <div className="flex flex-col justify-center items-center py-5">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Icon icon="solar:pen-2-outline" height={22} />
                      Write a Review
                    </Button>
                  </div>
                </OutlineCard>
              </div>

            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ProductDesc;
