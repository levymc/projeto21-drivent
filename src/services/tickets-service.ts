import { ticketsRepository } from '@/repositories/tickets-repository';

export async function signIn() {
  const tickets = await ticketsRepository.findTicketsType();
  return tickets;
}
