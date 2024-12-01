// services/chatService.ts

import prisma from "../../libs/prisma";


interface CreateChat {
  name: string;
  adminId: string;
}

const createChat = async ({ name, adminId }: CreateChat) => {
  return await prisma.chat.create({
    data: {
      name,
      adminId,
    },
  });
};

const addUserToChat = async (userId: string, chatId: string) => {
  return await prisma.chatMember.create({
    data: {
      userId,
      chatId,
    },
  });
};

const getChats = async (userId: string) => {
  return await prisma.chatMember.findMany({
    where: { userId },
    include: { chat: true },
  });
};

export { createChat, addUserToChat, getChats };
