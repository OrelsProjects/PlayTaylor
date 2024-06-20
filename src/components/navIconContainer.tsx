import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "../lib/hooks/redux";
import { Icons } from "./ui/icons";
import { usePathname, useRouter } from "next/navigation";
import InstructionsContainer from "./instructionsContainer";

interface NavIconContainerProps {}

const NavIconContainer: React.FC<NavIconContainerProps> = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [icon, setIcon] = useState<React.ReactNode>(
    <Icons.Settings className="h-5 w-5" />,
  );
  const [path, setPath] = useState<string>("");
  const [onClick, setOnClick] = useState<() => void>(() => {});

  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (pathname.includes("settings")) {
      setIcon(<Icons.Return className="h-5 w-5" />);
      setPath("");
      setOnClick(() => () => {
        router.back();
      });
    } else if (pathname.includes("games")) {
      setIcon(<Icons.Home className="h-5 w-5 fill-primary" />);
      setPath("/home");
    } else {
      setIcon(<Icons.Settings className="h-5 w-5 fill-primary" />);
      setPath("/settings");
      setOnClick(() => () => {});
    }

    if (pathname.includes("/games/")) {
      setShowInstructions(true);
    } else {
      setShowInstructions(false);
    }
  }, [pathname]);

  return (
    <div className="rounded-lg w-full flex flex-row items-center justify-end gap-2.5">
      {showInstructions && <InstructionsContainer />}
      <Link
        href={path}
        className="w-fit h-fit p-1 rounded-full border-primary border-[1px]"
        onClick={onClick}
      >
        {icon}
      </Link>
    </div>
  );
};

export default NavIconContainer;
