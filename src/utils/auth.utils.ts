import argon2 from 'argon2';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import config from '../config/config.service';
import logger from '../lib/logger.service';
import crypto from 'node:crypto';
import { RoleType } from '../enums';
import { UserType } from '../modules/user/user.dto';
import {
  SendForgotPasswordEmailQueue,
  SendVerificationEmailQueue,
} from '../queues/email.queue';

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
}

export interface GoogleTokensRequestParams {
  code: string;
}

export type JwtPayload = {
  sub: string;
  email?: string | null;
  phoneNo?: string | null;
  username: string;
  role: RoleType;
};

export type PasswordResetTokenPayload = {
  email: string;
  userId: string;
};

export type SetPasswordTokenPayload = {
  email: string;
  userId: string;
};

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password);
};

export const compareHash = async (
  hashed: string,
  plainPassword: string,
): Promise<boolean> => {
  return argon2.verify(hashed, plainPassword);
};

// export const signToken = async (payload: JwtPayload): Promise<string> => {
//   return sign(payload, String(config.JWT_SECRET), {
//     expiresIn: config.JWT_EXPIRES_IN,
//   });
// };

export const signToken = async (
  payload: JwtPayload,
): Promise<{ authToken: string; refreshToken: string }> => {
  const authToken = sign(payload, String(config.JWT_SECRET), {
    expiresIn: config.JWT_EXPIRES_IN,
  });

  const refreshToken = sign({ sub: payload.sub }, String(config.JWT_SECRET), {
    expiresIn: config.REFRESH_TOKEN_EXPIRES_IN, // Add this in your config
  });

  return { authToken, refreshToken };
};

export const signPasswordResetToken = async (
  payload: PasswordResetTokenPayload,
) => {
  return sign(payload, String(config.JWT_SECRET), {
    expiresIn: config.PASSWORD_RESET_TOKEN_EXPIRES_IN,
  });
};

export const signSetPasswordToken = async (
  payload: SetPasswordTokenPayload,
) => {
  return sign(payload, String(config.JWT_SECRET), {
    expiresIn: config.SET_PASSWORD_TOKEN_EXPIRES_IN,
  });
};

export const verifyToken = async <
  T extends JwtPayload | PasswordResetTokenPayload | SetPasswordTokenPayload,
>(
  token: string,
): Promise<T> => {
  try {
    return verify(token, String(config.JWT_SECRET)) as T;
  } catch (err: any) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    if (err instanceof JsonWebTokenError) {
      throw new Error(err.message);
    }

    logger.error('verifyToken', { err });
    throw err;
  }
};
export const sendVerificationEmailUtil = async (
  user: UserType,
): Promise<void> => {
  // Create the JWT payload
  const jwtPayload: JwtPayload = {
    sub: String(user._id),
    email: user.email,
    role: String(user.role) as RoleType,
    username: user.username,
  };

  // Sign the token using the JWT payload
  const { authToken } = await signToken(jwtPayload);

  // Construct the verification link
  const verificationLink: string = `${config.CLIENT_SIDE_URL}/verify-email/${authToken}`;

  // Enqueue the job to send the verification email
  await SendVerificationEmailQueue.add('send-verification-email', {
    email: user.email,
    verificationLink,
    name: user.name,
  });
};
export const sendForgotPasswordEmailUtil = async (
  user: UserType,
  code: string,
): Promise<void> => {
  // Enqueue the job to send the verification email
  await SendForgotPasswordEmailQueue.add('send-forgot-password-email', {
    email: user.email,
    code,
    name: user.name,
  });
};

export const generateRandomPassword = (length: number = 16): string => {
  return crypto.randomBytes(length).toString('hex');
};
// export const fetchGoogleTokens = async (
//   params: GoogleTokensRequestParams,
// ): Promise<GoogleTokenResponse> => {
//   const url = 'https://oauth2.googleapis.com/token';
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: new URLSearchParams({
//       code: params.code,
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       redirect_uri: process.env.GOOGLE_REDIRECT_URI,
//       grant_type: 'authorization_code',
//     }),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to exchange code for tokens');
//   }

//   const data: GoogleTokenResponse = await response.json();
//   return data;
// };
export interface GoogleUserInfo {
  id: string; // User's unique Google ID
  email: string; // User's email address
  verified_email: boolean; // Whether the email is verified
  name: string; // User's full name
  given_name: string; // User's given name
  family_name: string; // User's family name
  picture: string; // URL of the user's profile picture
  locale: string; // User's locale
}

export const getUserInfo = async (accessToken: string) => {
  const userInfoResponse = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!userInfoResponse.ok) {
    throw new Error(`Error fetching user info`);
  }
  return userInfoResponse.json();
};
