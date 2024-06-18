"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { cn } from "../lib/utils";
import { EventTracker } from "../eventTracker";
import { RadioGroup, RadioGroupItem } from "./ui/radioGroup";
import { Label } from "./ui/label";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, theme, systemTheme } = useTheme();

  const isDark = React.useMemo(
    () => (theme === "system" ? systemTheme === "dark" : theme === "dark"),
    [theme],
  );

  return (
    <RadioGroup
      defaultValue={isDark ? "battery-save" : "colourful"}
      onValueChange={value => {
        const newTheme = value === "battery-save" ? "dark" : "light";
        setTheme(newTheme);
      }}
      className="flex flex-col gap-0"
    >
      <div className="flex items-center py-[18px] space-x-[14px]">
        <RadioGroupItem value="battery-save" id="battery-save" />
        <Label htmlFor="battery-save">Battery saving</Label>
      </div>
      <div className="flex items-center py-[18px] space-x-[14px]">
        <RadioGroupItem value="colourful" id="colourful" />
        <Label htmlFor="colourful">Colourful</Label>
      </div>
    </RadioGroup>
  );
}
