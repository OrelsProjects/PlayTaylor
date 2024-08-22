"use client";

import { useEffect, useRef, useState } from "react";
import useRoom from "../../lib/hooks/useRoom";
import { useAppDispatch, useAppSelector } from "../../lib/hooks/redux";
import { setRoom } from "../../lib/features/room/roomSlice";
import { useRouter } from "next/navigation";

export default function RoomListenerProvider() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { listenToRoomChanges } = useRoom();
  const { room } = useAppSelector(state => state.room);

  const [shouldListen, setShouldListen] = useState(false);

  let unsubscribe = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (room) {
      setShouldListen(true);
    } else {
      setShouldListen(false);
    }
  }, [room]);

  useEffect(() => {
    if (shouldListen && !unsubscribe.current && room) {
      unsubscribe.current = listenToRoomChanges(
        room.code,
        newRoom => {
          dispatch(setRoom(newRoom));
        },
        () => {
          router.push("/");
        },
      );
    }

    return () => {
      if (unsubscribe.current) {
        unsubscribe.current?.();
        unsubscribe.current = null;
      }
    };
  }, [shouldListen]);

  return <></>;
}
