import type { CookieOptions as ExpressCookieOptions } from "express";
import { envConfig } from "./env.config";

const baseCookieOptions: ExpressCookieOptions = {
  httpOnly: true,
  secure: envConfig.nodeEnv === "production",
  sameSite: "strict",
  path: "/",
};

export const getCookieOptions = (maxAge: number): ExpressCookieOptions => ({
  ...baseCookieOptions,
  maxAge: maxAge * 1000, // Convert seconds to milliseconds
});
