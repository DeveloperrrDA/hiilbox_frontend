import {
  IconUser,
  IconBuildingArch,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import TitleCard from "../../shared/TitleBorderCard";

const BasicWithIcon = () => {
  return (
    <div>
      <TitleCard title="Basic With Icons">
        <div className="grid grid-cols-12 items-center pb-6">
          <div className="col-span-3">
            <Label htmlFor="name">Name</Label>
          </div>
          <div className="col-span-9 relative">
            <Input
              id="name"
              type="text"
              placeholder="John Deo"
              className="form-control pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <IconPhone size={18} />
            </span>
          </div>
        </div>
        <div className="grid grid-cols-12 items-center pb-6">
          <div className="col-span-3">
            <Label htmlFor="company">Company</Label>
          </div>
          <div className="col-span-9 relative">
            <Input
              id="company"
              type="text"
              placeholder="ACME Inc."
              className="form-control pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <IconBuildingArch size={20} />
            </span>
          </div>
        </div>
        <div className="grid grid-cols-12 items-center pb-6">
          <div className="col-span-3">
            <Label htmlFor="email">Email</Label>
          </div>
          <div className="col-span-9 relative">
            <Input
              id="email"
              type="text"
              placeholder="john.deo"
              className="form-control pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <IconMail size={20} />
            </span>
          </div>
        </div>
        <div className="grid grid-cols-12 items-center pb-6">
          <div className="col-span-3">
            <Label htmlFor="phone">Phone No</Label>
          </div>
          <div className="col-span-9 relative">
            <Input
              id="phone"
              type="text"
              placeholder="412 2150 451"
              className="form-control pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <IconPhone size={20} />
            </span>
          </div>
        </div>
        <div className="grid grid-cols-12 items-center pb-6">
          <div className="col-span-3">
            <Label htmlFor="message">Message</Label>
          </div>
          <div className="col-span-9 relative">
            <Textarea
              id="message"
              placeholder="Hi, Do you  have a moment to talk Jeo ?"
              required
              className="form-control-textarera"
              rows={3}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 items-center pb-6">
          <div className="col-span-3"></div>
          <div className="col-span-9 relative">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </TitleCard>
    </div>
  );
};

export default BasicWithIcon;
