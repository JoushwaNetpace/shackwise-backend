import * as z from 'zod';

// Define a schema for a notification
export const notificationSchema = z.object({
  userId: z.string({ required_error: 'User ID is required' }), // User ID reference
  title: z.string({ required_error: 'Title is required' }),
  body: z.string({ required_error: 'Body is required' }),
  // type: z.string({ required_error: 'Type is required' }),
  token: z.string().optional(),
  connectId: z.string().optional(),
  notificationType: z.enum(
    ['GENERAL', 'COMPARE_REQUEST', 'SHARE_REQUEST', 'CONNECTION_REQUEST'],
    {
      required_error: 'Notification type is required',
    },
  ),
  isRead: z.boolean().default(false),
});

// Update schema for updating a notification
export const updateNotificationSchema = z.object({
  userId: z.string({ required_error: 'User ID is required' }).optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  // type: z.string().optional(),
  connectId: z.string().optional(),
  notificationType: z
    .enum(['GENERAL', 'COMPARE_REQUEST', 'SHARE_REQUEST', 'CONNECTION_REQUEST'])
    .optional(),
  isRead: z.boolean().optional(),
});

// Schema for pagination and filtering
export const getNotificationsSchema = z.object({
  searchString: z.string().optional(),
  limitParam: z
    .string()
    .default('10')
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) >= 0,
      'Input must be a positive integer',
    )
    .transform(Number),
  pageParam: z
    .string()
    .default('1')
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) >= 0,
      'Input must be a positive integer',
    )
    .transform(Number),
});

// Schema for the notification ID in params
export const updateNotificationParamsSchema = z.object({
  notificationId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid notification ID format'),
});

// Schema for paginated response
export const notificationsPaginatedSchema = z.object({
  results: z.array(
    notificationSchema.extend({
      id: z.string(),
      createdDate: z.date(),
      updatedDate: z.date().optional(),
    }),
  ),
  paginatorInfo: z.object({
    totalRecords: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    hasNextPage: z.boolean(),
  }),
});
export const getNotificationByUserIdSchema = z.object({
  limitParam: z
    .string()
    .default('10')
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) > 0,
      'Limit must be a positive integer',
    )
    .transform(Number),
  pageParam: z
    .string()
    .default('1')
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) > 0,
      'Page must be a positive integer',
    )
    .transform(Number),
});
// Export types
export type NotificationSchemaType = z.infer<typeof notificationSchema>;
export type UpdateNotificationSchemaType = z.infer<
  typeof updateNotificationSchema
>;
export type GetNotificationsSchemaType = z.infer<typeof getNotificationsSchema>;
export type GetNotificationsByUserIdSchemaType = z.infer<
  typeof getNotificationByUserIdSchema
>;
export type UpdateNotificationParamsSchemaType = z.infer<
  typeof updateNotificationParamsSchema
>;
export type NotificationsPaginatedSchemaType = z.infer<
  typeof notificationsPaginatedSchema
>;
