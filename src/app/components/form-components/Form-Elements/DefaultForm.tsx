import React from "react";
import CardBox from "../../shared/CardBox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const DefaultForm = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-1">Default Form</h4>
        <form className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email1">Your email</Label>
            </div>
            <Input
              id="email1"
              type="email"
              placeholder="name@materialm.com"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password1">Your password</Label>
            </div>
            <Input id="password1" type="password" required />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox className="checkbox" id="remember" />
            <Label htmlFor="remember" className="mb-0">
              Remember me
            </Label>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </CardBox>
    </div>
  );
};

export default DefaultForm;
