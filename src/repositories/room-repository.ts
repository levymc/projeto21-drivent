import { prisma } from '@/config';

async function receiveRoom(id: number) {
  return prisma.room.findUnique({
    where: {
      id,
    },
  });
}

export const roomRepository = {
  receiveRoom,
};
