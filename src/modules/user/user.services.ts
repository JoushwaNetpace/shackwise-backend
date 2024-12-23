import { FilterQuery } from 'mongoose';
import { hashPassword } from '../../utils/auth.utils';
import { getPaginator } from '../../utils/getPaginator';
import { UserModelType, UserType } from './user.dto';
import User, { IUserDocument } from './user.model';
import { GetUsersSchemaType } from './user.schema';
import { MongoIdSchemaType } from '../../common/common.schema';

export const updateUser = async (
  userId: string,
  updateOperation: Record<string, any>,
): Promise<UserType> => {
  try {
    const user = await User.findByIdAndUpdate(userId, updateOperation, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.toObject();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
    throw new Error('An unknown error occurred while updating the user');
  }
};
export const getUserById = async (userId: string, select?: string) => {
  const user = await User.findOne({
    _id: userId,
  }).select(select ?? '');

  if (!user) {
    throw new Error('User not found');
  }

  return user.toObject();
};

export const getUserByEmail = async (
  email: string,
  select?: string,
): Promise<UserType> => {
  const user = await User.findOne({ email }).select(select ?? '');

  if (!user) {
    throw new Error('User not found');
  }
  return user.toObject();
};
export const getUserByUsername = async (
  username: string,
  select?: string,
): Promise<UserType> => {
  const user = await User.findOne({ username }).select(select ?? '');

  if (!user) {
    throw new Error('User not found');
  }
  return user.toObject();
};
export const checkUserExistByEmail = async (
  email: string,
  select?: string,
): Promise<UserType | null> => {
  const user = await User.findOne({ email }).select(select ?? '');

  if (!user) {
    return null;
  }
  return user.toObject();
};
export const findUserByEmailAndUsername = async (
  email: string,
  username: string,
  select?: string,
): Promise<UserType | null> => {
  const user = await User.findOne({
    email,
    username,
  }).select(select ?? '');

  if (!user) {
    throw new Error('No User Found with given username and email');
  }

  return user.toObject();
};
export const deleteUser = async (userId: MongoIdSchemaType) => {
  const user = await User.findByIdAndDelete({ _id: userId.id });

  if (!user) {
    throw new Error('User not found');
  }
};

export const getUsers = async (
  userId: MongoIdSchemaType,
  payload: GetUsersSchemaType,
) => {
  const { id } = userId;
  const currentUser = await User.findById({ _id: id });
  if (!currentUser) {
    throw new Error('User must be logged in');
  }

  const conditions: FilterQuery<IUserDocument> = {};

  if (payload.searchString) {
    conditions.$or = [
      { firstName: { $regex: payload.searchString, $options: 'i' } },
      { lastName: { $regex: payload.searchString, $options: 'i' } },
      { email: { $regex: payload.searchString, $options: 'i' } },
    ];
  }

  if (payload.filterByRole) {
    conditions.role = payload.filterByRole;
  } else {
    conditions.role = { $in: ['HOME_BUYER'] };
  }

  const totalRecords = await User.countDocuments(conditions);
  const paginatorInfo = getPaginator(
    payload.limitParam,
    payload.pageParam,
    totalRecords,
  );

  const results = await User.find(conditions)
    .limit(paginatorInfo.limit)
    .skip(paginatorInfo.skip)
    .exec();

  return {
    results,
    paginatorInfo,
  };
};
export const getUserConnectionList = async (userId: MongoIdSchemaType) => {
  const { _id } = userId;

  // Find the current user and populate the connection list with full user info
  const currentUser = await User.findOne({ _id })
    .select('_id fullName username connectionList')
    .populate({
      path: 'connectionList.userId', // Assumes 'userId' references another User document
      select: 'name username email', // Select the fields you need
    });

  if (!currentUser) {
    throw new Error('User not found!');
  }

  const { connectionList } = currentUser;

  return {
    connectionList,
  };
};

export const createUser = async (
  payload: UserModelType & { password: string },
  checkExist: boolean = true,
): Promise<UserType> => {
  if (checkExist) {
    const isUserExist = await User.findOne({ email: payload.email });

    if (!isUserExist) {
      throw new Error('User already exists');
    }
  }

  if (!payload.password) {
    throw new Error('Password is required');
  }

  const hashedPassword = await hashPassword(payload.password);

  const createdUser = await User.create({
    ...payload,
    password: hashedPassword,
  });

  return { ...createdUser.toObject(), password: '', otp: null };
};
