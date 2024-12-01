import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { getCookieOptions } from "../config/cookie.config"; // Adjust path as necessary
import { loggerInstance } from "../config/logger.config";
import { AppError } from "./errors-handle.middleware";
import { envConfig } from "../config/env.config";

const tokenCache = new Map<string, JwtPayload>(); // In-memory cache

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let accessToken = extractTokenFromCookies(req, "access_token");

    // Check if token exists in cache
    if (accessToken && tokenCache.has(accessToken)) {
      loggerInstance.info({ message: "Found token in cache", status: 200 });
      req.user = tokenCache.get(accessToken) as any;
      return next();
    }

    // Verify access token
    if (accessToken && isTokenValid(accessToken, envConfig.jwtSecret)) {
      const decoded = jwt.verify(accessToken, envConfig.jwtSecret) as JwtPayload;
      tokenCache.set(accessToken, decoded);
      req.user = decoded as any;
      return next();
    }

    // Handle expired or invalid access token
    const refreshToken = extractTokenFromCookies(req, "refresh_token");
    if (!refreshToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    const refreshTokenPayload = jwt.verify(
      refreshToken,
      envConfig.refreshTokenSecret
    ) as JwtPayload;

    accessToken = jwt.sign(
      { userId: refreshTokenPayload.userId, role: refreshTokenPayload.role },
      envConfig.jwtSecret,
      { expiresIn: "1h" }
    );

    res.cookie("access_token", accessToken, getCookieOptions(60 * 60)); // 1 hour expiration
    tokenCache.set(accessToken, {
      userId: refreshTokenPayload.userId,
      role: refreshTokenPayload.role,
    });
    req.user = refreshTokenPayload as any;
    return next();
  } catch (error) {
    loggerInstance.error({ message: "Error during authentication", error, status: 401 });
    // Handle error
    throw new AppError("Invalid token or error during authentication", 401);
  }
};

// Helper functions
const extractTokenFromCookies = (req: Request, tokenName: string): string | null => {
  return req.cookies[tokenName] || req.headers.authorization?.split(" ")[1] || null;
};

const isTokenValid = (token: string, secret: string): boolean => {
  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
};
