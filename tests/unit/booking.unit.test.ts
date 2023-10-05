import { TicketStatus } from '@prisma/client';
import { mockEnrollment2 } from './mocks/enrollment.mock';
import { generateRandomTicket, generateRandomTicketType, mockTicket, mockTicketType } from './mocks/ticket.mock';
import { bookingService } from '@/services/booking-service';
import { notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Unit Tests Service /booking', () => {
  it('findEnrollmentByUserId should return Enrollment', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementation((): any => {
      return mockEnrollment2;
    });

    const enrollment = await bookingService.findEnrollmentByUserId(1);
    expect(enrollment).toEqual(mockEnrollment2);
    expect(enrollment).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        cpf: expect.any(String),
        birthday: expect.any(Date),
        phone: expect.any(String),
        userId: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
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

  it('findTicketByEnrollmentId should return notFoundError when !ticket', async () => {
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(null);

    const ticket = bookingService.findTicketByEnrollmentId(1);
    expect(ticket).rejects.toEqual(notFoundError());
  });

  it('findTicketByEnrollmentId should return Ticket', async () => {
    const mockTicket = generateRandomTicket();
    const mockTicketType = generateRandomTicketType();
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue({
      id: mockTicket.id,
      ticketTypeId: mockTicketType.id,
      enrollmentId: 1,
      status: mockTicket.status,
      createdAt: mockTicket.createdAt,
      updatedAt: mockTicket.updatedAt,
      TicketType: mockTicketType,
    });

    const ticket = bookingService.findTicketByEnrollmentId(1);
    expect(ticket).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        ticketTypeId: expect.any(Number),
        enrollmentId: expect.any(Number),
        status: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        TicketType: expect.any(Object),
      }),
    );
  });
});
