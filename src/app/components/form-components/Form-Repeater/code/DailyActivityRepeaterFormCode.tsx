"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
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

function DailyActivityRepeaterFormCode() {
  const activitySchema = z.object({
    time: z
      .string({ error: "Time is required." })
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Time must be in HH:mm format (e.g., 09:30)."
      ),
    activityTitle: z
      .string({ error: "Activity Title is required." })
      .min(1, "Activity Title cannot be empty."),
  });
  const formSchema = z.object({
    activities: z
      .array(activitySchema)
      .min(1, "Please add at least one activity."),
  });
  const defaultValues = {
    activities: [{ time: "09:00", activityTitle: "Morning Meeting" }],
  };
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "activities",
  });
  const onSubmit = async (data: any) => {
    alert(JSON.stringify(data, null, 2));
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-full mt-2"
      >
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row gap-4 border border-ld p-4 rounded-md"
          >
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`activities.${index}.time`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time (HH:mm)</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="HH:mm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`activities.${index}.activityTitle`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g., Standup Meeting"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-end justify-end gap-2 sm:justify-start">
              <Button
                type="button"
                onClick={() => append({ time: "", activityTitle: "" })}
                className="w-10 h-10"
              >
                <Icon icon="mdi:plus" className="h-4 w-4 " />
              </Button>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  className="w-10 h-10 text-white"
                >
                  <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                  <span className="sr-only">Remove activity</span>
                </Button>
              )}
            </div>
          </div>
        ))}
        {form.formState.errors.activities && (
          <p className="text-sm font-medium text-destructive mt-2">
            {form.formState.errors.activities.message as any}
          </p>
        )}
        <div className="flex items-center gap-4">
          <Button type="submit" className="w-fit mt-0">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default DailyActivityRepeaterFormCode;
