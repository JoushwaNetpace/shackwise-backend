import z from 'zod';
import { definePaginatedResponse } from '../../common/common.utils';
import {
  ROLE_ENUM,
  RoleType,
  SOCIAL_ACCOUNT_ENUM,
  SocialAccountType,
} from '../../enums';

export const SocialAccountTypeZ = z.enum(
  Object.keys(SOCIAL_ACCOUNT_ENUM) as [SocialAccountType],
);
export const locationType = z.object({
  type: z.string().default('Point'), // Matches the "type" field with default "Point"
  coordinates: z.array(z.number()), // Matches the coordinates as an array of numbers
});
export const RoleTypeZ = z.enum(Object.keys(ROLE_ENUM) as [RoleType]);

export const socialAccountInfoSchema = z.object({
  accountType: SocialAccountTypeZ,
  accessToken: z.string(),
  tokenExpiry: z.date(),
  refreshToken: z.string().optional(),
  accountID: z.string(),
});

export const userOutSchema = z.object({
  email: z.string().email(),
  avatar: z.string().url().optional(),
  name: z.string(),
  username: z.string(),
  isActive: z.boolean().optional(),
  role: RoleTypeZ,
  phoneNo: z.string().optional(),
  fcmToken: z.string().optional(),
  socialAccount: z.array(socialAccountInfoSchema).optional(),
  updatedAt: z.date().optional(),
  createdAt: z.date().optional(),
  address: z.string().optional(),
  location: locationType.optional(),
});

export const connectionSchema = z.object({
  userId: z.string().optional(),
  connectionType: z.string(),
});
export const userSchema = userOutSchema.extend({
  otp: z.string().nullable().optional(),
  password: z.string(),
  passwordResetCode: z.string().optional().nullable(),
  isVerified: z.boolean().optional(),
  connectionList: z.array(connectionSchema).optional(),
});

export const usersPaginatedSchema = definePaginatedResponse(userOutSchema);

export type UserModelType = z.infer<typeof userSchema>;
export type UserType = z.infer<typeof userSchema> & { id: string; _id: string };
export type SocialAccountInfoType = z.infer<typeof socialAccountInfoSchema>;
export type UserPaginatedType = z.infer<typeof usersPaginatedSchema>;
