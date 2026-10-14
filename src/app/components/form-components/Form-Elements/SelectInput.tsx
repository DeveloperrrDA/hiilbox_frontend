import React from "react";
import CardBox from "../../shared/CardBox";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const SelectInput = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">Select Input</h4>
        <div className="pb-6">
          <div className="mb-2 block">
            <Label htmlFor="countries">Select your country</Label>
          </div>

          <Select required>
            <SelectTrigger className="select-rounded" id="countries">
              <SelectValue placeholder="Select a countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardBox>
    </div>
  );
};

export default SelectInput;
