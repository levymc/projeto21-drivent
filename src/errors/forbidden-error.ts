import { RequestError } from '@/protocols';

export function forbiddenError(message: string, status: number): RequestError {
  return {
    name: 'ForbiddenError',
    message,
    status,
  };
}
