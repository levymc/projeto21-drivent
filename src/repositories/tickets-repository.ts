import { prisma } from '@/config';
import logger from '@/config/logger';

async function findTicketsTypes() {
  logger.trace('ticketsRepository.findTicketsTypes START');
  const retorno = await prisma.ticketType.findMany({});
  logger.trace({ msg: 'ticketsRepository.findTicketsTypes START', retorno });

  return prisma.ticketType.findMany();
}

export const ticketsRepository = {
  findTicketsTypes,
};
