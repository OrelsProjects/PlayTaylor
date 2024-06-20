"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "./ui/radioGroup";
import { Label } from "./ui/label";
import { useAppSelector } from "../lib/hooks/redux";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, theme, systemTheme } = useTheme();
  const { theme: currentTheme } = useAppSelector(state => state.theme);

  const isDark = React.useMemo(
    () => (theme === "system" ? systemTheme === "dark" : theme === "dark"),
    [theme],
  );

  return (
    <RadioGroup
      defaultValue={isDark ? "battery-save" : "colourful"}
      onValueChange={value => {
        if (value === "battery-save") {
          setTheme("dark");
        } else {
          setTheme(currentTheme);
        }
      }}
      className="flex flex-col gap-0 text-secondary-foreground"
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
