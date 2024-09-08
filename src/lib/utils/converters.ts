// firebase room converter

import { GameSession, Participant, Game, Counters } from "@/models/game";
import Room from "@/models/room";
import { DbGameSession } from "@/lib/utils/firestore";

export const gameSessionConverter = {
  toFirestore: (gameSession: GameSession): DbGameSession => {
    const participantsIdToParticipant = gameSession.participants?.reduce(
      (acc: any, participant) => {
        acc[participant.userId || participant.name] = participant;
        return acc;
      },
      {},
    );

    return {
      session: {
        room: gameSession.room,
        game: gameSession.game,
        counters: gameSession.counters,
      },
      participants: participantsIdToParticipant,
      code: gameSession.room.code,
    };
  },
  fromFirestore: (snapshot: any): GameSession => {
    const data = snapshot.data() as DbGameSession;
    let questions = data.session.room.questions;
    questions = questions.map((question: any) => {
      const createdAtSeconds = question.createdAt;
      const createdAtDate = new Date(createdAtSeconds * 1000);
      return {
        ...question,
        createdAt: createdAtDate,
      };
    });

    const participants = Object.values(data.participants) || [];

    return {
      room: data.session.room,
      game: data.session.game,
      counters: data.session.counters,
      participants,
    };
  },
};

// Use game session converter and return: [key: string]: GameSession, where key is the room code
const manyGameSessionsConverter = {
  toFirestore: (gameSessions: any): { [key: string]: DbGameSession } => {
    return gameSessions.reduce((acc: any, gameSession: GameSession) => {
      acc[gameSession.room.code] =
        gameSessionConverter.toFirestore(gameSession);
      return acc;
    }, {});
  },
  fromFirestore: (snapshot: any): GameSession[] => {
    const data = snapshot.data() as { [key: string]: DbGameSession };
    return Object.values(data).map((gameSession: DbGameSession) => {
      return gameSessionConverter.fromFirestore({ data: () => gameSession });
    });
  },
};

export const roomConverter = {
  toFirestore: (room: Room): any => {
    return {
      ...room,
      questions: room.questions.map(question => {
        return {
          ...question,
        };
      }),
    };
  },
  fromFirestore: (snapshot: any): Room => {
    const data = snapshot.data() as Room;
    return {
      ...data,
    };
  },
};

export const participantConverter = {
  toFirestore: (participant: Participant): any => {
    return {
      ...participant,
    };
  },
  fromFirestore: (snapshot: any): Participant => {
    const data = snapshot.data() as Participant;
    return {
      ...data,
    };
  },
};

export const manyParticipantsConverter = {
  toFirestore: (participants: any): { [key: string]: Participant }[] => {
    return (
      participants?.map((participant: Participant) => {
        return {
          [participant.userId]: participant,
        };
      }) || []
    );
  },
  fromFirestore: (snapshot: any): Participant[] => {
    const data = snapshot.data() as { [key: string]: Participant };
    return Object.values(data);
  },
};

export const gameConverter = {
  toFirestore: (game: Game): any => {
    return {
      ...game,
    };
  },
  fromFirestore: (snapshot: any): Game => {
    const data = snapshot.data() as Game;
    return data;
  },
};

export const countersConverter = {
  toFirestore: (counters: Counters): any => {
    return {
      ...counters,
    };
  },
  fromFirestore: (snapshot: any): Counters => {
    const data = snapshot.data() as Counters;
    return data;
  },
};
