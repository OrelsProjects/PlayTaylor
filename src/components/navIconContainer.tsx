import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "../lib/hooks/redux";
import { Icons } from "./ui/icons";
import { usePathname } from "next/navigation";
import InstructionsContainer from "./instructionsContainer";
import { Button } from "./ui/button";
import { RiAdminFill } from "react-icons/ri";

interface NavIconContainerProps {}

const NavIconContainer: React.FC<NavIconContainerProps> = () => {
  const pathname = usePathname();
  const { user } = useAppSelector(state => state.auth);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (pathname.includes("/games/")) {
      setShowInstructions(true);
    } else {
      setShowInstructions(false);
    }
  }, [pathname]);

  return (
    <div className="rounded-lg w-full flex flex-row items-center justify-end gap-2.5">
      {user?.role === "admin" && (
        <Link
          href="/admin"
          className="w-fit h-fit p-1 rounded-full border-primary border-[1px] self-start mr-auto"
        >
          <RiAdminFill className="h-5 w-5 text-primary" />
        </Link>
      )}
      <Link
        href="/settings"
        className="w-fit h-fit p-1 rounded-full border-primary border-[1px]"
      >
        <Icons.Settings className="h-5 w-5 fill-primary" />
      </Link>
      {showInstructions && <InstructionsContainer />}
      <Link
        href="/room"
        className="w-fit h-fit p-1 rounded-full border-primary border-[1px]"
      >
        <Icons.Home className="h-5 w-5 fill-primary" />
      </Link>
    </div>
  );
};

export default NavIconContainer;
