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
    return {
      ...data,
      participants: data.participants || [],
    };
  },
};
