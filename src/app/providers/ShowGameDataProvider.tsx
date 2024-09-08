"use client";

import React from "react";
import { useAppSelector } from "@/lib/hooks/redux";

export default function showGameDataProvider() {
  const { user } = useAppSelector(state => state.auth);
  const { room } = useAppSelector(state => state.room);
  const { game, counters, participants } = useAppSelector(state => state.game);

  return (
    room.createdBy === user?.userId && (
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
          {game?.currentQuestion && (
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold text-white">Current Question</h2>
              <p>Question: {game.currentQuestion.question}</p>
              <p>Timer: {counters.currentQuestion}</p>
            </div>
          )}
          {game?.countdownStartedAt && (
            <p>Countdown Started At: {game.countdownStartedAt}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-5">
          <h2 className="font-semibold text-white">Counters</h2>
          {counters?.startGame && <p>Countdown: {counters.startGame}</p>}
          {counters?.questionEnded && (
            <p>Countdown Question Ended: {counters.questionEnded}</p>
          )}
          {counters?.showLeaderboard && (
            <p>Countdown Show Leaderboard: {counters.showLeaderboard}</p>
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
