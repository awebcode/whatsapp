import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import prisma from "../../libs/prisma";
import { AppError } from "../../middlewares/errors-handle.middleware";
import type { Response } from "express";
import type { User } from "@prisma/client"; // Assuming User type is defined in Prisma schema
import { envConfig } from "../../config/env.config";
import { getCookieOptions } from "../../config/cookie.config";
import { sendEmail } from "../../config/mailer.config";
import type { LoginDTO, RegisterDTO } from "./user.dtos";

/**
 * Register a new user
 * @param  {RegisterDTO} - username, email and password
 * @returns  - User
 */
const createUser = async ({ username, email, password }: RegisterDTO) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { username, email, password: hashedPassword },
  });
};

/**
 * Login an existing user
 * @param  {LoginDTO} - email and password
 * @returns  - User
 */
const loginUser = async ({ email, password }: LoginDTO) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = await generateToken({ userId: user.id }, "1h", "access");
  const refreshToken = await generateToken({ userId: user.id }, "7d", "refresh");
  return { user: userResponse(user), ...formatTokens(accessToken, refreshToken) };
};

/**
 * Get user by id
 * @param id - User id
 * @returns  - User
 */
export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return userResponse(user);
};

/** Generate JWT token
 * @param payload - User id
 * @param expiresIn - Token expiration time
 * @param type - Token type
 * @returns - JWT token
 */
const generateToken = async (
  payload: { userId: string },
  expiresIn: string = "1h",
  type: "access" | "refresh"
) => {
  const secret = type === "access" ? envConfig.jwtSecret : envConfig.refreshTokenSecret;
  return jwt.sign(payload, secret, { expiresIn });
};
/**
 * Verify JWT token
 * @param token
 * @param secret
 * @returns jwt payload
 */
const verifyToken = async (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }
};

/**
 * Format tokens
 * @param accessToken
 * @param refreshToken
 * @returns tokens
 */
const formatTokens = (accessToken: string, refreshToken: string) => ({
  accessToken,
  refreshToken,
  expiresAccessTokenAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  expiresRefreshTokenAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
});

/** Format user data for response
 * @param user
 * @returns user data
 */
const userResponse = (user: User) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  status: user.status,
  lastSeenAt: user.lastSeenAt,
  createdAt: user.createdAt,
});

/** Set cookies on the client
 * @param response
 * @param accessToken
 * @param refreshToken
 *
 */
const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie("access_token", accessToken, getCookieOptions(60 * 60)); // 1 hour
  res.cookie("refresh_token", refreshToken, getCookieOptions(60 * 60 * 24 * 7)); // 7 days
};

/** Clear cookies on the client
 * @param response
 *
 */

const clearCookies = (res: Response) => {
  res.cookie("access_token", "", getCookieOptions(0));
  res.cookie("refresh_token", "", getCookieOptions(0));
};

/** Generate reset token
 * @param email
 * @returns reset token
 */
const generateResetToken = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("User does not exist", 404);
  }

  const token = randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour expiry
    },
  });

  const link = `${envConfig.clientUrl}/reset-password/${token}`;
  await sendEmail(
    email,
    user.username || "User",
    "Reset Your Password",
    `Click the link below to reset your password: ${link}`,
    link
  );
};
/** Reset password
 * @param token
 * @param newPassword
 * */
const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { resetToken: token } });
  if (!user || (user.resetTokenExpiry && user.resetTokenExpiry < new Date())) {
    throw new AppError("Invalid or expired token", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { resetToken: token },
    data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
  });
};

// Exporting all services
export {
  createUser,
  loginUser,
  generateToken,
  verifyToken,
  formatTokens,
  userResponse,
  setCookies,
  clearCookies,
  generateResetToken,
  resetPassword,
};
