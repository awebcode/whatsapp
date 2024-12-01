import { z, ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errors-handle.middleware";

export  function validateZodMiddleware(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); // Validate the request body
      next(); // Proceed if validation passes
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Extract error messages
        const messages = error.errors.map((e) =>e.message.toLowerCase()==="required"? `${e.path[0]} is ${e.message}`: e.message).join(", ");
        next(new AppError(messages, 400)); // Pass errors to the global error handler
      } else {
        next(error); // Pass other errors
      }
    }
  };
}
