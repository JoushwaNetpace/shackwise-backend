import logger from '../lib/logger.service';
import { Queue } from '../lib/queue.server';
import { getIo } from '../lib/realtime.server';
import { NotificationSchemaType } from '../modules/notification/notification.schema';
import { createNotification } from '../modules/notification/notification.services';
import { getUserById } from '../modules/user/user.services';
import { sendPushNotification } from '../utils/fcm.utils';

export const SendNotificationQueue = Queue<NotificationSchemaType>(
  'NotificationSendQueue',
  async (job) => {
    try {
      const { data } = job;

      // get user fcm token
      const userInfo = await getUserById(data.userId);
      console.log('userInfo>>', userInfo);

      await createNotification({
        ...data,
        token: userInfo.fcmToken,
      });
      console.log('userInfo.fcmToken>>', userInfo.fcmToken);
      if (userInfo.fcmToken != '') {
        // send fcm notification
        await sendPushNotification({ ...data, token: userInfo.fcmToken });
      }

      // Access the `io` instance and emit a notification event
      const io = getIo();
      io.to(data.userId).emit('new-notification', data);

      return true;
    } catch (err) {
      if (err instanceof Error) logger.error(err.message);

      throw err;
    }
  },
);
