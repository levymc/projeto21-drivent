import { prisma } from '@/config';

async function findHotels() {
  const hotels = await prisma.hotel.findMany({});
  return hotels;
}

export const hotelsRepository = {
  findHotels,
};
