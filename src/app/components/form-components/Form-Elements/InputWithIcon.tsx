import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import CardBox from "../../shared/CardBox";
import { HiMail } from "react-icons/hi";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const InputWithIcon = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">Input groups with icon</h4>
        <div className="mb-[0.375rem]">
          <div className="pb-3">
            <div className="mb-2 block">
              <Label htmlFor="email4">Your email</Label>
            </div>

            <InputGroup>
              <InputGroupInput
                placeholder="name@materialm.com"
                className="form-control"
              />
              <InputGroupAddon>
                <HiMail size={22} />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="pb-3">
            <div className="mb-2 block">
              <Label htmlFor="email4">Your email</Label>
            </div>

            <InputGroup>
              <InputGroupInput
                placeholder="name@materialm.com"
                className="form-control"
              />
              <InputGroupAddon align="inline-end">
                <HiMail size={22} />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="pb-3">
            <div className="mb-2 block">
              <Label htmlFor="email4">Your email</Label>
            </div>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <HiMail size={20} />
              </InputGroupAddon>

              <InputGroupInput id="email4" placeholder="name@materialm.com" />

              <InputGroupAddon align="inline-end">
                <HiMail size={20} />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="pb-3">
            <div className="mb-2 block">
              <Label htmlFor="username3">Username</Label>
            </div>

            <InputGroup>
              <InputGroupInput
                id="username3"
                placeholder="Bonnie Green"
                className="form-control"
              />
              <InputGroupAddon>
                <Label htmlFor="username3" className="mb-0">
                  @
                </Label>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default InputWithIcon;
