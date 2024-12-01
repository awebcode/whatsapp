// services/messageService.ts

import prisma from "../../libs/prisma";
import type {
  CreateMessageDto,
  GetMessagesDto,
  MarkMessageAsSeenDto,
} from "./message.dtos";

const createMessage = async ({ content, senderId, chatId }: CreateMessageDto) => {
  return await prisma.message.create({
    data: {
      content,
      senderId,
      chatId,
    },
  });
};

const getMessages = async ({ chatId }: GetMessagesDto) => {
  return await prisma.message.findMany({
    where: { chatId },
    include: { sender: true },
    orderBy: { sentAt: "asc" },
  });
};

const markMessageAsSeen = async (data: MarkMessageAsSeenDto) => {
  const { messageId, id } = data;
  return await prisma.messageSeen.create({
    data: {
      messageId,
      id,
    },
  });
};

export { createMessage, getMessages, markMessageAsSeen };
