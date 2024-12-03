import { z, type ZodError } from "zod";
import { AppError } from "../middlewares/errors-handle.middleware";

export const formatRetryTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} second${seconds > 1 ? "s" : ""}`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes > 1 ? "s" : ""}${
      remainingSeconds > 0
        ? ` and ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`
        : ""
    }`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours} hour${hours > 1 ? "s" : ""}${
      remainingMinutes > 0
        ? ` and ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`
        : ""
    }${
      remainingSeconds > 0
        ? ` and ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`
        : ""
    }`;
  }
};

// Function to parse string errors into a structured object (if the error is a string)
const parseStringError = (error: string): any[] => {
  try {
    const parsedError = JSON.parse(error);
    if (Array.isArray(parsedError)) {
      return parsedError;
    }
  } catch (e) {
    return [];
  }
  return [];
};

// Function to format Zod error messages into a user-friendly format
const formatZodErrors = (errors: Array<{ path: string[]; message: string }>): string => {
  return errors
    .map(
      (e) =>
        `${e.path.join(".")} is ${
          e.message.toLowerCase() === "required" ? "required" : e.message
        }`
    )
    .join(", ");
};

// Function to format the error response when handling an AppError or ZodError
export const formatErrorMessage = (err: AppError | ZodError | string): string => {
  let message = "";

  // If the error is a string, try to parse it into a JSON object
  if (typeof err === "string") {
    const parsedErrors = parseStringError(err);
    message = parsedErrors.length
      ? parsedErrors
          .map(
            (e: { path: string[]; message: string }) =>
              `${e.path.join(".")} is ${
                e.message.toLowerCase() === "required" ? "required" : e.message
              }`
          )
          .join(", ")
      : "An unexpected error occurred.";
  }

  // If it's a ZodError, format its messages
  else if (err instanceof z.ZodError) {
    message = formatZodErrors(err.errors as any);
  }

  // If it's an AppError, use its message
  else if (typeof err === "object" && err instanceof AppError) {
    message = err.isOperational ? err.message : err.message || "Internal Server Error";
  } else if (typeof err === "object" && err as Error instanceof Error) {
    message = (err as Error).message;
  } else {
    message = "An unexpected error occurred.";
  }

  return message;
};

// Function to extract status code from the error
export const getStatusCode = (err: AppError | ZodError | string): number => {
  if (err instanceof AppError) {
    return err.statusCode;
  }
  return 500; // Default to internal server error
};


export const extractErrorLine = (stack: string): string => {
  const stackLines = stack.split("\n");
  if (stackLines.length > 1) {
    // The second line usually contains the file and line information
    return stackLines[1].trim();
  }
  return "Unknown error line";
};