import logger from '../lib/logger.service';
import { Queue } from '../lib/queue.server';
import { getIo } from '../lib/realtime.server';
import { NotificationSchemaType } from '../modules/notification/notification.schema';
import { createNotification } from '../modules/notification/notification.services';
import { sendPushNotification } from '../utils/fcm.utils';

export const SendNotificationQueue = Queue<NotificationSchemaType>(
  'NotificationSendQueue',
  async (job) => {
    try {
      const { data } = job;

      await createNotification({
        ...data,
      });
      // send fcm notification
      await sendPushNotification({ ...data });

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
