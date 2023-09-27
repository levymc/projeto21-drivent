import { hotelsRepository } from '@/repositories';

async function receiveHotels() {
  return hotelsRepository.findHotels();
}

export const hotelsService = {
  receiveHotels,
};
