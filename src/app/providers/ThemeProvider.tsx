"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      themes={["light", "battery-save", "blossom", "midnight", "sun"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
