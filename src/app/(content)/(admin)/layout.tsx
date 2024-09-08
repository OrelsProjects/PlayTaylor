/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo } from "react";

import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "../../../lib/hooks/redux";
import RoomNameComponent from "@/components/roomName";
import RoomTag from "@/components/roomTag";
import AuthProvider from "../../providers/AuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { room } = useAppSelector(state => state.room);

  const code = useMemo(() => room?.code, [room]);
  const gameName = useMemo(() => room?.name, [room]);
  const participantsCount = useMemo(() => room?.participantsCount, [room]);
  const difficulty = useMemo(() => room?.difficulty, [room]);
  const questionsCount = useMemo(() => room?.questionsCount, [room]);

  const showCode = useMemo(() => {
    return !pathname.includes("create") && code;
  }, [code, pathname]);

  return (
    <AuthProvider>
      <div className="w-full h-full flex flex-col items-center justify-start pt-10 relative">
        <div className="w-full h-fit mx-auto flex flex-col justify-center items-center gap-6">
          {gameName && <RoomNameComponent name={gameName} />}
          <div className="flex flex-row gap-2">
            {(participantsCount || 0) > 0 && (
              <RoomTag value={`${participantsCount} Participants`} />
            )}
            {difficulty && <RoomTag value={`${difficulty}`} />}
            {questionsCount && (
              <RoomTag value={`${questionsCount} Questions`} />
            )}
          </div>
          {showCode && (
            <div className="w-fit p-0.5 gradient-purple rounded-xl">
              <div className="w-fit px-[70px] py-10 bg-background text-[32px] leading-10 rounded-md">
                Pin: {code}
              </div>
            </div>
          )}
        </div>
        <div className="h-fit w-full px-[55px]">{children}</div>
      </div>
    </AuthProvider>
  );
}
