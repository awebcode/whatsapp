import { z } from "zod";

// Schema for creating a new message
export const CreateMessageSchema = z.object({
  content: z.string().min(1, "Message content cannot be empty"),
  senderId: z.string().uuid("Invalid sender ID format"),
  chatId: z.string().uuid("Invalid chat ID format"),
});

// Schema for fetching messages by chatId
export const GetMessagesSchema = z.object({
  chatId: z.string().uuid("Invalid chat ID format"),
});

// Schema for marking a message as seen
export const MarkMessageAsSeenSchema = z.object({
  messageId: z.string().uuid("Invalid message ID format"),
  id: z.string().uuid("Invalid user ID format"),
});

// Type definitions (optional but helpful for type inference)
export type CreateMessageDto = z.infer<typeof CreateMessageSchema>;
export type GetMessagesDto = z.infer<typeof GetMessagesSchema>;
export type MarkMessageAsSeenDto = z.infer<typeof MarkMessageAsSeenSchema>;
