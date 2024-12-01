import express from "express";
import * as userController from "./user.controllers";
const router = express.Router();
// User Routes
router.post("/register", userController.register);
router.post("/login", userController.login);

export default router;
