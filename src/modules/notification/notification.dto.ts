import z from 'zod';
import { definePaginatedResponse } from '../../common/common.utils';

// Enum for notification types
export const NotificationTypeEnum = z.enum([
  'GENERAL',
  'COMPARE_REQUEST',
  'SHARE_REQUEST',
  'CONNECTION_REQUEST',
]);

// Base schema for notification model
export const notificationSchema = z.object({
  _id: z.string(), // Primary key (MongoDB default)
  userId: z.string(), // Foreign key to USER table
  title: z.string(),
  body: z.string(),
  type: z.string(),
  connectId: z.string(),
  notificationType: NotificationTypeEnum, // Using enum for notification type
  isRead: z.boolean().default(false),
});

// Pagination schema
export const notificationsPaginatedSchema =
  definePaginatedResponse(notificationSchema);

// Export types
export type NotificationModelType = z.infer<typeof notificationSchema>;
export type NotificationType = z.infer<typeof notificationSchema> & {
  _id: string;
};
export type NotificationPaginatedType = z.infer<
  typeof notificationsPaginatedSchema
>;
