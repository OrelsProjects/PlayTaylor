"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "./ui/radioGroup";
import { Label } from "./ui/label";
import useGame from "../lib/hooks/useGame";

export function ThemeToggle() {
  const { resolvedTheme } = useTheme();
  const { setTheme } = useGame();

  const isDark = React.useMemo(() => {
    return resolvedTheme === "battery-save";
  }, [resolvedTheme]);

  return (
    <RadioGroup
      defaultValue={isDark ? "battery-save" : "colourful"}
      onValueChange={value => {
        const isDark = value === "battery-save";
        setTheme(isDark);
      }}
      className="flex flex-col gap-0 text-secondary-foreground"
    >
      <div className="flex items-center py-[18px] space-x-[14px]">
        <RadioGroupItem value="battery-save" id="battery-save" />
        <Label
          htmlFor="battery-save"
          className="text-primary dark:text-secondary-foreground"
        >
          Black and white
        </Label>
      </div>
      <div className="flex items-center py-[18px] space-x-[14px]">
        <RadioGroupItem value="colourful" id="colourful" />
        <Label
          htmlFor="colourful"
          className="text-primary dark:text-secondary-foreground"
        >
          Screaming colors
        </Label>
      </div>
    </RadioGroup>
  );
}
