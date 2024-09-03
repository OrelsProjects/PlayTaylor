// firebase room converter


import { GameSession, Participant, Game } from "@/models/game";
import Room from "@/models/room";
import { DbGameSession } from "@/lib/utils/firestore";

export const gameSessionConverter = {
  toFirestore: (room: GameSession): DbGameSession => {
    const participantsIdToParticipant = room.participants.reduce(
      (acc: any, participant) => {
        acc[participant.userId || participant.name] = participant;
        return acc;
      },
      {},
    );

    return {
      session: {
        room: room.room,
        game: room.game,
      },
      participants: participantsIdToParticipant,
    };
  },
  fromFirestore: (snapshot: any): GameSession => {
    const data = snapshot.data() as DbGameSession;
    let questions = data.session.room.questions;
    questions = questions.map((question: any) => {
      const createdAtSeconds = question.createdAt.seconds;
      const createdAtDate = new Date(createdAtSeconds * 1000);
      return {
        ...question,
        createdAt: createdAtDate,
      };
    });

    return {
      room: data.session.room,
      game: data.session.game,
      participants: Object.values(data.participants),
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
    return participants.map((participant: Participant) => {
      return {
        [participant.userId]: participant,
      };
    });
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
