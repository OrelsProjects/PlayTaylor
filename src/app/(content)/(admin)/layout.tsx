/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import { usePathname, useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import { useSession } from "next-auth/react";
import { setUserEventTracker } from "../../../eventTracker";
import {
  selectAuth,
  setUser as setUserAction,
} from "../../../lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks/redux";
import { setUserLogger } from "../../../logger";
import AppUser from "../../../models/appUser";
import RoomNameComponent from "../../../components/roomName";
import RoomTag from "../../../components/roomTag";
import { Button } from "../../../components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { gameName, participantsCount, questionsCount, difficulty, pin } =
    useAppSelector(state => state.game);

  const showPin = useMemo(() => {
    return !pathname.includes("create") && pin;
  }, [pin, pathname]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start pt-10 relative">
      <div className="w-full h-fit mx-auto flex flex-col justify-center items-center gap-6">
        {gameName && <RoomNameComponent name={gameName} />}
        <div className="flex flex-row gap-2">
          {(participantsCount || 0) > 0 && (
            <RoomTag value={`${participantsCount} Participants`} />
          )}
          {difficulty && <RoomTag value={`${difficulty}`} />}
          {questionsCount && <RoomTag value={`${questionsCount} Questions`} />}
        </div>
        {showPin && (
          <div className="w-fit p-0.5 gradient-purple rounded-xl">
            <div className="w-fit px-[70px] py-10 bg-background text-[32px] leading-10 rounded-md">
              Pin: {pin}
            </div>
          </div>
        )}
      </div>
      {/* <div className="w-full absolute bottom-10 px-[55px]">
        <Button onClick={() => router.back()}>Back</Button>
      </div> */}
      <div className="h-fit w-full px-[55px]">{children}</div>
    </div>
  );
}
