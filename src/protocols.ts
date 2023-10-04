import { Room, Payment, Ticket, Address } from '@prisma/client';

export type ApplicationError = {
  name: string;
  message: string;
};

export type RequestError = {
  status: number;
  data?: object | null;
  statusText?: string;
  name: string;
  message: string;
};

export type ViaCEPAddressError = {
  error: boolean;
};

export type AddressEnrollment = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type CEP = {
  cep: string;
};

export type CreateTicketParams = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

export type InputTicketBody = {
  ticketTypeId: number;
};

export type CardPaymentParams = {
  issuer: string;
  number: string;
  name: string;
  expirationDate: string;
  cvv: string;
};

export type InputPaymentBody = {
  ticketId: number;
  cardData: CardPaymentParams;
};

export type PaymentParams = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

type RoomRented = Omit<Room, 'id' | 'createdAt' | 'updatedAt'>;

export type BookingWithRoom = {
  id: number;
  Room: RoomRented;
};

export type EnrollmentMockType = {
  id: number;
  name: string;
  cpf: string;
  birthday: Date;
  phone: string;
  userId: number;
  Address: Address[];
  createdAt: Date;
  updatedAt: Date;
};
