import { prisma } from '@/config';

async function findHotels() {
  const hotels = await prisma.hotel.findMany({});
  return hotels;
}

async function findHotelById(id: number) {
  return prisma.hotel.findUnique({
    where: {
      id,
    },
    include: {
      Rooms: true,
    },
  });
}

export const hotelsRepository = {
  findHotels,
  findHotelById,
};
