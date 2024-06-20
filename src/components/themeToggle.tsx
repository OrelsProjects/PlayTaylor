"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "./ui/radioGroup";
import { Label } from "./ui/label";
import { useAppDispatch, useAppSelector } from "../lib/hooks/redux";
import {
  Theme,
  setTheme as setThemeAction,
} from "../lib/features/game/gameSlice";
import useGame from "../lib/hooks/useGame";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const dispatch = useAppDispatch();
  const { theme: currentTheme } = useAppSelector(state => state.game);
  const { theme, systemTheme } = useTheme();
  const { setTheme } = useGame();

  const isDark = React.useMemo(
    () => (theme === "system" ? systemTheme === "dark" : theme === "dark"),
    [theme],
  );

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
        <Label htmlFor="battery-save">Black and white</Label>
      </div>
      <div className="flex items-center py-[18px] space-x-[14px]">
        <RadioGroupItem value="colourful" id="colourful" />
        <Label htmlFor="colourful">Screaming colors</Label>
      </div>
    </RadioGroup>
  );
}
