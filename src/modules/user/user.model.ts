import mongoose, { Document, Schema } from 'mongoose';
import { ROLE_ENUM, SOCIAL_ACCOUNT_ENUM } from '../../enums'; // Import rolesEnums
import { SocialAccountInfoType, UserModelType, UserType } from './user.dto';
import { LocationType } from '@aws-sdk/client-s3';

const locationSchema = new Schema<LocationType>({
  type: {
    type: String,
    default: 'Point',
  },
  coordinates: {
    type: [Number],
    index: '2dsphere',
  },
});

const SocialAccountSchema = new Schema<SocialAccountInfoType>({
  accountType: {
    type: String,
    required: true,
    enum: Object.keys(SOCIAL_ACCOUNT_ENUM),
  },
  accessToken: { type: String, required: true },
  tokenExpiry: { type: Date },
  refreshToken: { type: String },
  accountID: { type: String, required: true },
});

const UserSchema: Schema<UserType> = new Schema(
  {
    email: { type: String, unique: true, required: true },
    avatar: { type: String },
    username: { type: String, required: true, unique: true },
    name: { type: String },
    role: {
      type: String,
      required: true,
      enum: Object.keys(ROLE_ENUM),
      default: ROLE_ENUM.HOME_BUYER,
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    phoneNo: { type: String },
    location: { type: locationSchema },
    address: { type: String },

    password: { type: String, required: true, select: false },
    passwordResetCode: { type: String },
    socialAccount: [{ type: SocialAccountSchema, required: false }],
  },
  { timestamps: true },
);

export interface ISocialAccountDocument
  extends SocialAccountInfoType,
    Document {}
export interface IUserDocument extends Document<string>, UserModelType {}
const User = mongoose.model<UserType>('User', UserSchema);
export default User;
