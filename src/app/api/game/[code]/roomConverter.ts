// firebase room converter

import Room from "@/models/room";

export const roomConverter = {
  toFirestore: (room: Room) => {
    return {
      ...room,
      participants: room.participants || [],
    };
  },
  fromFirestore: (snapshot: any): Room => {
    const data = snapshot.data();
    let questions = data.questions || [];
    questions = questions.map((question: any) => {
      const createdAtSeconds = question.createdAt.seconds;
      const createdAtDate = new Date(createdAtSeconds * 1000);
      return {
        ...question,
        createdAt: createdAtDate,
      };
    });
    return {
      ...data,
      questions,
      participants: data.participants || [],
    };
  },
};
