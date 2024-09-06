"use client";

import React, { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks/redux";
import PlayerCard from "./playerCard";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import { cn } from "@/lib/utils";
import { QuestionOption } from "@/models/question";
import { Participant, SHOW_LEADERBOARD_TIME } from "@/models/game";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import RadialProgressBar from "@/components/ui/radialProgressBar";

type ParticipantRanking = Participant & {
  rank: number;
  answeredCorrectly: boolean;
};

export default function LeaderboardPage({
  params,
}: {
  params: { code: string };
}) {
  const router = useCustomRouter();
  const { game, participants } = useAppSelector(state => state.game); // FOR NEXT - Change CODE params to search params and use useCUstomRouter form saas-template

  useEffect(() => {
    if (game?.stage !== "show-leaderboard") {
      router.push("/game/" + params.code);
    }
  }, [game?.stage]);

  const countdown = useMemo(() => {
    if (!game) return 5;
    return game.countdownShowLeaderboard;
  }, [game]);

  const correctAnswer = useMemo(() => {
    if (!game) return null;
    return game.currentQuestion?.options.find(option => option.correct)?.option;
  }, [game]);

  const currentQuestion = useMemo(() => {
    if (!game) return null;
    return game.currentQuestion;
  }, [game]);

  const participantsWithCurrentQuestionResponse = useMemo((): (Participant & {
    response?: QuestionOption;
  })[] => {
    if (!game || !participants || !currentQuestion) return [];
    return (
      participants.map(participant => {
        const response = participant.questionResponses?.find(
          response => response.questionId === currentQuestion.id,
        );
        return {
          ...participant,
          response,
        };
      }) || []
    );
  }, [game, participants, currentQuestion]);

  const participantsAnsweredIncorrectly = useMemo((): (Participant & {
    response?: QuestionOption;
  })[] => {
    return (
      participantsWithCurrentQuestionResponse?.filter(
        participant => !participant.response?.correct,
      ) || []
    );
  }, [participantsWithCurrentQuestionResponse]);

  const participantsAnsweredCorrectly = useMemo((): (Participant & {
    response?: QuestionOption;
  })[] => {
    return (
      participantsWithCurrentQuestionResponse?.filter(
        participant => participant.response?.correct,
      ) || []
    );
  }, [participantsWithCurrentQuestionResponse]);

  // First one to answer correctly is first, second is second, etc. returns participant.userId to rank json
  const participantsRanked = useMemo((): ParticipantRanking[] => {
    if (participantsAnsweredCorrectly.length <= 0) return [];
    const ranking: ParticipantRanking[] = [];
    participantsAnsweredCorrectly
      ?.sort(
        (a, b) => (a.response?.answeredAt || 0) - (b.response?.answeredAt || 0),
      )
      .forEach((participant, index) => {
        ranking.push({
          ...participant,
          rank: index + 1,
          answeredCorrectly: true,
        });
      });
    // add the rest of the participants who answered incorrectly
    participantsAnsweredIncorrectly.forEach((participant, index) => {
      ranking.push({
        ...participant,
        rank: participantsAnsweredCorrectly.length + index + 1,
        answeredCorrectly: false,
      });
    });

    return ranking;
  }, [participantsAnsweredCorrectly]);

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-between",
        montserratAlternates.className,
      )}
    >
      <div className="h-full w-full flex flex-col gap-[71px] justify-start items-center px-4">
        <div className="w-full flex flex-col gap-8 justify-center items-center">
          <span className="text-2xl font-semibold text-center">
            {currentQuestion?.question || "What was Taylor’s debut single?"}
          </span>
          {correctAnswer && (
            <div className="w-full relative">
              <div className="w-full bg-question-correct flex justify-center items-center rounded-2xl py-5 z-20 relative">
                {/* Make a square with rounded-lg, rotate 90 deg and set absolute middle bottom*/}
                <span className=" text-primary-foreground z-20">
                  {correctAnswer}
                </span>
                <div className="w-10 h-10 bg-question-correct rounded-[4px] transform rotate-45 absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10"></div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full h-fit grid grid-cols-[repeat(var(--players-in-row-mobile),minmax(0,1fr))] md:grid-cols-[repeat(var(--players-in-row),minmax(0,1fr))] gap-4 auto-rows-auto">
          {participantsRanked?.length > 0
            ? participantsRanked.map((participant, index) => (
                <PlayerCard
                  key={`${participant.name}-${index}`}
                  rank={participant.rank}
                  image={"/swiftie.png"}
                  name={participant.name}
                  isCorrectAnswer={participant.answeredCorrectly}
                />
              ))
            : Array.from({ length: 4 }).map((_, index) => (
                <PlayerCard
                  key={index}
                  rank={index + 1}
                  image={"/swiftie.png"}
                  name={"TayTay"}
                  isCorrectAnswer={index < 2}
                />
              ))}
        </div>
      </div>
      <div className="w-full border-t h-fit flex flex-col justify-center items-center pb-4 pt-2">
        <RadialProgressBar
          progress={
            ((countdown !== undefined && countdown !== null
              ? countdown
              : SHOW_LEADERBOARD_TIME) /
              SHOW_LEADERBOARD_TIME) *
            100
          }
          radius={25}
          strokeWidth={4}
        >
          <p className="text-2xl">{countdown}</p>
        </RadialProgressBar>
        <p className="text-base font-medium">Next question</p>
      </div>
    </div>
  );
}
