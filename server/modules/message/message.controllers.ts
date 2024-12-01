// controllers/messageController.ts
import type { NextFunction, Request, Response } from "express";
import * as messageService from "./message.services";
import { validateZodMiddleware } from "../../middlewares/validate-zod.middleware";
import { CreateMessageSchema, type CreateMessageDto } from "./message.dtos";
import type { TypedRequestBody } from "../../types/index.types";

const sendMessage = [
  validateZodMiddleware(CreateMessageSchema),
  async (req: TypedRequestBody<CreateMessageDto>, res: Response, next: NextFunction) => {
    try {
      const { content, chatId } = req.body;
      const message = await messageService.createMessage({
        content,
        senderId: req.user.id,
        chatId,
      });
      res.status(201).json(message);
    } catch (err) {
      next(err);
    }
  },
];

const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId } = req.params;
    const messages = await messageService.getMessages({ chatId });
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

const markMessageAsSeen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params;
    await messageService.markMessageAsSeen({ messageId, userId: req.user.id });
    res.status(200).json({ message: "Message marked as seen" });
  } catch (err) {
    next(err);
  }
};

export { sendMessage, getMessages, markMessageAsSeen };
