import React from "react";
import Link from "next/link";
import { useAppSelector } from "../lib/hooks/redux";
import { UserAvatar } from "./ui/avatar";
import { Icons } from "./ui/icons";

interface SettingsComponentProps {}

const SettingsComponent: React.FC<SettingsComponentProps> = () => {
  const { user, state } = useAppSelector(state => state.auth);

  return (
    state === "authenticated" && (
      <div className="p-2 rounded-lg w-full flex flex-col items-end">
        <Link
          href="/settings"
          className="w-fit h-fit p-1 rounded-full border-foreground border-[1px]"
        >
          <Icons.Settings className="h-5 w-5" />
        </Link>
      </div>
    )
  );
};

export default SettingsComponent;
