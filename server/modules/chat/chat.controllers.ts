// controllers/chat.controllers.ts
import type { Request, Response, NextFunction } from "express";
import * as chatService from "./chat.services";
import {
  AddUserToChatSchema,
  CreateChatSchema,
} from "./chat.dtos";

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = CreateChatSchema.parse(req.body);
    const chat = await chatService.createChat({ name, adminId: req.user.id });
    res.status(201).json(chat);
  } catch (err) {
    next(err);
  }
};

const addUserToChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId, id } = AddUserToChatSchema.parse(req.body);
    await chatService.addUserToChat(id, chatId);
    res.status(200).json({ message: "User added to chat" });
  } catch (err) {
    next(err);
  }
};

const getChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chats = await chatService.getChats(req.user.id);
    res.status(200).json(chats);
  } catch (err) {
    next(err);
  }
};

export { createChat, addUserToChat, getChats };
