import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoIdSchemaType } from '../../common/common.schema';
import { errorResponse, successResponse } from '../../utils/api.utils';
import {
  createNotification,
  deleteNotification,
  getNotifications,
  updateNotification,
  getNotificationById,
  getNotificationByUserId,
} from './notification.services';
import {
  NotificationSchemaType,
  UpdateNotificationSchemaType,
  GetNotificationsSchemaType,
  GetNotificationsByUserIdSchemaType,
} from './notification.schema';

export const handleDeleteNotification = async (
  req: Request<MongoIdSchemaType, unknown>,
  res: Response,
) => {
  try {
    await deleteNotification({ id: req.params.id });

    return successResponse(res, 'Notification has been deleted');
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while deleting the notification',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleUpdateNotification = async (
  req: Request<
    { notificationId: string },
    unknown,
    UpdateNotificationSchemaType
  >,
  res: Response,
) => {
  try {
    const { notificationId } = req.params;
    const data = req.body;

    const updatedNotification = await updateNotification(notificationId, data);

    return successResponse(
      res,
      'Notification has been updated successfully',
      updatedNotification,
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while updating the notification',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleCreateNotification = async (
  req: Request<unknown, unknown, NotificationSchemaType>,
  res: Response,
) => {
  try {
    const data = req.body;

    const notification = await createNotification(data);

    return successResponse(
      res,
      'Notification has been created successfully',
      notification,
      StatusCodes.CREATED,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while creating the notification',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetNotifications = async (
  req: Request<unknown, unknown, unknown, GetNotificationsSchemaType>,
  res: Response,
) => {
  try {
    const { results, paginatorInfo } = await getNotifications(
      { _id: req.user },
      req.query,
    );

    return successResponse(res, undefined, { results, paginatorInfo });
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while fetching notifications',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetNotificationById = async (
  req: Request<{ notificationId: string }, unknown>,
  res: Response,
) => {
  try {
    const { notificationId } = req.params;

    const notification = await getNotificationById(notificationId);

    return successResponse(
      res,
      'Notification fetched successfully',
      notification,
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while fetching the notification',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetNotificationByUserId = async (
  req: Request<unknown, unknown, unknown, GetNotificationsSchemaType>,
  res: Response,
) => {
  try {
    const { _id: userId } = req.user;
    const { limitParam, pageParam, searchString } = req.query;

    const { results, paginatorInfo } = await getNotificationByUserId(userId, {
      limitParam,
      pageParam,
      searchString,
    });

    return successResponse(
      res,
      'User notifications fetched successfully',
      { results, paginatorInfo },
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while fetching user notifications',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};
