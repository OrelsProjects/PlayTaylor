"use client";

import { useEffect, useState } from "react";
import useGame from "@/lib/hooks/useGame";
import { Logger } from "@/logger";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/hooks/redux";
import { toast } from "react-toastify";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import { isGameRunning, isCountdown } from "@/models/game";

type Stage = "pin" | "name";

export default function Join({ params }: { params: { code?: string[] } }) {
  const router = useCustomRouter();
  const { getGameSession, joinGame, setPreviouslyJoinedGame, updateGame } =
    useGame();
  const { user } = useAppSelector(state => state.auth);
  const { game } = useAppSelector(state => state.game);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<Stage>("pin");

  const checkPreviouslyJoinedRoom = async (
    code: string,
    userId: string,
  ): Promise<boolean> => {
    try {
      const gameSession = await setPreviouslyJoinedGame(code, userId);
      if (gameSession) {
        const { game } = gameSession;

        if (isGameRunning(game?.stage)) {
          router.push("/game/" + code);
        } else if (isCountdown(game?.stage)) {
          router.push("/lobby/" + code);
        } else {
          router.push("/waiting/" + code);
        }
        return true;
      }
      return false;
    } catch (e: any) {
      Logger.error(e);
      return false;
    }
  };

  useEffect(() => {
    if (params.code?.length && user) {
      const code = params.code[0];
      checkPreviouslyJoinedRoom(code, user.userId).then(didJoinRoom => {
        if (!didJoinRoom) {
          setCode(code);
        }
      });
    }
  }, [params.code, user]);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (stage === "pin" && user) {
        const didJoinRoom = await checkPreviouslyJoinedRoom(code, user.userId);
        if (didJoinRoom) return;

        const gameSession = await getGameSession(code);
        if (gameSession) {
          setStage("name");
          updateGame(gameSession.game);
        }
      } else {
        if (!game) {
          Logger.error("Game not found");
          return;
        }
        const GameSession = await joinGame(code, name);
        if (GameSession?.game?.gameStartedAt) {
          router.push("/game/" + code);
        } else {
          router.push("/waiting/" + code);
        }
      }
    } catch (error: any) {
      if (error.name === "NameTakenError") {
        toast.error("Name taken"); // TODO: Copy
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start gap-16 px-14 py-10">
      <div className="h-full w-full flex flex-col gap-[52px] justify-center items-center">
        <p className="text-[40px] leading-10">
          {stage === "pin" ? "Insert pin" : "Insert name"}
        </p>
        <div className="flex flex-col gap-4">
          {stage === "pin" && (
            <Input
              type="text"
              placeholder={"Pin"}
              value={code}
              autoFocus
              maxLength={6}
              onChange={e => {
                if (stage === "pin") {
                  const upperCasePin = e.target.value.toUpperCase();
                  setCode(upperCasePin);
                }
              }}
            />
          )}
          {stage === "name" && (
            <Input
              type="text"
              placeholder={"Swiftie Doe"}
              value={name}
              maxLength={20}
              autoFocus
              onChange={e => {
                setName(e.target.value);
              }}
            />
          )}
          <Button onClick={handleSubmit} isLoading={loading}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
