"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useRoom from "@/lib/hooks/useRoom";
import { useAppSelector } from "@/lib/hooks/redux";
import useGame from "@/lib/hooks/useGame";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import { useParams, usePathname } from "next/navigation";

export default function GameListenerProvider() {
  const pathname = usePathname();
  const params = useParams();
  const { room } = useAppSelector(state => state.room);
  const { listenToRoomChanges, updateRoom } = useRoom();
  const {
    listenToGameChanges,
    listenToCountersChanges,
    listenToParticipantsChanges,
    updateParticipants,
    updateCounters,
    updateGame,
  } = useGame();

  const [shouldListen, setShouldListen] = useState(false);

  let unsubscribeRoom = useRef<(() => void) | null>(null);
  let unsubscribeGame = useRef<(() => void) | null>(null);
  let unsubscribeParticipants = useRef<(() => void) | null>(null);
  let unsubscribeCounters = useRef<(() => void) | null>(null);

  const code = useMemo(
    (): string | undefined => room?.code || (params?.code as string),
    [room, params],
  );

  useEffect(() => {
    if (code) {
      setShouldListen(true);
    } else {
      setShouldListen(false);
    }
  }, [room, params]);

  useEffect(() => {
    if (shouldListen && !unsubscribeRoom.current && code) {
      unsubscribeRoom.current = listenToRoomChanges(
        code,
        newRoom => {
          updateRoom(newRoom);
        },
        () => {
          debugger;
        },
      );
    }

    return () => {
      if (unsubscribeRoom.current) {
        unsubscribeRoom.current?.();
        unsubscribeRoom.current = null;
      }
    };
  }, [shouldListen]);

  useEffect(() => {
    if (shouldListen && !unsubscribeCounters.current && code) {
      unsubscribeCounters.current = listenToCountersChanges(code, counters => {
        updateCounters(counters);
      });
    }

    return () => {
      if (unsubscribeCounters.current) {
        unsubscribeCounters.current?.();
        unsubscribeCounters.current = null;
      }
    };
  }, [shouldListen, room]);

  useEffect(() => {
    if (
      shouldListen &&
      (room.isAdmin || pathname.includes("waiting")) &&
      !unsubscribeParticipants.current &&
      code
    ) {
      unsubscribeParticipants.current = listenToParticipantsChanges(
        code,
        participants => {
          updateParticipants(participants);
        },
      );
    }

    return () => {
      if (unsubscribeParticipants.current) {
        unsubscribeParticipants.current?.();
        unsubscribeParticipants.current = null;
      }
    };
  }, [shouldListen, room]);

  useEffect(() => {
    if (shouldListen && !unsubscribeGame.current && code) {
      unsubscribeGame.current = listenToGameChanges(
        code,
        newGame => {
          updateGame(newGame);
        },
        () => {
          debugger;
        },
      );
    }

    return () => {
      if (unsubscribeGame.current) {
        unsubscribeGame.current?.();
        unsubscribeGame.current = null;
      }
    };
  }, [shouldListen]);

  return null;
}
