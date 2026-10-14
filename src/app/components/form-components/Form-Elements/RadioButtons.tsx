import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";
import CardBox from "../../shared/CardBox";

const RadioButtons = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">Radio Button</h4>
        <fieldset className="flex max-w-md flex-col gap-4 pb-6">
          <RadioGroup>
            <legend className="mb-4">Choose your favorite country</legend>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="united-state" value="USA" defaultChecked />
              <Label htmlFor="united-state">United States</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="germany" value="Germany" />
              <Label htmlFor="germany">Germany</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="spain" value="Spain" />
              <Label htmlFor="spain">Spain</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="uk" value="United Kingdom" />
              <Label htmlFor="uk">United Kingdom</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="china" value="China" disabled />
              <Label htmlFor="china" className="opacity-50">
                China (disabled)
              </Label>
            </div>
          </RadioGroup>
        </fieldset>
      </CardBox>
    </div>
  );
};

export default RadioButtons;
