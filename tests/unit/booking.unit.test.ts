import { TicketStatus } from '@prisma/client';
import { mockEnrollment2 } from './mocks/enrollment.mock';
import { mockTicket, mockTicketType } from './mocks/ticket.mock';
import { bookingService } from '@/services/booking-service';

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

  it('isInvalidBooking should return false', async () => {
    const mock = jest.spyOn(bookingService, 'isInvalidBooking');
    mock.mockImplementation((): any => {
      return true;
    });
    const boolean = bookingService.isInvalidBooking(mockTicket, mockTicketType);
    expect(bookingService.isInvalidBooking).toBeCalledTimes(1);
    expect(bookingService.isInvalidBooking).toHaveBeenCalledWith(mockTicket, mockTicketType);
    expect(boolean).toBeFalsy();
  });
});
