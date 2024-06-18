import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "../lib/hooks/redux";
import { UserAvatar } from "./ui/avatar";
import { Icons } from "./ui/icons";
import { usePathname, useRouter } from "next/navigation";

interface NavIconContainerProps {}

const NavIconContainer: React.FC<NavIconContainerProps> = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [icon, setIcon] = useState<React.ReactNode>(
    <Icons.Settings className="h-5 w-5" />,
  );
  const [path, setPath] = useState<string>("");
  const [onClick, setOnClick] = useState<() => void>(() => {});
  const { state } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (pathname.includes("settings")) {
      setIcon(<Icons.Home className="h-5 w-5" />);
      setPath("/home");
    } else if (pathname.includes("instructions")) {
      setIcon(<Icons.Return className="h-5 w-5" />);
      setOnClick(() => () => {
        router.back();
      });
      setPath("");
    } else {
      setIcon(<Icons.Settings className="h-5 w-5" />);
      setPath("/settings");
    }
  }, [pathname]);

  return (
    state === "authenticated" && (
      <div className="rounded-lg w-full flex flex-col items-end">
        <Link
          href={path}
          className="w-fit h-fit p-1 rounded-full border-foreground border-[1px]"
          onClick={onClick}
        >
          {icon}
        </Link>
      </div>
    )
  );
};

export default NavIconContainer;
