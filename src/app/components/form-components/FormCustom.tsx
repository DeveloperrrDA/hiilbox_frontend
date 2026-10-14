"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import TitleCard from "@/app/components/shared/TitleBorderCard";
import { IconVolume, IconVolume2 } from "@tabler/icons-react";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const FormCustom = () => {
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [date, setDate] = useState<Date | undefined>();

  const [gender, setGender] = useState("Male");

  const [selectedValue, setSelectedValue] = useState("");
  const handleSelectChange = (value: React.SetStateAction<string>) => {
    setSelectedValue(value);
  };

  return (
    <>
      <TitleCard title="Ordrinary Form">
        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-4 col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="name" className="mb-0">
                Name
              </Label>
            </div>
            <Input
              id="name"
              type="text"
              placeholder="Enter text"
              className="form-control"
              required
            />
          </div>
          <div className="lg:col-span-4 col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="companyname" className="mb-0">
                Company Name
              </Label>
            </div>
            <Input
              id="companyname"
              type="text"
              placeholder="Enter text"
              className="form-control"
              required
            />
          </div>
          <div className="lg:col-span-4 col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="disabledInput" className="mb-0">
                Industry Type
              </Label>
            </div>
            <Input
              type="text"
              id="disabledInput"
              placeholder="Disabled filled"
              className="form-control"
              disabled
              readOnly
            />
          </div>
          <div className="lg:col-span-6 col-span-12">
            <div className="col-span-3 mb-2">
              <Label htmlFor="dropdown" className="mb-0">
                Select Dropdown
              </Label>
            </div>
            <div className="col-span-6">
              <Select onValueChange={handleSelectChange} value={selectedValue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="One">One</SelectItem>
                  <SelectItem value="Two">Two</SelectItem>
                  <SelectItem value="Three">Three</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="lg:col-span-6 col-span-12">
            <div className="col-span-3 mb-2">
              <Label htmlFor="date">Date</Label>
            </div>
            <div className="col-span-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-ld hover:border-primary hover:bg-transparent text-ld hover:text-ld",
                      !date &&
                        "text-muted-foreground hover:text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="form-control"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-[1.875rem]">
          <div className="col-span-12 mt-[1.875rem]">
            <div className="mb-2 block">
              <Label htmlFor="gender">Lorem ipsum dolor sit amet</Label>
            </div>

            <RadioGroup value={gender} onValueChange={setGender}>
              <div className="grid grid-cols-12 items-center gap-[1.875rem]">
                <div className="md:col-span-4 col-span-12  flex items-center gap-2">
                  <RadioGroupItem id="gender" value="Male" />
                  <Label htmlFor="male" className="mb-0">
                    Male
                  </Label>
                </div>
                <div className="md:col-span-4 col-span-12  flex items-center gap-2">
                  <RadioGroupItem id="female" value="Female" />
                  <Label htmlFor="female" className="mb-0">
                    Female
                  </Label>
                </div>
                <div className="md:col-span-4 col-span-12  flex items-center gap-2">
                  <RadioGroupItem id="other" value="Other" disabled />
                  <Label htmlFor="male" className="mb-0">
                    Disabled
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-[1.875rem]">
          <div className="col-span-12 mt-[1.875rem]">
            <div className="mb-2 block">
              <Label htmlFor="gender" className="mb-0">
                Industry Type
              </Label>
            </div>
            <div className="grid grid-cols-12 items-center gap-[1.875rem]">
              <div className="md:col-span-4 col-span-12  flex items-center gap-2">
                <Checkbox id="age" className="checkbox" />
                <Label htmlFor="age" className="mb-0">
                  Enter text
                </Label>
              </div>
              <div className="md:col-span-4 col-span-12  flex items-center gap-2">
                <Checkbox id="age1" className="checkbox" />
                <Label htmlFor="age1" className="mb-0">
                  Enter text
                </Label>
              </div>
              <div className="md:col-span-4 col-span-12  flex items-center gap-2">
                <Checkbox id="age2" className="checkbox" disabled />
                <Label
                  htmlFor="age2"
                  className="opacity-50 cursor-not-allowed mb-0"
                >
                  Disabled
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-[1.875rem]">
          <div className="col-span-12 mt-[1.875rem]">
            <div className="mb-2 block">
              <Label htmlFor="gender">Switch</Label>
            </div>
            <div className="grid grid-cols-12 items-center gap-[1.875rem]">
              <div className="lg:col-span-3 md:col-span-6 col-span-6 flex items-center gap-2">
                <Switch checked={switch1} onCheckedChange={setSwitch1} />
                <Label htmlFor="age1 " className="mb-0">
                  Enter text
                </Label>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-6 flex items-center gap-2">
                <Switch checked={switch2} onCheckedChange={setSwitch2} />
                <Label htmlFor="age1 " className="mb-0">
                  Enter text
                </Label>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-6 flex items-center gap-2">
                <Switch
                  checked={false}
                  disabled
                  onCheckedChange={() => undefined}
                />
                <Label htmlFor="age1 " className="mb-0">
                  Enter text
                </Label>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-6 flex items-center gap-2">
                <Switch
                  checked={true}
                  disabled
                  onCheckedChange={() => undefined}
                />
                <Label htmlFor="age1 " className="mb-0">
                  Enter text
                </Label>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-4 col-span-12">
            <div className="mt-6">
              <div className="mb-1 block">
                <Label htmlFor="default-range" className="mb-0">
                  Slider
                </Label>
              </div>
              <Slider id="default-range" />
              <div className="flex items-center justify-between mt-3">
                <div>
                  <div className="col-span-6">
                    <Select
                      onValueChange={handleSelectChange}
                      value={selectedValue}
                    >
                      <SelectTrigger className="w-fit">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="One">One</SelectItem>
                        <SelectItem value="Two">Two</SelectItem>
                        <SelectItem value="Three">Three</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <div className="col-span-6">
                    <Select
                      onValueChange={handleSelectChange}
                      value={selectedValue}
                    >
                      <SelectTrigger className="w-fit">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="One">One</SelectItem>
                        <SelectItem value="Two">Two</SelectItem>
                        <SelectItem value="Three">Three</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 sm:gap-6 gap-6">
          <div className="lg:col-span-4 col-span-12">
            <div className="mt-6">
              <Progress value={45} />
              <div className="flex items-center justify-between mt-3">
                <IconVolume2 stroke={2} />
                <IconVolume stroke={2} />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 pt-[1.875rem] gap-6">
          <div className="md:col-span-2 col-span-6">
            <Button>Add New</Button>
          </div>
          <div className="md:col-span-2 col-span-6">
            <Button variant="secondary" disabled>
              Add New
            </Button>
          </div>
          <div className="md:col-span-2 col-span-6">
            <Button variant="success">Success</Button>
          </div>
          <div className="md:col-span-2 col-span-6">
            <Button variant="info">Info</Button>
          </div>
          <div className="md:col-span-2 col-span-6">
            <Button variant="warning">Warning</Button>
          </div>
          <div className="md:col-span-2 col-span-6">
            <Button variant="error">Danger</Button>
          </div>
        </div>
      </TitleCard>
    </>
  );
};

export default FormCustom;
