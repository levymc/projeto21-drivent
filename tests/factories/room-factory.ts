import { faker } from '@faker-js/faker';
import { prisma } from '@/config';
import { Room } from '@prisma/client';

export async function createRoom(hotelId: number = null) {
  return await prisma.room.create({
    data: {
      id: faker.datatype.number(),
      name: faker.datatype.string(),
      capacity: faker.datatype.number(),
      hotelId: hotelId === null ? faker.datatype.number() : hotelId,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });
}
