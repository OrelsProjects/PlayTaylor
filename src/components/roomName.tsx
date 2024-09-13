import React from "react";
import { cn } from "../lib/utils";
import { montserratAlternates } from "../lib/utils/fontUtils";

export default function RoomNameComponent({
  name,
  type = "full",
}: {
  name: string;
  type?: "full" | "compact";
}) {
  return (
    <h3
      className={cn(
        "inline-block text-[32px] leading-[32px] font-medium",
        montserratAlternates.className,
        type === "compact"
          ? "text-base font-medium text-secondary"
          : "text-primary-gradient",
      )}
    >
      {name}
    </h3>
  );
}
