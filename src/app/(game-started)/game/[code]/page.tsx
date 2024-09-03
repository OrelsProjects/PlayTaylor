"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/lib/hooks/redux";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import { cn } from "@/lib/utils";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import RadialProgressBar from "@/components/ui/radialProgressBar";
import { QuestionWithTimer } from "@/models/room";
import useGame from "@/lib/hooks/useGame";
import { QuestionOption } from "@/models/question";
import { QUESTION_TIME } from "@/models/game";
import { toast } from "react-toastify";

const colors = [
  "hsla(37, 91%, 55%, 1)",
  "hsla(146, 79%, 44%, 1)",
  "hsla(339, 90%, 51%, 1)",
  "hsla(270, 67%, 47%, 1)",
];

const AnswerComponent = ({
  answer,
  index,
  disabled,
  onClick,
}: {
  answer: string;
  index: number;
  disabled: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={cn(
        "rounded-lg w-40 h-36 flex justify-center items-center text-white",
        { "opacity-50": disabled },
      )}
      style={{ backgroundColor: colors[index % colors.length] }}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
    >
      {answer}
    </div>
  );
};

export default function Game({ params }: { params: { code: string } }) {
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const { room } = useAppSelector(state => state.room);
  const { game } = useAppSelector(state => state.game);
  const { setPreviouslyJoinedGame } = useGame();
  const { answerQuestion } = useGame();

  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionWithTimer | null>(null);
  const [countdown, setCountdown] = useState<number | null>(QUESTION_TIME);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!room || !game) return;

    if (!game.gameStartedAt) {
      if (room.createdBy === user?.userId) {
        router.push("/admin/room/" + room.code);
      } else {
        router.push("/waiting/" + room.code);
      }
    }
    const currentQuestion = game.currentQuestion as QuestionWithTimer;

    setCountdown(currentQuestion.timer);

    setCurrentQuestion(currentQuestion);
    setLoading(false);
  }, [room]);

  useEffect(() => {
    if (!params.code) return;

    setPreviouslyJoinedGame(params.code)
      .then(response => {
        if (!response?.room) {
          router.push("/");
        }
      })
      .catch(() => {
        router.push("/");
      });
  }, [params.code]);

  const didAnswerCurrentQuestion = useMemo(() => {
    if (!game || !user) return false;
    const participant = game.participants.find(p => p.userId === user.userId);
    if (!participant) return false;
    return participant.questionResponses?.some(
      qr => qr.response.questionId === currentQuestion?.id,
    );
  }, [room, user, currentQuestion]);

  const canAnswer = useMemo(
    () =>
      game?.stage === "playing" &&
      currentQuestion !== null &&
      !didAnswerCurrentQuestion,
    [room],
  );

  const handleQuestionResponse = async (response: QuestionOption) => {
    try {
      if (!currentQuestion) return;
      await answerQuestion(response, currentQuestion.id);
    } catch (error: any) {
      if (error.name === "AnsweredTooLateError") {
        toast.error("You answered too late.. :("); // TODO: Copy
      }
      console.error(error);
    }
  };

  if (loading) return <Loading className="w-16 h-16" />;

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-6 justify-start items-center",
        montserratAlternates.className,
      )}
    >
      <RadialProgressBar
        progress={
          ((countdown !== undefined && countdown !== null
            ? countdown
            : QUESTION_TIME) /
            QUESTION_TIME) *
          100
        }
        radius={90}
        strokeWidth={10}
      >
        <Image
          src="/Manuscript.png"
          alt="Manuscript"
          fill
          objectFit="cover"
          className="!relative rounded-full !h-40 !w-40 flex-shrink-0"
        />
      </RadialProgressBar>
      <span className="text-lg text-center font-medium">
        {currentQuestion?.question}
      </span>
      {/* <div className="w-full grid grid-cols-[repeat(var(--answers-in-row-mobile),minmax(0,1fr))] md:grid-cols-[repeat(var(--answers-in-row),minmax(0,1fr))] gap-8 auto-rows-auto"> */}
      <div className="w-full flex flex-wrap gap-4 justify-center items-center">
        {[...(currentQuestion?.options || [])]
          .sort((a, b) => a.position - b.position)
          .map(option => (
            <AnswerComponent
              key={option.option}
              disabled={!canAnswer}
              index={option.position}
              answer={option.option}
              onClick={() => {
                handleQuestionResponse(option);
              }}
            />
          ))}
      </div>
    </div>
  );
}
