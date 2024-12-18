import { Request, Response } from 'express';
import config from '../../config/config.service';
// import { GoogleCallbackQuery } from '../../types';
import { errorResponse, successResponse } from '../../utils/api.utils';
import { JwtPayload } from '../../utils/auth.utils';
import { AUTH_COOKIE_KEY, COOKIE_CONFIG } from './auth.constants';
import {
  ChangePasswordSchemaType,
  ForgetPasswordSchemaType,
  LoginUserByEmailSchemaType,
  RegisterUserByEmailSchemaType,
  ResetPasswordSchemaType,
} from './auth.schema';
import {
  changePassword,
  forgetPassword,
  verifyRegistrationToken,
  registerUserByEmail,
  resetPassword,
  loginUserByUsername,
  resendVerificationEmail,
} from './auth.service';
import { getUserById, updateUser } from '../user/user.services';

export const handleResetPassword = async (
  req: Request<unknown, unknown, ResetPasswordSchemaType>,
  res: Response,
) => {
  await resetPassword(req.body);

  return successResponse(res, 'Password successfully reset');
};

export const handleForgetPassword = async (
  req: Request<unknown, unknown, ForgetPasswordSchemaType>,
  res: Response,
) => {
  const user = await forgetPassword(req.body);

  return successResponse(res, 'Code has been sent', { userId: user._id });
};

export const handleChangePassword = async (
  req: Request<unknown, unknown, ChangePasswordSchemaType>,
  res: Response,
) => {
  await changePassword((req.user as JwtPayload).sub, req.body);

  return successResponse(res, 'Password successfully changed');
};

export const handleRegisterUser = async (
  req: Request<unknown, unknown, RegisterUserByEmailSchemaType>,
  res: Response,
) => {
  const user = await registerUserByEmail(req.body);

  return successResponse(
    res,
    `User has been registered successfully. A verification email has been sent to ${user.email}`,
    user,
  );
};

export const handleLogout = async (req: Request, res: Response) => {
  // console.log('req.user>', req.user);
  // await updateUser(req.user._id, { fcmToken: '' });

  res.cookie(AUTH_COOKIE_KEY, undefined, COOKIE_CONFIG);

  return successResponse(res, 'Logout successful');
};

export const handleLoginByUsername = async (
  req: Request<unknown, unknown, LoginUserByEmailSchemaType>,
  res: Response,
) => {
  const token = await loginUserByUsername(req.body);
  if (config.SET_SESSION) {
    res.cookie(AUTH_COOKIE_KEY, token, COOKIE_CONFIG);
  }
  return successResponse(res, 'Login successful', { token: token });
};

export const handleGetCurrentUser = async (req: Request, res: Response) => {
  const user = req.user;

  return successResponse(res, undefined, user);
};

// Controller for verifying registration token
export const handleVerifyEmailVerification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { token } = req.body; // Assuming the token is coming from the request body

  try {
    // Call the service to verify the registration token
    const result = await verifyRegistrationToken({ token });

    // Retrieve the user by ID
    const user = await getUserById(result.sub);

    // Check if the user is already verified
    if (user.isVerified) {
      return successResponse(res, 'Your email is already verified.', {
        user,
      });
    }

    // If the user is not verified, update the isVerified flag to true
    const updatedUser = await updateUser(result.sub, { isVerified: true });

    // Return success response if the update is successful
    if (updatedUser) {
      return successResponse(res, 'Email successfully verified!', {
        user: updatedUser,
      });
    }
  } catch (error: any) {
    // Handle any errors thrown by the service
    console.error('Verification error:', error);

    errorResponse(res, error.message, 400, error);
  }
};
// Controller for resending verification email
export const handleResendVerificationEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.body; // Assuming the token is coming from the request body

  try {
    // Call the service to resend verifcation email
    await resendVerificationEmail({ email });

    return successResponse(res, 'Verification email resent successfully.', {});
  } catch (error: any) {
    // Handle any errors thrown by the service
    console.error('Resend verification email error:', error);

    errorResponse(res, error.message, 400, error);
  }
};
