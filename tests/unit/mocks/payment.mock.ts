import { Payment } from '@prisma/client';

// Defina um tipo para o objeto mockPayment com base na estrutura do modelo Payment
type PaymentMockType = Payment;

// Crie um objeto mockPayment com os valores desejados
export const mockPayment: PaymentMockType = {
  id: 1,
  ticketId: 2, // Substitua pelo ID do ingresso relacionado
  value: 1000, // Substitua pelo valor desejado
  cardIssuer: 'Banco XYZ', // Substitua pelo emissor do cartão desejado
  cardLastDigits: '1234', // Substitua pelos últimos dígitos do cartão desejados
  createdAt: new Date(),
  updatedAt: new Date(),
};
