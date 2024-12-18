import { canAccess } from '../../middlewares/can-access.middleware';
import MagicRouter from '../../openapi/magic-router';
import {
  handleCreateSuperAdmin,
  handleCreateUser,
  handleGetUserConnectionList,
  handleGetUsers,
  handleSendNotification,
  handleUpdateUser,
} from './user.controller';
import { usersPaginatedSchema } from './user.dto';
import {
  createUserSchema,
  getUsersSchema,
  sendUserNotificationSchema,
  updateUserParamsSchema,
  updateUserSchema,
} from './user.schema';

export const USER_ROUTER_ROOT = '/users';

const userRouter = new MagicRouter(USER_ROUTER_ROOT);

userRouter.get(
  '/',
  {
    requestType: { query: getUsersSchema },
    responseModel: usersPaginatedSchema,
  },
  canAccess(),
  handleGetUsers,
);
userRouter.get(
  '/connection-list',
  {},
  canAccess('roles', ['SUPER_ADMIN', 'HOME_BUYER', 'HOME_AGENT']),
  handleGetUserConnectionList,
);

userRouter.post(
  '/user',
  { requestType: { body: createUserSchema } },
  canAccess('roles', ['SUPER_ADMIN']),
  handleCreateUser,
);
userRouter.post(
  '/user-notification',
  { requestType: { body: sendUserNotificationSchema } },

  handleSendNotification,
);

userRouter.patch(
  '/user/:userId',
  { requestType: { params: updateUserParamsSchema, body: updateUserSchema } },
  canAccess('roles', ['SUPER_ADMIN', 'HOME_BUYER', 'HOME_AGENT']),
  handleUpdateUser,
);

userRouter.post('/_super-admin', {}, handleCreateSuperAdmin);

export default userRouter.getRouter();
