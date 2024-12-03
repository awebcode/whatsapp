import type { Request, Response, NextFunction } from "express";
import { loggerInstance } from "../config/logger.config";
import { z, ZodError } from "zod";
import { extractErrorLine, formatErrorMessage, getStatusCode } from "../libs/utils";
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
  // Extract error path details
  const errorPath = `${req.method} ${req.originalUrl}`;
  const errorStack = err instanceof Error ? err.stack : undefined;
  const errorLine = errorStack ? extractErrorLine(errorStack) : "N/A";
  // Log the error along with the path
  loggerInstance.error(`Error at ${errorPath} at ${errorLine}: ${message}`, {
    statusCode,
  });

  // Send the error response
  res.status(statusCode).json({
    success: false,
    status: "error",
    statusCode,
    message,
    errorLine,
  });
};
// 404
export const NotFoundExceptionMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
};
