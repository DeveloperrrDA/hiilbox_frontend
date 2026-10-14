"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@iconify/react";

function RegistrationFormCode() {
  const formSchema = z.object({
    fullName: z
      .string({ error: "Full Name is required." })
      .min(1, "Full Name is required."),
    email: z
      .string({ error: "Email is required." })
      .email("Invalid email address."),
    age: z
      .number({ error: "Age is required." })
      .int("Age must be an integer.")
      .min(18, "You must be at least 18 years old."),
    address: z.object({
      street: z
        .string({ error: "Street address is required." })
        .min(1, "Street address is required."),
      city: z
        .string({ error: "City is required." })
        .min(1, "City is required."),
      zipCode: z
        .string({ error: "ZIP Code is required." })
        .regex(/^\d{5}$/, "ZIP Code must be 5 digits."),
    }),
    phoneNumbers: z
      .array(
        z
          .string({ error: "Phone number is required." })
          .min(1, "Phone number cannot be empty.")
      )
      .min(1, "At least one phone number is required."),
    employmentType: z.enum(["Full-time", "Part-time", "Contract"], {
      error: "Please select an employment type.",
    }),
    skills: z.array(z.string()).min(1, "Please select at least one skill."),
    openToRemote: z.boolean().default(false),
  });
  const defaultValues = {
    fullName: "",
    email: "",
    age: 0,
    address: {
      street: "",
      city: "",
      zipCode: "",
    },
    phoneNumbers: [""],
    employmentType: "Full-time",
    skills: [],
    openToRemote: false,
  };
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phoneNumbers",
  });
  const onSubmit = (data: any) => {
    alert(JSON.stringify(data, null, 2));
  };
  const skillsOptions = [
    "React",
    "Node.js",
    "TypeScript",
    "AWS",
    "Docker",
    "Kubernetes",
    "SQL",
    "NoSQL",
  ];
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as any)}
        className="max-w-full space-y-8 mt-3"
      >
        <div className="grid grid-cols-12 gap-4 ">
          <div className="lg:col-span-6 col-span-12">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="lg:col-span-6 cols-span-12">
            <FormField
              control={form.control}
              name="email"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="lg:col-span-6 col-span-12">
            <FormField
              control={form.control}
              name="age"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      {...field}
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : String(field.value)
                      }
                      onChange={(event: any) =>
                        field.onChange(
                          event.target.value === ""
                            ? undefined
                            : +event.target.value
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="lg:col-span-6 col-span-12">
            <FormField
              control={form.control}
              name={`phoneNumber`}
              render={({ field }: any) => (
                <FormItem className="flex-grow">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="555-123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 col-span-1">
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Anytown" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.zipCode"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Job Preferences</h3>
          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Employment Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skills"
            render={() => (
              <FormItem className="mt-4">
                <FormLabel>Skills</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {skillsOptions.map((skill: string) => (
                    <FormField
                      key={skill}
                      control={form.control}
                      name="skills"
                      render={({ field }: any) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(skill)}
                              onCheckedChange={(checked: boolean) => {
                                return checked
                                  ? field.onChange([...field.value, skill])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: any) => value !== skill
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{skill}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
                {form.formState.errors.skills && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.skills.message as any}
                  </p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="openToRemote"
            render={({ field }: any) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-ld p-4 mt-6">
                <FormLabel className="text-base">Open to Remote Work</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="m-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit Application</Button>
      </form>
    </Form>
  );
}

export default RegistrationFormCode;
