// controllers/userController.ts
import type { Request, Response, NextFunction } from "express";
import * as userService from "./user.services";
import {
  LoginSchema,
  RegisterSchema,
  type LoginDTO,
  type RegisterDTO,
} from "./user.dtos";
import { validateZodMiddleware } from "../../middlewares/validate-zod.middleware";
import type { TypedRequestBody } from "../../types/index.types";
//** Register user */
const register = [
  validateZodMiddleware(RegisterSchema),
  async (req: TypedRequestBody<RegisterDTO>, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;
      const user = await userService.createUser({ username, email, password });
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },
];

//** Login user */
const login = [
  validateZodMiddleware(LoginSchema),
  async (req: TypedRequestBody<LoginDTO>, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken, ...rest } = await userService.loginUser({
        email,
        password,
      });

      // Set cookies on client
      userService.setCookies(res, accessToken, refreshToken);
      res.status(200).json({ user, ...rest });
    } catch (err) {
      next(err);
    }
  },
];

//** Logout user */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    userService.clearCookies(res);
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
};

//** Get user profile */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export { register, login };
