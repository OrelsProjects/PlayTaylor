import React from "react";

export default function RoomTag({ value }: { value: string }) {
  return (
    <div className="py-1 px-3 bg-background rounded-full border-2">
      <span className="text-xs text-secondary">{value}</span>
    </div>
  );
}
