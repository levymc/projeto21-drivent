import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { ApplicationError, RequestError } from '@/protocols';
import logger from '@/config/logger';

export function handleApplicationErrors(
  err: RequestError | ApplicationError | Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err.name === 'CannotEnrollBeforeStartDateError') {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: err.message,
    });
  }

  if (err.name === 'ConflictError' || err.name === 'DuplicatedEmailError') {
    return res.status(httpStatus.CONFLICT).json({
      message: err.message,
    });
  }

  if (err.name === 'InvalidCredentialsError' || err.name === 'JsonWebTokenError') {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: err.message,
    });
  }

  if (err.name === 'InvalidDataError') {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: err.message,
    });
  }

  if (err.name === 'NotFoundError') {
    return res.status(httpStatus.NOT_FOUND).json({
      message: err.message,
    });
  }

  if (err.name === 'DuplicatedEmailError') {
    return res.status(httpStatus.CONFLICT).json({
      message: err.message,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: err.message,
    });
  }

  if (err.name === 'EnrollmentNotFoundError') {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  if (err.name === 'InvalidCEPError') {
    return res.status(httpStatus.BAD_REQUEST).json({ mensagem: err.message });
  }

  if (err.name === 'CannotListHotelsError') {
    return res.status(httpStatus.PAYMENT_REQUIRED).json({ mensagem: err.message });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(httpStatus.FORBIDDEN).json({ mensagem: err.message });
  }

  if (err.hasOwnProperty('status') && err.name === 'RequestError') {
    return res.status((err as RequestError).status).json({
      message: err.message,
    });
  }

  /* eslint-disable-next-line no-console */
  logger.error(err);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    error: 'InternalServerError',
    message: 'Internal Server Error',
  });
}
