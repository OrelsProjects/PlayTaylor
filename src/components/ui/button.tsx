import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import Loading from "./loading";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow gradient-purple",
        success:
          "bg-success text-success-foreground shadow sm:hover:bg-primary/90",
        warning:
          "bg-warning text-warning-foreground shadow sm:hover:bg-warning/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm sm:hover:bg-destructive/90",
        outline:
          "border border-primary text-primary bg-transparent shadow-sm sm:hover:bg-primary sm:hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm sm:hover:bg-secondary/80",
        ghost: "sm:hover:bg-accent sm:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 sm:hover:underline",
      },
      size: {
        default: "h-9 px-[24px] py-2.5",
        sm: "h-8 rounded-full px-3 text-xs",
        lg: "h-10 rounded-full px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingClassName?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    console.log(props.isLoading);
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <Loading
          className={cn({ hidden: !props.isLoading })}
          spinnerClassName={cn("w-5 h-5 fill-secondary", props.loadingClassName)}
        />
        <div className={cn({ hidden: props.isLoading })}>{props.children}</div>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
