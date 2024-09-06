"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useRoom from "@/lib/hooks/useRoom";
import { useAppSelector } from "@/lib/hooks/redux";
import useGame from "@/lib/hooks/useGame";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import { useParams } from "next/navigation";

export default function GameListenerProvider() {
  const router = useCustomRouter();
  const params = useParams();
  const { user } = useAppSelector(state => state.auth);
  const { listenToRoomChanges, updateRoom } = useRoom();
  const {
    listenToGameChanges,
    listenToParticipantsChanges,
    updateParticipants,
    updateGame,
  } = useGame();
  const { room } = useAppSelector(state => state.room);
  const { game, participants } = useAppSelector(state => state.game);

  const [shouldListen, setShouldListen] = useState(false);

  let unsubscribeRoom = useRef<(() => void) | null>(null);
  let unsubscribeGame = useRef<(() => void) | null>(null);
  let unsubscribeParticipants = useRef<(() => void) | null>(null);

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
          router.push("/");
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
    if (shouldListen && !unsubscribeParticipants.current && code) {
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
          router.push("/");
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

  const isOwner = useMemo(() => room?.createdBy == user?.userId, [room, user]);

  return (
    isOwner && (
      <div className="hidden md:block absolute top-0 left-0 w-[500px] h-fit max-h-[80%] bg-black/50 overflow-auto text-lg">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-white">User</h2>
          {user && (
            <div className="flex flex-col gap-1">
              <p>Id: {user.userId}</p>
              <p>Name: {user.displayName}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-5">
          <h2 className="font-semibold text-white">Game</h2>
          {game?.gameStartedAt ? <p>Game started</p> : <p>Game not started</p>}
          {game?.countdownStartedAt && (
            <p>Countdown Started At: {game.countdownStartedAt}</p>
          )}
          {game?.stage && <p>Stage: {game.stage}</p>}
          {game?.previousStage && <p>Previous Stage: {game.previousStage}</p>}
          {game?.countdownCurrentTime && (
            <p>Countdown: {game.countdownCurrentTime}</p>
          )}
          {game?.currentQuestion && (
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold text-white">Current Question</h2>
              <p>Question: {game.currentQuestion.question}</p>
              <p>Timer: {game.currentQuestion.timer}</p>
            </div>
          )}
          {game?.countdownStartedAt && (
            <p>Countdown Started At: {game.countdownStartedAt}</p>
          )}
          {game?.countdownQuestionEnded && (
            <p>Countdown Question Ended: {game.countdownQuestionEnded}</p>
          )}
          {game?.countdownShowLeaderboard && (
            <p>Countdown Show Leaderboard: {game.countdownShowLeaderboard}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-5">
          <h2 className="font-semibold text-white">Participants:</h2>
          {participants?.map(participant => (
            <div key={participant.userId} className="flex flex-col gap-1">
              <p>Id: {participant.userId}</p>
              <p>Name: {participant.name}</p>
              {participant.questionResponses && (
                <p>
                  Response:{" "}
                  {
                    participant.questionResponses.find(
                      qr => qr.questionId === game?.currentQuestion?.id,
                    )?.option
                  }
                </p>
              )}
            </div>
          ))}
        </div>
        {room && (
          <div className="flex flex-col gap-1 mt-5">
            <h2 className="font-semibold text-white">Room</h2>
            <p>Code: {room.code}</p>
            <p>Name: {room.name}</p>
            <p>Difficulty: {room.difficulty}</p>
            <p>Questions: {room.questionsCount}</p>
            <p>Participants: {room.participantsCount}</p>
          </div>
        )}
      </div>
    )
  );
}
