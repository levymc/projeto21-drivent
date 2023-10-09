import { TicketStatus } from '@prisma/client';
import { mockEnrollment1, mockEnrollment2 } from './mocks/enrollment.mock';
import { generateRandomTicket, generateRandomTicketType, mockTicketPaid, mockTicketType } from './mocks/ticket.mock';
import { generateRoomMock } from './mocks/room.mock';
import { generateBookingMock } from './mocks/booking.mock';
import { bookingService } from '@/services/booking-service';
import { forbiddenError, notFoundError } from '@/errors';
import { bookingRepository, enrollmentRepository, roomRepository, ticketsRepository } from '@/repositories';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Unit Tests Service /booking', () => {
  it('findEnrollmentByUserId should return Enrollment', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment2);

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

  it('validateUserBooking ERROR', async () => {
    const mockTicket = generateRandomTicket();
    const mockTicketType = generateRandomTicketType();
    const mockData = {
      id: mockTicket.id,
      ticketTypeId: mockTicketType.id,
      enrollmentId: 1,
      status: mockTicket.status,
      createdAt: mockTicket.createdAt,
      updatedAt: mockTicket.updatedAt,
      TicketType: mockTicketType,
    };
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment2);
    jest.spyOn(bookingService, 'findEnrollmentByUserId').mockResolvedValueOnce(mockEnrollment1);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockData);
    jest.spyOn(bookingService, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockData);
    const promisse = bookingService.validateUserBooking(1);
    expect(promisse).rejects.toEqual(forbiddenError(`ticket not paid, does not include hotel or remote reservation`));
  });

  it('findTicketByEnrollmentId should return notFoundError when !ticket', async () => {
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(null);

    const ticket = bookingService.findTicketByEnrollmentId(1);
    expect(ticket).rejects.toEqual(notFoundError());
  });

  it('findTicketByEnrollmentId should return Ticket', async () => {
    const mockTicket = generateRandomTicket();
    const mockTicketType = generateRandomTicketType();
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce({
      id: mockTicket.id,
      ticketTypeId: mockTicketType.id,
      enrollmentId: 1,
      status: mockTicket.status,
      createdAt: mockTicket.createdAt,
      updatedAt: mockTicket.updatedAt,
      TicketType: mockTicketType,
    });

    const ticket = await bookingService.findTicketByEnrollmentId(1);
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

  it('getBooking should return notFoundError when booking is null', async () => {
    const mockTicket = generateRandomTicket();
    const mockTicketType = generateRandomTicketType();
    mockTicketType.isRemote = false;
    mockTicketType.includesHotel = true;
    const mockData = {
      id: mockTicket.id,
      ticketTypeId: mockTicketType.id,
      enrollmentId: 1,
      status: TicketStatus.PAID,
      createdAt: mockTicket.createdAt,
      updatedAt: mockTicket.updatedAt,
      TicketType: mockTicketType,
    };
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment2);
    jest.spyOn(bookingService, 'findEnrollmentByUserId').mockResolvedValueOnce(mockEnrollment1);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockData);
    jest.spyOn(bookingService, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockData);
    jest.spyOn(bookingRepository, 'findBooking').mockResolvedValueOnce(null);
    expect(bookingService.getBooking).rejects.toEqual(notFoundError());
  });

  it('getBooking should return notFoundError when booking is null', async () => {
    const mockBooking = generateBookingMock();
    const mockRoom = generateRoomMock();
    const mockTicket = generateRandomTicket();
    const mockTicketType = generateRandomTicketType();
    mockTicketType.isRemote = false;
    mockTicketType.includesHotel = true;
    const mockData = {
      id: mockTicket.id,
      ticketTypeId: mockTicketType.id,
      enrollmentId: 1,
      status: TicketStatus.PAID,
      createdAt: mockTicket.createdAt,
      updatedAt: mockTicket.updatedAt,
      TicketType: mockTicketType,
    };
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment2);
    jest.spyOn(bookingService, 'findEnrollmentByUserId').mockResolvedValueOnce(mockEnrollment1);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockData);
    jest.spyOn(bookingService, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockData);
    jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValueOnce({
      ...mockBooking,
      Room: mockRoom,
    });
    const getBookingReturn = await bookingService.getBooking(1);
    expect(getBookingReturn).toEqual(
      expect.objectContaining({
        id: mockBooking.id,
        Room: mockRoom,
      }),
    );
  });

  it('checkUserReserve should throw ForbiddenError', async () => {
    jest
      .spyOn(bookingRepository, 'findBookingByUserId')
      .mockResolvedValueOnce({ ...generateBookingMock(), Room: generateRoomMock() });
    expect(bookingService.checkUserReserve).rejects.toEqual(forbiddenError('User can reserve just one room'));
  });

  it('handlePostBooking should return a bookingId', async () => {
    // Mock das funções usadas pela handlePostBooking
    jest.spyOn(bookingService, 'validateUserBooking').mockResolvedValueOnce();
    jest.spyOn(bookingService, 'findRoomById').mockResolvedValueOnce(generateRoomMock());
    jest.spyOn(roomRepository, `receiveRoom`).mockResolvedValueOnce(generateRoomMock());
    jest.spyOn(bookingRepository, `findBookingsByRoomId`).mockResolvedValueOnce([generateBookingMock()]);
    jest.spyOn(bookingRepository, `findBookingByUserId`).mockResolvedValueOnce(null);
    jest
      .spyOn(bookingService, 'findReservedRooms')
      .mockResolvedValueOnce([generateBookingMock(), generateBookingMock()]);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce({
      TicketType: { ...mockTicketType },
      ...mockTicketPaid,
    });

    jest.spyOn(enrollmentRepository, `findWithAddressByUserId`).mockResolvedValueOnce(mockEnrollment1);
    jest.spyOn(bookingService, 'checkUserReserve').mockResolvedValueOnce();
    jest.spyOn(bookingRepository, 'createBooking').mockResolvedValueOnce(generateBookingMock());
    const response = await bookingService.handlePostBooking(1, 1);
    expect(response).toEqual({
      bookingId: expect.any(Number),
    });
  });

  it('handlePutBooking should return a bookingId', async () => {
    // Mock das funções usadas pela handlePostBooking
    jest.spyOn(bookingService, 'findRoomById').mockResolvedValueOnce(generateRoomMock());
    jest.spyOn(roomRepository, `receiveRoom`).mockResolvedValueOnce(generateRoomMock());
    jest.spyOn(bookingRepository, `findBookingsByRoomId`).mockResolvedValueOnce([generateBookingMock()]);
    jest.spyOn(bookingRepository, `findBookingByUserId`).mockResolvedValueOnce(null);
    jest
      .spyOn(bookingService, 'findReservedRooms')
      .mockResolvedValueOnce([generateBookingMock(), generateBookingMock()]);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce({
      TicketType: { ...mockTicketType },
      ...mockTicketPaid,
    });

    jest.spyOn(enrollmentRepository, `findWithAddressByUserId`).mockResolvedValueOnce(mockEnrollment1);
    jest.spyOn(bookingRepository, 'createBooking').mockResolvedValueOnce(generateBookingMock());
    jest
      .spyOn(bookingRepository, 'findBookingByUserId')
      .mockResolvedValueOnce({ ...generateBookingMock(), Room: { ...generateRoomMock() } });
    jest.spyOn(bookingRepository, 'updateBooking').mockResolvedValueOnce(generateBookingMock());
    const response = await bookingService.handlePutBooking(1, 1, 1);
    expect(response).toEqual({
      bookingId: expect.any(Number),
    });
  });
});
