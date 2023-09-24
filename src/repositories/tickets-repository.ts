import { prisma } from '@/config';
import logger from '@/config/logger';

async function findTicketsTypes() {
  logger.trace('ticketsRepository.findTicketsTypes START');
  const retorno = await prisma.ticketType.findMany({});
  logger.trace({ msg: 'ticketsRepository.findTicketsTypes START', retorno });

  return retorno;
}

async function findTickets() {
  logger.trace('ticketsRepository.findTickets START');
  const retorno = await prisma.ticket.findMany({});
  logger.trace({ msg: 'ticketsRepository.findTickets START', retorno });

  return retorno;
}

export const ticketsRepository = {
  findTicketsTypes,
  findTickets,
};
