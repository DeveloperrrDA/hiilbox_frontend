import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primaryemphasis",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
        outlinesecondary:
          "border border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
        outlinesuccess:
          "border border-primary bg-transparent hover:bg-primary text-primary hover:text-white",
        outlinewarning:
          "border border-primary bg-transparent hover:bg-primary text-primary hover:text-white",
        outlineinfo:
          "border border-primary bg-transparent hover:bg-primary text-primary hover:text-white",
        outlineerror:
          "border border-error bg-transparent hover:bg-error text-error hover:text-white",
        outlinewhite:
          "bg-transparent border border-white hover:bg-white text-white hover:text-primary",
        secondary: "bg-primary text-white hover:bg-primaryemphasis",
        success: "bg-primary text-white hover:bg-primaryemphasis",
        warning: "bg-primary text-white hover:bg-primaryemphasis",
        info: "bg-primary text-white hover:bg-primaryemphasis",
        error: "bg-error text-white hover:bg-erroremphasis",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        ghostprimary: "hover:bg-lightprimary hover:text-primary text-primary",
        ghostsecondary:
          "hover:bg-lightprimary hover:text-primary text-primary",
        ghostsuccess: "hover:bg-lightprimary hover:text-primary text-primary",
        ghostwarning: "hover:bg-lightprimary hover:text-primary text-primary",
        ghosterror: "hover:bg-lighterror hover:text-error text-error",
        ghostinfo: "hover:bg-lightprimary hover:text-primary text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        lightprimary:
          "bg-lightprimary text-primary hover:bg-primary hover:text-white",
        lightsecondary:
          "bg-lightprimary text-primary hover:bg-primary hover:text-white",
        lightsuccess:
          "bg-lightprimary text-primary hover:bg-primary hover:text-white",
        lightwarning:
          "bg-lightprimary text-primary hover:bg-primary hover:text-white",
        lightinfo: "bg-lightprimary text-primary hover:bg-primary hover:text-white",
        lighterror: "bg-lighterror text-error hover:bg-error hover:text-white",
        white: "bg-white text-primary hover:bg-white/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      shape: {
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, shape, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className, shape }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
