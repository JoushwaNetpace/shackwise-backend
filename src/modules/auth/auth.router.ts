import { canAccess } from '../../middlewares/can-access.middleware';
import MagicRouter from '../../openapi/magic-router';
import {
  handleChangePassword,
  handleForgetPassword,
  handleGetCurrentUser,
  handleVerifyEmailVerification,
  handleLoginByUsername,
  handleLogout,
  handleRegisterUser,
  handleResetPassword,
  handleResendVerificationEmail,
} from './auth.controller';
import {
  changePasswordSchema,
  forgetPasswordSchema,
  loginUserByEmailSchema,
  registerUserByEmailSchema,
  resendEmailVerificationSchema,
  resetPasswordSchema,
  verifyEmailVerificationSchema,
} from './auth.schema';

export const AUTH_ROUTER_ROOT = '/auth';

const authRouter = new MagicRouter(AUTH_ROUTER_ROOT);

authRouter.post(
  '/register/user',
  { requestType: { body: registerUserByEmailSchema } },
  handleRegisterUser,
);

authRouter.post(
  '/login',
  { requestType: { body: loginUserByEmailSchema } },
  handleLoginByUsername,
);

authRouter.post('/logout', {}, handleLogout);
authRouter.post(
  '/verify-email',
  { requestType: { body: verifyEmailVerificationSchema } },
  handleVerifyEmailVerification,
);
authRouter.post(
  '/resend-verify-email',
  { requestType: { body: resendEmailVerificationSchema } },
  handleResendVerificationEmail,
);

authRouter.get('/user', {}, canAccess(), handleGetCurrentUser);

authRouter.post(
  '/forget-password',
  { requestType: { body: forgetPasswordSchema } },
  handleForgetPassword,
);

authRouter.post(
  '/change-password',
  { requestType: { body: changePasswordSchema } },
  canAccess(),
  handleChangePassword,
);

authRouter.post(
  '/reset-password',
  { requestType: { body: resetPasswordSchema } },
  handleResetPassword,
);

// authRouter.get('/google', {}, handleGoogleLogin);
// authRouter.get('/google/callback', {}, handleGoogleCallback);

export default authRouter.getRouter();
