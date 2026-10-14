"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Icon } from "@iconify/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

function HealthCareFormWizardCode() {
  const accountSchema = z
    .object({
      username: z.string().min(1, "Username is required."),
      email: z
        .string()
        .min(1, "Email is required.")
        .email("Invalid email address."),
      password: z.string().min(6, "Password must be at least 6 characters."),
      confirmPassword: z.string().min(1, "Confirm password is required."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });
  const personalSchema = z.object({
    fullName: z.string().min(1, "Full Name is required."),
    dob: z
      .date({
        error: "Date of Birth is required.",
      })
      .refine((date) => {
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        return date <= eighteenYearsAgo;
      }, "You must be at least 18 years old."),
    phoneNumber: z
      .string()
      .min(1, "Phone Number is required.")
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        "Invalid phone number format (e.g., +1234567890)."
      ),
    address: z.string().min(1, "Address is required."),
    gender: z.enum(["male", "female", "other"], {
      error: "Please select a gender.",
    }),
  });
  const socialSchema = z.object({
    linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
    twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
    github: z.string().url("Invalid URL").optional().or(z.literal("")),
  });
  const formSchema = z.intersection(
    accountSchema,
    z.intersection(personalSchema, socialSchema)
  );
  const defaultValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dob: new Date(2000, 0, 1),
    phoneNumber: "",
    address: "",
    gender: "male",
    linkedin: "",
    twitter: "",
    github: "",
  };
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      id: "Account Details",
      fields: ["username", "email", "password", "confirmPassword"],
    },
    {
      id: "Personal Info",
      fields: ["fullName", "dob", "phoneNumber", "address", "gender"],
    },
    {
      id: "Social Links",
      fields: ["linkedin", "twitter", "github"],
    },
  ];
  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep].fields as any;
    const isValid = await form.trigger(fieldsToValidate, { shouldFocus: true });
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  const onSubmit = (data: any) => {
    alert(JSON.stringify(data, null, 2));
  };
  return (
    // <div className="flex w-full max-w-full min-h-fit  ">
    <div className="flex flex-col md:flex-row w-full max-w-full min-h-fit">
      {/* <aside className="w-1/4 bg-gray-50 dark:bg-dark  p-6 border-r  border-ld flex flex-col  justify-start items-start "> */}
      <aside className="w-full md:w-1/4 bg-gray-50 dark:bg-dark p-6 border-r border-ld flex flex-col justify-start items-start">
        <h2 className="text-xl font-bold mb-6">Steps</h2>
        <nav className="flex flex-col gap-4 w-full">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors whitespace-nowrap",
                currentStep === index
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              onClick={() => setCurrentStep(index)}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  currentStep === index
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {index + 1}
              </div>
              <span>{step.id}</span>
            </div>
          ))}
        </nav>
      </aside>
      {/* <main className="w-3/4 p-8 flex flex-col justify-start"> */}
      <main className="w-full md:w-3/4 p-8 flex flex-col justify-start">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-full"
          >
            {currentStep === 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4 whitespace-nowrap">
                  Account Details
                </h3>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      {form.formState.errors.username && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.username.message as any}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      {form.formState.errors.email && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.email.message as any}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      {form.formState.errors.password && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.password.message as any}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      {form.formState.errors.confirmPassword && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.confirmPassword.message as any}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            )}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">
                  Personal Information
                </h3>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      {form.formState.errors.fullName && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.fullName.message as any}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Icon
                                icon="lucide:calendar"
                                className="ml-auto h-4 w-4 opacity-50"
                              />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {form.formState.errors.dob && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.dob.message as any}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      {form.formState.errors.phoneNumber && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.phoneNumber.message as any}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      {form.formState.errors.address && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.address.message as any}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="other" />
                            </FormControl>
                            <FormLabel className="font-normal">Other</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      {form.formState.errors.gender && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.gender.message as any}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">
                  Social Links (Optional)
                </h3>
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/..."
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.linkedin && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.linkedin.message as any}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Profile URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/..."
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.twitter && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.twitter.message as any}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Profile URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/..."
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.github && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.github.message as any}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div className="flex justify-between mt-8">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="outline"
                >
                  <Icon icon="lucide:chevron-left" className="mr-2 h-4 w-4" />{" "}
                  Previous
                </Button>
              )}
              <div className="flex-grow" />
              {currentStep < steps.length - 1 && (
                <Button type="button" onClick={handleNext}>
                  Next{" "}
                  <Icon icon="lucide:chevron-right" className="ml-2 h-4 w-4" />
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}

export default HealthCareFormWizardCode;
