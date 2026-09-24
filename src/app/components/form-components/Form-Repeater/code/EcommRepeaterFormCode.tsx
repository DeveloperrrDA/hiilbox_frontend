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
import { Icon } from "@iconify/react";

function EcommRepeaterFormCode() {
  const itemSchema = z.object({
    itemName: z
      .string({ error: "Item Name is required." })
      .min(1, "Item Name cannot be empty."),
    quantity: z
      .number({ error: "Quantity is required." })
      .int("Quantity must be an integer.")
      .min(1, "Quantity must be at least 1."),
    unitPrice: z
      .number({ error: "Unit Price is required." })
      .min(0.01, "Unit Price must be positive."),
  });
  const formSchema = z.object({
    items: z.array(itemSchema).min(1, "At least one item is required."),
  });
  const defaultValues = {
    items: [{ itemName: "", quantity: 1, unitPrice: 0.01 }],
  };
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  const onSubmit = (data: any) => {
    alert(JSON.stringify(data, null, 2));
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-full mt-2"
      >
        <div>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row gap-4 mb-4 p-4 border rounded-md"
            >
              <FormField
                control={form.control}
                name={`items.${index}.itemName`}
                render={({ field: itemField }: any) => (
                  <FormItem className="w-full">
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Laptop" {...itemField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field: itemField }: any) => (
                  <FormItem className="w-full">
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...itemField}
                        value={
                          itemField.value === undefined ||
                          itemField.value === null
                            ? ""
                            : String(itemField.value)
                        }
                        onChange={(event) =>
                          itemField.onChange(
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
              <FormField
                control={form.control}
                name={`items.${index}.unitPrice`}
                render={({ field: itemField }: any) => (
                  <FormItem className="w-full">
                    <FormLabel>Unit Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100.00"
                        {...itemField}
                        value={
                          itemField.value === undefined ||
                          itemField.value === null
                            ? ""
                            : String(itemField.value)
                        }
                        onChange={(event) =>
                          itemField.onChange(
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
              <div className="flex gap-2 items-end">
                <Button
                  type="button"
                  onClick={() =>
                    append({ itemName: "", quantity: 1, unitPrice: 0.01 })
                  }
                  variant="outline"
                  className="w-fit"
                >
                  <Icon icon="lucide:plus" className="h-4 w-4" />
                </Button>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    className="w-fit text-white"
                  >
                    <Icon icon="lucide:trash-2" className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm font-medium text-destructive mt-2">
          {form.formState.errors.items?.message as any}
        </p>
        <div className="flex items-center gap-4">
          <Button type="submit" className="w-fit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default EcommRepeaterFormCode;
