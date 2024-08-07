import React from "react";
import { cn } from "../lib/utils";
import { montserratAlternates } from "../lib/utils/fontUtils";

export default function RoomNameComponent({ name }: { name: string }) {
  return (
    <h3
      className={cn(
        "inline-block text-[32px] leading-[32px] font-medium gradient-purple bg-clip-text text-transparent",
        montserratAlternates.className,
      )}
    >
      {/* {name} */}
      Eras Tour 2024
    </h3>
  );
}
