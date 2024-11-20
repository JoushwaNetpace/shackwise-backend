import { EmailTemplates, renderTemplate } from '../utils/email.utils';
import mailer from '../lib/email.server';
import config from '../config/config.service';

export type SendResetPasswordTypePayload = EmailTemplates['reset-password'] & {
  email: string;
};
export type SendVerificationEmailTypePayload =
  EmailTemplates['verify-email'] & {
    email: string;
    verificationLink: string;
    name: string;
  };
export type ForgotPasswordTypePayload = EmailTemplates['forgot-password'] & {
  code: string;
  name: string;
  email: string;
};

export const sendResetPasswordEmail = async (
  payload: SendResetPasswordTypePayload,
) => {
  const { email, resetLink, userName } = payload;

  await mailer.sendMail({
    from: config.EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password',
    html: renderTemplate('reset-password', { resetLink, userName }),
  });
};
export const sendVerificationEmail = async (
  payload: SendVerificationEmailTypePayload,
) => {
  const { email, verificationLink, name } = payload;
  await mailer.sendMail({
    from: config.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email',
    html: renderTemplate('verify-email', { verificationLink, name }),
  });
};
export const sendForgotPasswordEmail = async (
  payload: ForgotPasswordTypePayload,
) => {
  const { code, name, email } = payload;
  await mailer.sendMail({
    from: config.EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password',
    html: renderTemplate('forgot-password', { code, name }),
  });
};
