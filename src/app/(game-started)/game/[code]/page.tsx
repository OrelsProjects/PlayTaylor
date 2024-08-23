"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/lib/hooks/redux";
import { useRouter } from "next/navigation";
import { db } from "@/../firebase.config";
import { onSnapshot, doc } from "firebase/firestore";
import { Question } from "@prisma/client";
import useRoom from "@/lib/hooks/useRoom";
import Loading from "@/components/ui/loading";
import { cn } from "@/lib/utils";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import RadialProgressBar from "../../../../components/ui/radialProgressBar";

const colors = [
  "hsla(37, 91%, 55%, 1)",
  "hsla(146, 79%, 44%, 1)",
  "hsla(339, 90%, 51%, 1)",
  "hsla(270, 67%, 47%, 1)",
];

const AnswerComponent = ({
  answer,
  index,
  onClick,
}: {
  answer: string;
  index: number;
  onClick: () => void;
}) => {
  return (
    <div
      className={cn(
        "rounded-lg w-40 h-36 flex justify-center items-center text-white",
      )}
      style={{ backgroundColor: colors[index % colors.length] }}
      onClick={onClick}
    >
      {answer}
    </div>
  );
};

export default function Game({ params }: { params: { code: string } }) {
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const { room } = useAppSelector(state => state.room);
  const { setPreviouslyJoinedRoom } = useRoom();

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!room) return;
    if (!room.gameStartedAt) {
      if (room.createdBy === user?.userId) {
        router.push("/admin/room/" + room.code);
      } else {
        router.push("/waiting/" + room.code);
      }
    }
    const currentQuestionNumber = room.currentQuestion as number;
    const questions = room.questions as Question[];
    const currentQuestion = questions[currentQuestionNumber];

    setCurrentQuestion(questions[currentQuestionNumber]);
    setLoading(false);
  }, [room]);

  useEffect(() => {
    let unsubscribe = () => {};
    setPreviouslyJoinedRoom(params.code)
      .then(response => {
        if (!response?.room) {
          router.push("/");
        }
      })
      .catch(() => {
        router.push("/");
      });

    return unsubscribe;
  }, [params.code]);

  if (loading) return <Loading className="w-16 h-16" />;

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-6 justify-start items-center",
        montserratAlternates.className,
      )}
    >
      <RadialProgressBar progress={90} radius={90} strokeWidth={10}>
        <Image
          src="/Manuscript.png"
          alt="Manuscript"
          fill
          objectFit="cover"
          className="!relative rounded-full !h-40 !w-40 flex-shrink-0"
        />
        </RadialProgressBar>
      <span className="text-lg text-center font-medium">
        {currentQuestion?.content}
      </span>
      {/* <div className="w-full grid grid-cols-[repeat(var(--answers-in-row-mobile),minmax(0,1fr))] md:grid-cols-[repeat(var(--answers-in-row),minmax(0,1fr))] gap-8 auto-rows-auto"> */}
      <div className="w-full flex flex-wrap gap-4 justify-center items-center">
        {Array.from({ length: 4 }).map((_, index) => (
          <AnswerComponent
            key={index}
            // FOR NEXT: Work on questions synchronization.
            index={index}
            answer={"Tim McGraw " + (index + 1)}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
