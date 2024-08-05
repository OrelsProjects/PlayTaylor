"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAppSelector } from "../../../../lib/hooks/redux";
import { useRouter } from "next/navigation";
import { db } from "@/../firebase.config";
import { onSnapshot, doc } from "firebase/firestore";
import { Question } from "@prisma/client";
import useRoom from "../../../../lib/hooks/useRoom";
import Loading from "../../../../components/ui/loading";
import { cn } from "../../../../lib/utils";
import { montserratAlternates } from "../../../../lib/utils/fontUtils";

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
        "p-4 rounded-lg shadow-md aspect-square flex justify-center items-center text-white",
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
  const { room } = useAppSelector(state => state.room);
  const { setPreviouslyJoinedRoom } = useRoom();

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(75); // You can dynamically update this value

  useEffect(() => {
    let unsubscribe = () => {};
    setPreviouslyJoinedRoom(params.code)
      .then(response => {
        if (!response?.room) {
          router.push("/");
        } else if (db) {
          const roomRef = doc(db, "rooms", response.room.code);
          unsubscribe = onSnapshot(
            roomRef,
            snapshot => {
              const currentQuestionNumber = snapshot.data()
                ?.currentQuestion as number;
              const questions = snapshot.data()?.questions as Question[];
              const currentQuestion = questions[currentQuestionNumber];

              setCurrentQuestion(questions[currentQuestionNumber]);
              setLoading(false);
            },
            error => {
              // Handle errors, such as permissions issues
              console.error(
                "Failed to subscribe to participants updates:",
                error,
              );
            },
          );
        }
      })
      .catch(() => {
        router.push("/");
      });

    return unsubscribe;
  }, [room]);


  if (loading) return <Loading className="w-16 h-16" />;
  const style = { "--value": 70 } as React.CSSProperties

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-6 justify-start items-center",
        montserratAlternates.className,
      )}
    >
      <div className="radial-progress">
        {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 h-11/12 rounded-full overflow-hidden  flex justify-center items-center"> */}
          <Image
            src="/Manuscript.png"
            alt="Manuscript"
            fill
            objectFit="cover"
            className="!relative rounded-full !h-40 !w-40 flex-shrink-0"
          />
        {/* </div> */}
      </div>
      <span className="text-lg text-center font-medium">
        {currentQuestion?.content}
      </span>
      <div className="w-full grid grid-cols-[repeat(var(--answers-in-row-mobile),minmax(0,1fr))] md:grid-cols-[repeat(var(--answers-in-row),minmax(0,1fr))] gap-8 auto-rows-auto">
        {Array.from({ length: 4 }).map((_, index) => (
          <AnswerComponent
            key={index}
            index={index}
            answer={"Tim McGraw " + (index + 1)}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
