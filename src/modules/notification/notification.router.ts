import { canAccess } from '../../middlewares/can-access.middleware';
import MagicRouter from '../../openapi/magic-router';
import {
  handleCreateNotification,
  handleGetNotifications,
  handleUpdateNotification,
  handleDeleteNotification,
  handleGetNotificationById,
  handleGetNotificationByUserId,
} from './notification.controller';
import {
  notificationsPaginatedSchema,
  updateNotificationParamsSchema,
  updateNotificationSchema,
  getNotificationsSchema,
  notificationSchema,
} from './notification.schema';

export const NOTIFICATION_ROUTER_ROOT = '/notification';

const notificationRouter = new MagicRouter(NOTIFICATION_ROUTER_ROOT);

// Route to fetch a user notification by its userId
notificationRouter.get(
  '/user-notification',
  {},
  canAccess('roles', ['HOME_BUYER', 'HOME_AGENT']),
  handleGetNotificationByUserId,
);

// Route to fetch all notifications with optional pagination and filters
notificationRouter.get(
  '/',
  {
    requestType: { query: getNotificationsSchema },
    responseModel: notificationsPaginatedSchema,
  },
  canAccess(),
  handleGetNotifications,
);

// Route to fetch a single notification by its ID
notificationRouter.get(
  '/:notificationId',
  { requestType: { params: updateNotificationParamsSchema } },
  canAccess(),
  handleGetNotificationById,
);

// Route to create a new notification
notificationRouter.post(
  '/',
  { requestType: { body: notificationSchema } },
  canAccess('roles', ['SUPER_ADMIN', 'HOME_AGENT', 'HOME_BUYER']),
  handleCreateNotification,
);

// Route to update an existing notification
notificationRouter.patch(
  '/:notificationId',
  {
    requestType: {
      params: updateNotificationParamsSchema,
      body: updateNotificationSchema,
    },
  },
  canAccess('roles', ['SUPER_ADMIN', 'HOME_AGENT', 'HOME_BUYER']),
  handleUpdateNotification,
);

// Route to delete a notification
notificationRouter.delete(
  '/:notificationId',
  { requestType: { params: updateNotificationParamsSchema } },
  canAccess('roles', ['SUPER_ADMIN']),
  handleDeleteNotification,
);

export default notificationRouter.getRouter();
