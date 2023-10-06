import { faker } from '@faker-js/faker';
import { prisma } from '@/config';

export async function createBooking(userId: number = null, roomId: number = null) {
  return await prisma.booking.create({
    data: {
      id: faker.datatype.number(),
      userId: userId === null ? faker.datatype.number() : userId,
      roomId: roomId === null ? faker.datatype.number() : roomId,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });
}
