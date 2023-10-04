import { mockEnrollment2 } from './mocks/enrollment.mock';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { mockTicket } from './mocks/ticket.mock';

describe('Unit Tests route /booking', () => {
  it('findEnrollmentByUserId should return Enrollment', async () => {
    const input = 456;
    const mock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    mock.mockImplementation((): any => {
      return mockEnrollment2;
    });
    const enrollment = await enrollmentRepository.findWithAddressByUserId(input);
    expect(enrollmentRepository.findWithAddressByUserId).toBeCalledTimes(1);
    expect(enrollmentRepository.findWithAddressByUserId).toHaveBeenCalledWith(input);
    expect(enrollment).toEqual(mockEnrollment2);
  });

  it('findTicketByEnrollmentId should return Ticket', async () => {
    const input = 3;
    const mock = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    mock.mockImplementation((): any => {
      return mockTicket;
    });
    const enrollment = await ticketsRepository.findTicketByEnrollmentId(input);
    expect(ticketsRepository.findTicketByEnrollmentId).toBeCalledTimes(1);
    expect(ticketsRepository.findTicketByEnrollmentId).toHaveBeenCalledWith(input);
    expect(enrollment).toEqual(mockTicket);
  });
});
