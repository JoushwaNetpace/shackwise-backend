import { FilterQuery } from 'mongoose';
import { getPaginator } from '../../utils/getPaginator';
import Notification, { INotificationDocument } from './notification.model';
import {
  NotificationSchemaType,
  UpdateNotificationSchemaType,
  GetNotificationsSchemaType,
} from './notification.schema';
import { MongoIdSchemaType } from '../../common/common.schema';

export const updateNotification = async (
  notificationId: string,
  payload: UpdateNotificationSchemaType,
): Promise<INotificationDocument> => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId },
    { $set: { ...payload } },
    { new: true },
  );

  if (!notification) throw new Error('Notification not found');

  return notification.toObject();
};

export const getNotificationById = async (
  notificationId: string,
  select?: string,
) => {
  const notification = await Notification.findOne({
    _id: notificationId,
  }).select(select ?? '');

  if (!notification) {
    throw new Error('Notification not found');
  }

  return notification.toObject();
};

export const getNotificationByUserId = async (
  userId: MongoIdSchemaType,
  payload: GetNotificationsSchemaType,
) => {
  try {
    const { limitParam, pageParam, searchString } = payload;

    const conditions: FilterQuery<INotificationDocument> = { userId };

    if (searchString) {
      conditions.$or = [
        { title: { $regex: searchString, $options: 'i' } },
        { body: { $regex: searchString, $options: 'i' } },
      ];
    }

    // Count total records for pagination
    const totalRecords = await Notification.countDocuments(conditions);

    const paginatorInfo = getPaginator(limitParam, pageParam, totalRecords);

    const results = await Notification.aggregate([
      { $match: conditions },
      {
        $lookup: {
          from: 'connectionrequests',
          localField: 'connectId',
          foreignField: '_id',
          as: 'connectId',
        },
      },
      { $unwind: { path: '$connectId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'connectId.senderId',
          foreignField: '_id',
          as: 'connectId.senderId',
        },
      },
      {
        $unwind: {
          path: '$connectId.senderId',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: paginatorInfo.skip },
      { $limit: paginatorInfo.limit },
      {
        $project: {
          _id: 1,
          userId: 1,
          title: 1,
          body: 1,
          notificationType: 1,
          isRead: 1,
          connectId: {
            _id: '$connectId._id',
            status: '$connectId.status',
            isRead: '$connectId.isRead',
            createdAt: '$connectId.createdAt',
            updatedAt: '$connectId.updatedAt',
            senderId: '$connectId.senderId',
            receiverId: '$connectId.receiverId',
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return { results, paginatorInfo };
  } catch (error: any) {
    throw new Error(
      `Error fetching notifications for userId ${userId}: ${error.message}`,
    );
  }
};

export const deleteNotification = async (notificationId: MongoIdSchemaType) => {
  const notification = await Notification.findByIdAndDelete({
    _id: notificationId.id,
  });

  if (!notification) {
    throw new Error('Notification not found');
  }
};

export const getNotifications = async (
  userId: MongoIdSchemaType,
  payload: GetNotificationsSchemaType,
) => {
  const { _id } = userId;
  const currentUser = await Notification.find({ userId: _id });
  if (!currentUser) {
    throw new Error('User must be logged in');
  }

  const conditions: FilterQuery<INotificationDocument> = {};

  if (payload.searchString) {
    conditions.$or = [
      { title: { $regex: payload.searchString, $options: 'i' } },
      { body: { $regex: payload.searchString, $options: 'i' } },
      { type: { $regex: payload.searchString, $options: 'i' } },
    ];
  }

  const totalRecords = await Notification.countDocuments(conditions);
  const paginatorInfo = getPaginator(
    payload.limitParam,
    payload.pageParam,
    totalRecords,
  );

  const results = await Notification.find(conditions)
    .limit(paginatorInfo.limit)
    .skip(paginatorInfo.skip)
    .exec();

  return {
    results,
    paginatorInfo,
  };
};

export const createNotification = async (
  payload: NotificationSchemaType,
): Promise<INotificationDocument> => {
  console.log('>>', payload);
  const createdNotification = await Notification.create({
    ...payload,
  });

  return createdNotification.toObject();
};
