import { Request, Response } from 'express';
import { AppError } from '@/errors/AppError';
import logger from '@/config/logger';

export function errorHandler(err: Error, _req: Request, res: Response): Response {
  if (err instanceof AppError) {
    logger.error({ type: err.name, err });
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  logger.error({ type: 'AppError Fatal', err });

  return res.status(500).json({
    message: `Internal server error`,
  });
}
