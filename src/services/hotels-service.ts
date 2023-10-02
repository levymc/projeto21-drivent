import { hotelsRepository } from '@/repositories';

async function receiveHotels() {
  const hotels = await hotelsRepository.findHotels();
  return hotels.map((hotel) => {
    return {
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      createdAt: hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
    };
  });
}

export const hotelsService = {
  receiveHotels,
};
