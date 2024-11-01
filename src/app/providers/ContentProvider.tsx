"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { useTheme } from "next-themes";

interface ContentProviderProps {
  children: React.ReactNode;
}

const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "h-full w-full lg:max-w-[65rem] mx-auto lg:flex relative",
      )}
    >
      <div className="w-full h-full flex flex-col gap-4 relative z-10 overflow-visible scrollbar-hide md:scrollbar-visible md:px-4">
        {children}
      </div>
    </div>
  );
};

export default ContentProvider;
