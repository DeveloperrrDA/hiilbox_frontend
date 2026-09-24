import React from "react";
import CardBox from "../../shared/CardBox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const InputColors = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">Input Element Colors</h4>
        <div className="grid grid-cols-12 gap-7">
          <div className="md:col-span-6 col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="input-gray">Gray</Label>
            </div>
            <Input
              id="input-gray"
              placeholder="Input Gray"
              required
              variant="gray"
            />
          </div>
          <div className="md:col-span-6 col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="input-info" className="text-info">
                Info
              </Label>
            </div>
            <Input
              id="input-info"
              placeholder="Input Info"
              required
              variant="info"
            />
          </div>
          <div className="md:col-span-6 col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="input-success" className="text-success">
                Success
              </Label>
            </div>
            <Input
              id="input-success"
              placeholder="Input Success"
              required
              variant="success"
            />
          </div>
          <div className="md:col-span-6 col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="input-failure" className="text-failure">
                Failure
              </Label>
            </div>
            <Input
              id="input-failure"
              placeholder="Input Failure"
              required
              variant="failure"
            />
          </div>
          <div className="md:col-span-6 col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="input-warning" className="text-warning">
                Warning
              </Label>
            </div>
            <Input
              id="input-warning"
              placeholder="Input Warning"
              required
              variant="warning"
            />
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default InputColors;
