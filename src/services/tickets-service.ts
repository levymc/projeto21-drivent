import logger from '@/config/logger';
import { ticketsRepository } from '@/repositories/tickets-repository';

async function returnTicketsTypes() {
  logger.info('ticketsService.returnTicketsTypes START');
  const ticketsTypes = await ticketsRepository.findTicketsTypes();
  logger.info('ticketsService.returnTicketsTypes END');
  return ticketsTypes;
}

async function returnTickets() {
  logger.info('ticketsService.returnTickets START');
  const tickets = await ticketsRepository.findTickets();
  logger.info('ticketsService.returnTickets END');
  return tickets;
}

export const ticketsService = {
  returnTicketsTypes,
  returnTickets,
};
