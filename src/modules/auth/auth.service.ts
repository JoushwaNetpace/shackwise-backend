import config from '../../config/config.service';
import { RoleType } from '../../enums';
import { SendVerificationEmailQueue } from '../../queues/email.queue';
import {
  compareHash,
  hashPassword,
  JwtPayload,
  signToken,
  verifyToken,
} from '../../utils/auth.utils';
import { generateRandomNumbers } from '../../utils/common.utils';
import { UserType } from '../user/user.dto';
import {
  checkUserExistByEmail,
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from '../user/user.services';
import {
  ChangePasswordSchemaType,
  ForgetPasswordSchemaType,
  LoginUserByEmailSchemaType,
  RegisterUserByEmailSchemaType,
  ResetPasswordSchemaType,
} from './auth.schema';

export const resetPassword = async (payload: ResetPasswordSchemaType) => {
  const user = await getUserById(payload.userId);

  if (!user || user.passwordResetCode !== payload.code) {
    throw new Error('token is not valid or expired, please try again');
  }

  if (payload.confirmPassword !== payload.password) {
    throw new Error('Password and confirm password must be same');
  }

  const hashedPassword = await hashPassword(payload.password);

  await updateUser(payload.userId, {
    password: hashedPassword,
    passwordResetCode: null,
  });
};

export const forgetPassword = async (
  payload: ForgetPasswordSchemaType,
): Promise<UserType> => {
  const user = await getUserByEmail(payload.email);

  if (!user) {
    throw new Error("user doesn't exists");
  }

  const code = generateRandomNumbers(4);

  await updateUser(user._id, { passwordResetCode: code });

  return user;
};

export const changePassword = async (
  userId: string,
  payload: ChangePasswordSchemaType,
): Promise<void> => {
  const user = await getUserById(userId, '+password');

  if (!user || !user.password) {
    throw new Error('User is not found');
  }

  const isCurrentPassowordCorrect = await compareHash(
    user.password,
    payload.currentPassword,
  );

  if (!isCurrentPassowordCorrect) {
    throw new Error('current password is not valid');
  }

  const hashedPassword = await hashPassword(payload.newPassword);

  await updateUser(userId, { password: hashedPassword });
};

// Your registerUserByEmail function
export const registerUserByEmail = async (
  payload: RegisterUserByEmailSchemaType,
): Promise<UserType> => {
  const userExistByEmail = await checkUserExistByEmail(payload.email);
  if (userExistByEmail) {
    throw new Error('Account already exist with same email address');
  }

  const { role, ...rest } = payload;

  const user = await createUser({ ...rest, role: role }, false);

  if (user) {
    const jwtPayload: JwtPayload = {
      sub: String(user._id),
      email: user?.email,
      role: String(user.role) as RoleType,
      username: user.username,
    };

    const token = await signToken(jwtPayload);
    const verificationLink: string = `${config.CLIENT_SIDE_URL}/verify-email/${token}`;

    // Use the `add` method to enqueue the job
    await SendVerificationEmailQueue.add('send-verification-email', {
      email: user?.email,
      verificationLink,
      name: user?.name,
    });
  }

  return user;
};
export const verifyRegistrationToken = async (payload: {
  token: string;
}): Promise<JwtPayload> => {
  return verifyToken(payload.token);
};

export const loginUserByEmail = async (
  payload: LoginUserByEmailSchemaType,
): Promise<string> => {
  const user = await getUserByEmail(payload.email, '+password');

  if (!user || !(await compareHash(String(user.password), payload.password))) {
    throw new Error('Invalid email or password');
  }
  3;

  const jwtPayload: JwtPayload = {
    sub: String(user.id),
    email: user?.email,
    phoneNo: user?.phoneNo,
    role: String(user.role) as RoleType,
    username: user.username,
  };

  const token = await signToken(jwtPayload);

  return token;
};
