import {
  ForgotPasswordTypePayload,
  SendResetPasswordTypePayload,
  SendVerificationEmailTypePayload,
  sendForgotPasswordEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
} from '../email/email.service';
import logger from '../lib/logger.service';
import { Queue } from '../lib/queue.server';

export const ResetPasswordQueue = Queue<SendResetPasswordTypePayload>(
  'ResetPasswordQueue',
  async (job) => {
    try {
      const { data } = job;

      await sendResetPasswordEmail({
        ...data,
      });

      return true;
    } catch (err) {
      if (err instanceof Error) logger.error(err.message);

      throw err;
    }
  },
);
export const SendVerificationEmailQueue =
  Queue<SendVerificationEmailTypePayload>(
    'VerificationEmailQueue',
    async (job) => {
      try {
        const { data } = job;

        await sendVerificationEmail({
          ...data,
        });

        return true;
      } catch (err) {
        if (err instanceof Error) logger.error(err.message);

        throw err;
      }
    },
  );
export const SendForgotPasswordEmailQueue = Queue<ForgotPasswordTypePayload>(
  'ForgotPasswordEmailQueue',
  async (job) => {
    try {
      const { data } = job;

      await sendForgotPasswordEmail({
        ...data,
      });

      return true;
    } catch (err) {
      if (err instanceof Error) logger.error(err.message);

      throw err;
    }
  },
);
