import React from "react";
import CardBox from "../../shared/CardBox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const InputSizing = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">Input sizing</h4>
        <div className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="small">Small input</Label>
            </div>
            <Input id="small" type="text" className="h-8" />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="base">Base input</Label>
            </div>
            <Input id="base" type="text" className="h-10" />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="large">Large input</Label>
            </div>
            <Input id="large" type="text" className="h-12" />
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default InputSizing;
