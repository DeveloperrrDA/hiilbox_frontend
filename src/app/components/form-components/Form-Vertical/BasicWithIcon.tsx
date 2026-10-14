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
import React from "react";
import TitleCard from "../../shared/TitleBorderCard";

const BasicWithIcon = () => {
  return (
    <div>
      <TitleCard title="Basic With Icons">
        <div className="grid grid-cols-12 gap-7">
          <div className="col-span-12">
            <div className="mb-2 block">
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
                <IconUser size={20} />
              </span>
            </div>
          </div>
          <div className="col-span-12">
            <div className="mb-2 block">
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
          <div className="col-span-12">
            <div className="mb-2 block">
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
          <div className="col-span-12">
            <div className="mb-2 block">
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
          <div className="col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="message">Message</Label>
            </div>
            <Textarea
              id="message"
              placeholder="Hi, Do you  have a moment to talk Jeo ?"
              required
              className="form-control-textarera"
              rows={4}
            />
          </div>
          <div className="col-span-12">
            <Button type="submit">Send</Button>
          </div>
        </div>
      </TitleCard>
    </div>
  );
};

export default BasicWithIcon;
