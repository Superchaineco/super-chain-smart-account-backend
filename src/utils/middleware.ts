import { Request, Response, NextFunction } from 'express';
import { error as loggerError } from './logger';

export const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: `uknonwn endpoint` });
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  loggerError(error.message);
  next(error);
};
