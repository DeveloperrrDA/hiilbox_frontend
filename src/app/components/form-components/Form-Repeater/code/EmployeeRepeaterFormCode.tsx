"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
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
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

function EmployeeRepeaterFormCode() {
  const teamMemberSchema = z.object({
    name: z.string().min(1, { error: "Team member name is required." }),
    role: z.string().min(1, { error: "Role is required." }),
    email: z.string().email({ error: "Please enter a valid email address." }),
  });
  const formSchema = z.object({
    teamMembers: z
      .array(teamMemberSchema)
      .min(2, { error: "At least 2 team members are required." }),
  });
  const defaultValues = {
    teamMembers: [
      { name: "", role: "", email: "" },
      { name: "", role: "", email: "" },
    ],
  };
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });
  function onSubmit(data: any) {
    alert(JSON.stringify(data, null, 2));
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-full mt-2"
      >
        <div className="space-y-4">
          {fields.map((field: any, index: number) => (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row gap-4 items-end border border-ld p-4 rounded-md"
            >
              <FormField
                control={form.control}
                name={`teamMembers.${index}.name`}
                render={({ field: memberNameField }: any) => (
                  <FormItem className="w-full">
                    <FormLabel>Team Member Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...memberNameField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`teamMembers.${index}.role`}
                render={({ field: memberRoleField }: any) => (
                  <FormItem className="w-full">
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Developer" {...memberRoleField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`teamMembers.${index}.email`}
                render={({ field: memberEmailField }: any) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@example.com"
                        {...memberEmailField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  className="mt-2 md:mt-0 text-white"
                >
                  <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {form.formState.errors.teamMembers && (
          <p className="text-sm font-medium text-destructive mt-2">
            {form.formState.errors.teamMembers.message as any}
          </p>
        )}
        <div className="flex justify-between gap-2">
          <Button type="submit">Submit</Button>
          <Button
            type="button"
            variant="outline"
            className=""
            onClick={() => append({ name: "", role: "", email: "" })}
          >
            <Icon icon="mdi:plus" className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default EmployeeRepeaterFormCode;
