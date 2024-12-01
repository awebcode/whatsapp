import type { Request, Response, NextFunction } from "express";
import { loggerInstance } from "../config/logger.config";
import { z, ZodError } from "zod";
import { formatErrorMessage, getStatusCode } from "../libs/utils";
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError | ZodError | string, // Accepting string errors as well
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Format the error message
  const message = formatErrorMessage(err);

  // Get the appropriate status code
  const statusCode = getStatusCode(err);

  // Log the error for debugging purposes
  loggerInstance.error(message);

  // Send the error response
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};
// 404
export const NotFoundExceptionMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const error = new AppError(`Cannot find ${req.originalUrl} on this server`, 404);
  next(error);
};
