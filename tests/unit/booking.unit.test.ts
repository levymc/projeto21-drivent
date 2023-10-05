import { TicketStatus } from '@prisma/client';
import { mockEnrollment2 } from './mocks/enrollment.mock';
import { generateRandomTicket, generateRandomTicketType, mockTicket, mockTicketType } from './mocks/ticket.mock';
import { bookingService } from '@/services/booking-service';
import { notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';

describe('Unit Tests Service /booking', () => {
  it('findEnrollmentByUserId should return Enrollment', async () => {
    const input = 456;
    const mock = jest.spyOn(bookingService, 'findEnrollmentByUserId');
    mock.mockImplementation((): any => {
      return mockEnrollment2;
    });
    const enrollment = await bookingService.findEnrollmentByUserId(input);
    expect(bookingService.findEnrollmentByUserId).toBeCalledTimes(1);
    expect(bookingService.findEnrollmentByUserId).toHaveBeenCalledWith(input);
    expect(enrollment).toEqual(mockEnrollment2);
  });

  it('findEnrollmentByUserId should throw notFoundError when user does not exist', async () => {
    const mockFindWithAddressByUserId = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    mockFindWithAddressByUserId.mockResolvedValue(null);

    try {
      await bookingService.findEnrollmentByUserId(123);
      fail('Expected findEnrollmentByUserId to throw notFoundError');
    } catch (error) {
      expect(error.message).toBe('No result for this search!');
    } finally {
      mockFindWithAddressByUserId.mockRestore();
    }
  });

  it('isInvalidBooking should return true and validateUserBooking should throw Cannot list hotels!', async () => {
    const mock = jest.spyOn(bookingService, 'validateUserBooking');
    const ticket = generateRandomTicket();
    const type = generateRandomTicketType();
    const response = bookingService.isInvalidBooking(ticket, type);
    mock.mockImplementation((): any => {
      if (response) {
        throw cannotListHotelsError();
      }
    });
    expect(response).toBe(true);
    expect(() => bookingService.validateUserBooking(1)).toThrow('Cannot list hotels!');
  });

  it('findTicketByEnrollmentId should return Ticket', async () => {
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(null);

    const ticket = bookingService.findTicketByEnrollmentId(1);
    expect(ticket).rejects.toEqual(notFoundError());
  });
});
