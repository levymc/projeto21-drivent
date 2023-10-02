import { ApplicationError } from '@/protocols';

export function PaymentError(name: string, message: string): ApplicationError {
  return {
    name,
    message,
  };
}
