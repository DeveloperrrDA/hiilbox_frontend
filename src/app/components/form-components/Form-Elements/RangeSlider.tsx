import React from "react";
import CardBox from "../../shared/CardBox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
const RangeSliders = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">Range slider</h4>
        <div className="flex max-w-md flex-col gap-4 pb-12">
          <div>
            <div className="mb-1 block">
              <Label htmlFor="default-range">Default</Label>
            </div>
            <Slider id="default-range" defaultValue={[50]} />
          </div>
          <div>
            <div className="mb-1 block">
              <Label htmlFor="disbaled-range">Disabled</Label>
            </div>
            <Slider id="disabled-range" disabled defaultValue={[50]} />
          </div>
          <div>
            <div className="mb-1 block">
              <Label htmlFor="sm-range">Small</Label>
            </div>
            <Slider id="default-range" className="h-2" defaultValue={[50]} />
          </div>
          <div>
            <div className="mb-1 block">
              <Label htmlFor="md-range"> Medium</Label>
            </div>
            <Slider id="default-range" className="h-3" defaultValue={[50]} />
          </div>
          <div>
            <div className="mb-1 block">
              <Label htmlFor="lg-range">Large</Label>
            </div>
            <Slider id="default-range" defaultValue={[50]} />
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default RangeSliders;
