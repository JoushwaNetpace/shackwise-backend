import fbAdmin from '../lib/firebase-admin.service';
import { PushNotificationPayload } from '../types';

export const sendPushNotification = async ({
  title,
  body,
  token,
  connectId,
  notificationType,
  isRead,
}: PushNotificationPayload): Promise<unknown> => {
  const message = {
    notification: {
      title,
      body,
    },
    data: {
      ...(connectId && { connectId: connectId.toString() }),
      notificationType: notificationType.toString(),
      ...(typeof isRead !== 'undefined' && { isRead: isRead.toString() }),
    },
    token,
  };

  try {
    const response = await fbAdmin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
