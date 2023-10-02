import { RequestError } from '@/protocols';

export function PaymentError(message: string, status: number): RequestError {
  return {
    name: 'PaymentError',
    message,
    status,
  };
}
