import { prisma } from '@/config';

async function findTicketsType() {
  return prisma.ticketType.findMany();
}

export const ticketsRepository = {
  findTicketsType,
};
