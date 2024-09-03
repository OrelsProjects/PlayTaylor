"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useRoom from "@/lib/hooks/useRoom";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { setRoom } from "@/lib/features/room/roomSlice";
import useGame from "@/lib/hooks/useGame";
import { setGame, setParticipants } from "@/lib/features/game/gameSlice";

export default function GameListenerProvider({
  params,
}: {
  params?: { code: string };
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { listenToRoomChanges } = useRoom();
  const { listenToGameChanges, listenToParticipantsChanges } = useGame();
  const { room } = useAppSelector(state => state.room);

  const [shouldListen, setShouldListen] = useState(false);

  let unsubscribe = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (room || params?.code) {
      setShouldListen(true);
    } else {
      setShouldListen(false);
    }
  }, [room, params]);

  useEffect(() => {
    if (shouldListen && !unsubscribe.current && (room || params?.code)) {
      unsubscribe.current = listenToRoomChanges(
        room ? room.code : params!.code,
        newRoom => {
          dispatch(setRoom(newRoom));
        },
        () => {
          debugger;
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

  useEffect(() => {
    if (shouldListen && !unsubscribe.current && (room || params?.code)) {
      unsubscribe.current = listenToParticipantsChanges(
        room ? room.code : params!.code,
        participants => {
          dispatch(setParticipants(participants));
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

  useEffect(() => {
    if (shouldListen && !unsubscribe.current && (room || params?.code)) {
      unsubscribe.current = listenToGameChanges(
        room ? room.code : params!.code,
        newGame => {
          dispatch(setGame(newGame));
        },
        () => {
          debugger;
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
