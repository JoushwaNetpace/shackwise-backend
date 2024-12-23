import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoIdSchemaType } from '../../common/common.schema';
import { errorResponse, successResponse } from '../../utils/api.utils';
import { generateRandomPassword } from '../../utils/auth.utils';
import { CreateUserSchemaType, GetUsersSchemaType } from './user.schema';
import {
  createUser,
  deleteUser,
  getUserConnectionList,
  getUsers,
  updateUser,
} from './user.services';
import { UserType } from './user.dto';
import { SendNotificationQueue } from '../../queues/notification.queue';

export const handleDeleteUser = async (
  req: Request<MongoIdSchemaType, unknown>,
  res: Response,
) => {
  await deleteUser({ id: req.params.id });

  return successResponse(res, 'User has been deleted');
};
export const handleUpdateUser = async (
  req: Request<{ userId: string }, unknown, UserType>,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const data = req.body;
    // Use the updateUser service to update the user with the given data
    const updatedUser = await updateUser(userId, data);

    return successResponse(
      res,
      'User has been updated successfully',
      updatedUser,
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while updating the user',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};
export const handleCreateUser = async (
  req: Request<unknown, unknown, CreateUserSchemaType>,
  res: Response,
) => {
  const data = req.body;

  const user = await createUser({
    ...data,
    password: generateRandomPassword(),
    role: 'HOME_BUYER',
  });

  return successResponse(
    res,
    'Email has been sent to the user',
    user,
    StatusCodes.CREATED,
  );
};
export const handleSendNotification = async (
  req: Request<
    any,
    unknown,
    { userId: string; title: string; body: string; token: string }
  >,
  res: Response,
) => {
  const { title, body, token, userId } = req.body;
  await SendNotificationQueue.add('send-user-notification', {
    userId: userId,
    title: title,
    body: body,
    connectId: null,
    notificationType: 'GENERAL',
    token: token,
  });
  return successResponse(
    res,
    'Notification has been sent to the  user',
    {},
    StatusCodes.ACCEPTED,
  );
};

export const handleCreateSuperAdmin = async (
  _: Request<unknown, unknown, unknown>,
  res: Response,
) => {
  const password = 'Pa$$w0rd!';

  const user = await createUser({
    email: 'admin@mailinator.com',
    name: 'Super Admin',
    username: 'super_admin',
    password: password,
    role: 'SUPER_ADMIN',
    phoneNo: '123456789',
  });

  return successResponse(
    res,
    'Super Admin has been created',
    { email: user.email, password },
    StatusCodes.CREATED,
  );
};

export const handleGetUsers = async (
  req: Request<unknown, unknown, unknown, GetUsersSchemaType>,
  res: Response,
) => {
  const { results, paginatorInfo } = await getUsers(
    {
      id: req.user.sub,
    },
    req.query,
  );

  return successResponse(res, undefined, { results, paginatorInfo });
};
export const handleGetUserConnectionList = async (
  req: Request,
  res: Response,
) => {
  const results = await getUserConnectionList(req.user);

  return successResponse(res, undefined, results);
};
