import { FilterQuery } from 'mongoose';
import { getPaginator } from '../../utils/getPaginator';
import Rating, { IRatingDocument } from './rating.model';
import {
  CreateRatingSchemaType,
  UpdateRatingSchemaType,
  GetRatingsSchemaType,
} from './rating.schema';
import { MongoIdSchemaType } from '../../common/common.schema';

export const updateRating = async (
  ratingId: string,
  payload: UpdateRatingSchemaType,
): Promise<IRatingDocument> => {
  const rating = await Rating.findOneAndUpdate(
    { _id: ratingId },
    { $set: { ...payload } },
    { new: true, runValidators: true, strict: false },
  );

  if (!rating) throw new Error('Rating not found');

  return rating.toObject();
};

export const addRater = async (
  ratingId: string,
  userId: string,
): Promise<IRatingDocument> => {
  const rating = await Rating.findOneAndUpdate(
    { _id: ratingId },
    { $addToSet: { ratedBy: userId } },
    { new: true, runValidators: true },
  );

  if (!rating) throw new Error('Rating not found');

  return rating.toObject();
};

export const getRatingById = async (ratingId: string, select?: string) => {
  const rating = await Rating.findOne({ _id: ratingId }).select(select ?? '');

  if (!rating) {
    throw new Error('Rating not found');
  }

  return rating.toObject();
};

export const getRatingByUserId = async (
  userId: MongoIdSchemaType,
  select?: string,
): Promise<CreateRatingSchemaType> => {
  try {
    const rating = await Rating.findOne({ userId }).select(select || '');

    if (!rating) {
      throw new Error('Rating not found'); // You can customize the error to be more specific or add status code handling
    }

    return rating.toObject(); // Convert to plain object if needed
  } catch (error: any) {
    throw new Error(
      `Error fetching rating for userId ${userId}: ${error.message}`,
    );
  }
};

export const deleteRating = async (ratingId: string) => {
  const rating = await Rating.findByIdAndDelete({ _id: ratingId.id });

  if (!rating) {
    throw new Error('Rating not found');
  }
};

export const getRatings = async (
  userId: MongoIdSchemaType,
  payload: GetRatingsSchemaType,
) => {
  const { id } = userId;
  const currentUser = await Rating.findById({ _id: id });
  if (!currentUser) {
    throw new Error('User must be logged in');
  }

  const conditions: FilterQuery<IRatingDocument> = {};

  if (payload.searchString) {
    conditions.$or = [
      { 'affordability.note': { $regex: payload.searchString, $options: 'i' } },
      { 'location.note': { $regex: payload.searchString, $options: 'i' } },
    ];
  }

  const totalRecords = await Rating.countDocuments(conditions);
  const paginatorInfo = getPaginator(
    payload.limitParam,
    payload.pageParam,
    totalRecords,
  );

  const results = await Rating.find(conditions)
    .populate('ratedBy', 'name email') // Populate ratedBy with user details
    .limit(paginatorInfo.limit)
    .skip(paginatorInfo.skip)
    .exec();

  return {
    results,
    paginatorInfo,
  };
};

export const createRating = async (
  payload: CreateRatingSchemaType,
): Promise<IRatingDocument> => {
  const createdRating = await Rating.create({
    ...payload,
  });

  return createdRating.toObject();
};
