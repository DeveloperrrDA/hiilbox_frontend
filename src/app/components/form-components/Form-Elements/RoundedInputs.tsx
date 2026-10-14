import React from "react";
import CardBox from "../../shared/CardBox";

import RoundInputsCodes from "./Codes/RoundedInputs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const RoundedInputs = () => {
  return (
    <div>
      <form className="flex  flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Your email</Label>
          </div>
          <Input
            id="email1"
            type="email"
            placeholder="name@materialm.com"
            required
            className="form-control"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1">Your password</Label>
          </div>
          <Input
            id="password1"
            type="password"
            required
            className="form-control"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox className="checkbox" id="remember" />
          <Label htmlFor="remember" className="mb-0">
            Remember me
          </Label>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default RoundedInputs;
