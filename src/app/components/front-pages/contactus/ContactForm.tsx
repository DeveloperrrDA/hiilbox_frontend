"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import CardBox from "../../shared/CardBox";

const ContactForm = () => {
  return (
    <>
      <div className="container-1218 mx-auto mt-30">
        <div className="grid grid-cols-12 lg:gap-7 gap-6">
          <div className="lg:col-span-4 col-span-12">
            <div className="overflow-hidden rounded-xl bg-primary relative p-7 after:absolute after:content-[''] after:bg-[url('/images/front-pages/background/contact-icon.png')] after:bg-no-repeat after:bg-right-top after:top-0 after:right-0   after:w-[325px] after:h-[325px]">
              <h5 className="text-lg font-bold text-white pb-4">
                Reach Out Today
              </h5>
              <p className="text-base text-white leading-7">
                Have questions or need assistance? We're just a message away.
              </p>

              <Separator className="my-5 bg-white/10" />

              <h5 className="text-lg font-bold text-white pb-4">
                Our Location
              </h5>
              <p className="text-base text-white leading-7">
                Visit us in person or find our contact details to connect with
                us directly.
              </p>
            </div>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <CardBox>
              <div className="grid grid-cols-12 lg:gap-7  gap-6">
                <div className="lg:col-span-6 col-span-12">
                  <div className="mb-2 block">
                    <Label htmlFor="nm">First Name *</Label>
                  </div>
                  <Input
                    id="nm"
                    type="text"
                    placeholder="Name"
                    required
                    className="form-control"
                  />
                </div>
                <div className="lg:col-span-6 col-span-12">
                  <div className="mb-2 block">
                    <Label htmlFor="lnm">Last Name *</Label>
                  </div>
                  <Input
                    id="lnm"
                    type="text"
                    placeholder="Last Name"
                    required
                    className="form-control"
                  />
                </div>
                <div className="lg:col-span-6 col-span-12">
                  <div className="mb-2 block">
                    <Label htmlFor="ph"> Phone Number *</Label>
                  </div>
                  <Input
                    id="ph"
                    type="number"
                    placeholder="xxx xxx xxxx"
                    required
                    className="form-control"
                  />
                </div>
                <div className="lg:col-span-6 col-span-12">
                  <div className="mb-2 block">
                    <Label htmlFor="em">Email *</Label>
                  </div>
                  <Input
                    id="em"
                    type="email"
                    placeholder="Email address"
                    required
                    className="form-control"
                  />
                </div>
                <div className="col-span-12">
                  <div className="mb-2 block">
                    <Label htmlFor="inq">Enquire related to *</Label>
                  </div>
                  <Select required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="general">General Enquiry</SelectItem>
                      <SelectItem value="other">Other Enquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-12">
                  <div className="mb-2 block">
                    <Label htmlFor="msg">Message</Label>
                  </div>
                  <Textarea
                    id="msg"
                    placeholder="Write your message here..."
                    required
                    className="form-control-textarera rounded-md"
                    rows={4}
                  />
                </div>
                <div className="col-span-12">
                  <div className="block ">
                    <Button className="sm:w-auto w-full ms-auto">
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardBox>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
