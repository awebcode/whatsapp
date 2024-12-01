import type { Request, Response, NextFunction } from "express";
import { loggerInstance } from "../config/logger.config";
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


export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";
 
  loggerInstance.error(err.message || err);
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