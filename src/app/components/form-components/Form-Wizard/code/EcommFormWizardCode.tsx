"use client";
import React from "react";
import { useState } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@iconify/react";
import { format } from "date-fns";

function PreviewForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const cartItemSchema = z.object({
    productName: z
      .string({ error: "Product name is required." })
      .min(1, "Product name cannot be empty."),
    quantity: z
      .number({ error: "Quantity is required." })
      .int("Quantity must be an integer.")
      .min(1, "Quantity must be greater than 0."),
    unitPrice: z
      .number({ error: "Unit price is required." })
      .min(0.01, "Unit price must be greater than 0."),
  });
  const formSchema = z.object({
    customerInfo: z.object({
      fullName: z
        .string({ error: "Full Name is required." })
        .min(1, "Full Name cannot be empty."),
      email: z
        .string({ error: "Email is required." })
        .email("Invalid email format."),
      phone: z
        .string({ error: "Phone number is required." })
        .regex(/^\+?\d{10,15}$/, "Invalid phone number format."),
      address: z.object({
        street: z
          .string({ error: "Street Address is required." })
          .min(1, "Street Address cannot be empty."),
        city: z
          .string({ error: "City is required." })
          .min(1, "City cannot be empty."),
        zipCode: z
          .string({ error: "ZIP Code is required." })
          .regex(/^\d{5}$/, "ZIP Code must be 5 digits."),
      }),
    }),
    cartItems: z
      .array(cartItemSchema)
      .min(1, "Please add at least one item to your cart."),
    shippingMethod: z.enum(["standard", "express"], {
      error: "Please select a shipping method.",
    }),
    paymentMethod: z.enum(["credit_card", "paypal", "cod"], {
      error: "Please select a payment method.",
    }),
    creditCard: z
      .object({
        cardNumber: z
          .string({ error: "Card number is required." })
          .regex(/^\d{16}$/, "Card number must be 16 digits.")
          .optional(),
        expirationDate: z
          .string({ error: "Expiration date is required." })
          .regex(
            /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
            "Invalid expiration date (MM/YY)."
          )
          .optional(),
        cvv: z
          .string({ error: "CVV is required." })
          .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits.")
          .optional(),
      })
      .optional(),
  });
  const defaultValues = {
    customerInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        zipCode: "",
      },
    },
    cartItems: [{ productName: "", quantity: 0, unitPrice: 0 }],
    shippingMethod: "standard",
    paymentMethod: "credit_card",
    creditCard: {
      cardNumber: "",
      expirationDate: "",
      cvv: "",
    },
  };
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onTouched",
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cartItems",
  });
  const watchPaymentMethod = form.watch("paymentMethod");
  const getSubtotal = (item: any) => {
    return (item.quantity || 0) * (item.unitPrice || 0);
  };
  const getTotal = () => {
    const items = form.getValues("cartItems");
    return items.reduce((acc: number, item: any) => acc + getSubtotal(item), 0);
  };
  const steps = [
    "Customer Info",
    "Cart Items",
    "Shipping & Payment",
    "Review & Confirm",
  ];
  const handleNext = async (currentStep: any) => {
    let isValid = false;
    switch (currentStep) {
      case 0: // Customer Info
        isValid = await form.trigger([
          "customerInfo.fullName",
          "customerInfo.email",
          "customerInfo.phone",
          "customerInfo.address.street",
          "customerInfo.address.city",
          "customerInfo.address.zipCode",
        ]);
        break;
      case 1: // Cart Items
        isValid = await form.trigger("cartItems");
        break;
      case 2: // Shipping & Payment
        const paymentFields = ["shippingMethod", "paymentMethod"];
        if (watchPaymentMethod === "credit_card") {
          paymentFields.push(
            "creditCard.cardNumber",
            "creditCard.expirationDate",
            "creditCard.cvv"
          );
        }
        isValid = await form.trigger(paymentFields);
        break;
      default:
        isValid = true;
    }
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const onSubmit = (data: any) => {
    alert(JSON.stringify(data, null, 2));
  };
  return (
    <div className="max-w-full w-full mx-auto p-0 border-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Stepper Header */}
          <div className="flex justify-between items-center mb-6">
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                      index === currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm mt-1 text-center">{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Step 1: Customer Info */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Customer Information</h2>
              <FormField
                control={form.control}
                name="customerInfo.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerInfo.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="john.doe@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerInfo.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+15551234567" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerInfo.address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123 Main St" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerInfo.address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Anytown" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerInfo.address.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="12345" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          {/* Step 2: Cart Items */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Cart Items</h2>
              {fields.map((item, index) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Item {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Icon icon="lucide:trash" className="h-4 w-4 mr-2" />{" "}
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`cartItems.${index}.productName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Product A" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`cartItems.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              {...field}
                              value={
                                field.value === undefined ||
                                field.value === null
                                  ? ""
                                  : String(field.value)
                              }
                              onChange={(event) =>
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
                    <FormField
                      control={form.control}
                      name={`cartItems.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10.00"
                              step="0.01"
                              {...field}
                              value={
                                field.value === undefined ||
                                field.value === null
                                  ? ""
                                  : String(field.value)
                              }
                              onChange={(event) =>
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
                  <p className="text-sm text-muted-foreground mt-2">
                    Subtotal: $
                    {getSubtotal(form.getValues(`cartItems.${index}`)).toFixed(
                      2
                    )}
                  </p>
                </Card>
              ))}
              {form.formState.errors.cartItems && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {(form.formState.errors.cartItems as any)?.message}
                </p>
              )}
              <Button
                type="button"
                onClick={() =>
                  append({ productName: "", quantity: 0, unitPrice: 0 })
                }
              >
                <Icon icon="lucide:plus-circle" className="h-4 w-4 mr-2" /> Add
                Item
              </Button>
              <div className="mt-4 text-lg font-bold">
                Total: ${getTotal().toFixed(2)}
              </div>
            </div>
          )}
          {/* Step 3: Shipping & Payment */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Shipping & Payment</h2>
              {/* Shipping Method */}
              <FormField
                control={form.control}
                name="shippingMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Shipping Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="standard" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Standard (5-7 business days)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="express" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Express (1-2 business days)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              {/* Payment Method */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="credit_card" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Credit Card
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="paypal" />
                          </FormControl>
                          <FormLabel className="font-normal">PayPal</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="cod" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Cash on Delivery (COD)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Conditional Credit Card Fields */}
              {watchPaymentMethod === "credit_card" && (
                <Card className="p-4 space-y-4">
                  <h3 className="text-lg font-semibold">Credit Card Details</h3>
                  <FormField
                    control={form.control}
                    name="creditCard.cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="xxxx xxxx xxxx xxxx" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="creditCard.expirationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration Date (MM/YY)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="MM/YY" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="creditCard.cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="XXX" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              )}
            </div>
          )}
          {/* Step 4: Review & Confirm */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                Review & Confirm Your Order
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Full Name:</strong>{" "}
                    {form.getValues("customerInfo.fullName")}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {form.getValues("customerInfo.email")}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {form.getValues("customerInfo.phone")}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {form.getValues("customerInfo.address.street")},{" "}
                    {form.getValues("customerInfo.address.city")},{" "}
                    {form.getValues("customerInfo.address.zipCode")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {form.getValues("cartItems").map((item: any, index: any) => (
                    <div
                      key={index}
                      className="flex justify-between border-b pb-1 last:border-b-0"
                    >
                      <span>
                        {item.productName} (x{item.quantity})
                      </span>
                      <span>${getSubtotal(item).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-2">
                    <span>Total:</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Shipping & Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Shipping Method:</strong>{" "}
                    {form.getValues("shippingMethod") === "standard"
                      ? "Standard"
                      : "Express"}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {form.getValues("paymentMethod") === "credit_card"
                      ? "Credit Card"
                      : form.getValues("paymentMethod") === "paypal"
                      ? "PayPal"
                      : "Cash on Delivery"}
                  </p>
                  {form.getValues("paymentMethod") === "credit_card" && (
                    <div className="pl-4">
                      <p>
                        <strong>Card Number:</strong> **** **** ****{" "}
                        {form.getValues("creditCard.cardNumber")?.slice(-4)}
                      </p>
                      <p>
                        <strong>Expiration Date:</strong>{" "}
                        {form.getValues("creditCard.expirationDate")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button type="button" onClick={handleBack} variant="outline">
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button
                type="button"
                onClick={() => handleNext(currentStep)}
                className="ml-auto"
              >
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="submit" className="ml-auto">
                Confirm Order
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PreviewForm;
