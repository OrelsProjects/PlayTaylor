import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  button?: {
    showForMobile?: boolean;
    buttonText: string;
    onButtonClick: () => void;
  };
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, button, ...props }, ref) => {
    return (
      <div className="w-full h-full flex flex-col gap-0.5 relative">
        {label && (
          <label className="text-xs text-foreground font-normal">
            {label}
          </label>
        )}
        <div className="h-fit flex flex-col relative">
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-primary/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-md relative",
              { "border-[1px] border-destructive": error },
              className,
            )}
            ref={ref}
            {...props}
          ></input>
          {button && (
            <Button
              className={cn(
                "absolute h-full right-0 rounded-none rounded-r-md",
                {
                  "hidden md:flex": !button.showForMobile,
                },
              )}
              onClick={button.onButtonClick}
            >
              {button.buttonText}
            </Button>
          )}
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
