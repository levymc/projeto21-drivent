import { TicketStatus } from '@prisma/client';
import { mockEnrollment2 } from './mocks/enrollment.mock';
import { generateRandomTicket, generateRandomTicketType, mockTicket, mockTicketType } from './mocks/ticket.mock';
import { bookingService } from '@/services/booking-service';
import { notFoundError } from '@/errors';
import { enrollmentRepository } from '@/repositories';

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

  it('isInvalidBooking should return false', async () => {
    const mock = jest.spyOn(bookingService, 'isInvalidBooking');
    const ticket = generateRandomTicket();
    const type = generateRandomTicketType();
    mock.mockImplementation(() => {
      return ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel;
    });
    const response = bookingService.isInvalidBooking(ticket, type);
    console.info({ response }); // RESERVED + isRemote = true + incluesHotel = false
    expect(response).toBe(true);
  });

  it('findTicketByEnrollmentId should return Ticket', async () => {
    const input = 3;
    const mock = jest.spyOn(bookingService, 'findTicketByEnrollmentId');
    mock.mockImplementation((): any => {
      return mockTicket;
    });
    const ticket = await bookingService.findTicketByEnrollmentId(input);
    expect(bookingService.findTicketByEnrollmentId).toBeCalledTimes(1);
    expect(bookingService.findTicketByEnrollmentId).toHaveBeenCalledWith(input);
    expect(ticket).toEqual(mockTicket);
  });
});
