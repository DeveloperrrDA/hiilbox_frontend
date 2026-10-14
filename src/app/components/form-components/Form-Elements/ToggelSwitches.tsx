"use client";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";
import CardBox from "../../shared/CardBox";
import { Label } from "@/components/ui/label";

const ToggelSwitches = () => {
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [switch3, setSwitch3] = useState(true);
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">Toggle Switch</h4>
        <div className="flex max-w-md flex-col items-start gap-4 pb-7">
          <div className="flex items-center gap-2">
            <Switch checked={switch1} onCheckedChange={setSwitch1} />
            <Label>Toggle me</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={switch2} onCheckedChange={setSwitch2} />
            <Label>Toggle me (checked)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={false} disabled onChange={() => undefined} />
            <Label>Toggle me (disabled)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={true} disabled onChange={() => undefined} />
            <Label>Toggle me (disabled)</Label>
          </div>
          <Switch checked={switch3} onCheckedChange={setSwitch3} />
        </div>
      </CardBox>
    </div>
  );
};

export default ToggelSwitches;
