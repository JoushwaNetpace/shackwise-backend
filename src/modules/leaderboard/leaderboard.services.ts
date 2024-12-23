import { FilterQuery } from 'mongoose';
import { getPaginator } from '../../utils/getPaginator';
import Leaderboard, { ILeaderboardDocument } from './leaderboard.model';
import { GetLeaderboardType } from './leaderboard.dto';

export const getLeaderboard = async (payload: GetLeaderboardType) => {
  const conditions: FilterQuery<ILeaderboardDocument> = {};

  const totalRecords = await Leaderboard.countDocuments(conditions);
  const paginatorInfo = getPaginator(
    payload.limitParam,
    payload.pageParam,
    totalRecords,
  );

  const results = await Leaderboard.find(conditions)
    .populate('userId', 'name email')
    .sort({ score: -1 }) // Sort by score in descending order
    .limit(paginatorInfo.limit)
    .skip(paginatorInfo.skip)
    .exec();

  return {
    results,
    paginatorInfo,
  };
};

export const updateLeaderboard = async (
  userId: string,
  propertyId: string,
  ratingId: string,
): Promise<ILeaderboardDocument> => {
  const leaderboard = await Leaderboard.findOneAndUpdate(
    { userId },
    {
      $push: { properties: { propertyId, ratingId } },
      $inc: { totalRatings: 1, score: 10 }, // Increment score by 10 for each rating
    },
    { new: true, upsert: true },
  );

  return leaderboard;
};

// export const getUserLeaderboardPosition = async (userId: string) => {
//   const userScore = await Leaderboard.findOne({ userId });
//   if (!userScore) {
//     throw new Error('User not found in leaderboard');
//   }

//   const position = await Leaderboard.countDocuments({
//     score: { $gt: userScore.score },
//   });

//   return { position: position + 1, ...userScore.toObject() };
// };

export const createLeaderboard = async (
  userId: string,
): Promise<ILeaderboardDocument> => {
  // Check if leaderboard entry already exists for user
  const existingLeaderboard = await Leaderboard.findOne({ userId });

  if (existingLeaderboard) {
    throw new Error('Property rating already exists in leaderboard');
  }

  // Create new leaderboard entry
  const newLeaderboard = await Leaderboard.create({
    userId,
  });

  return newLeaderboard;
};
