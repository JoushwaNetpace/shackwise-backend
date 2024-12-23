import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { errorResponse, successResponse } from '../../utils/api.utils';
import { getLeaderboard, createLeaderboard } from './leaderboard.services';
import { CreateLeaderboardType, GetLeaderboardType } from './leaderboard.dto';

export const handleGetLeaderboard = async (
  req: Request<unknown, unknown, unknown, GetLeaderboardType>,
  res: Response,
) => {
  try {
    const { results, paginatorInfo } = await getLeaderboard(req.query);
    return successResponse(res, 'Leaderboard fetched successfully', {
      results,
      paginatorInfo,
    });
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while fetching leaderboard',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleCreateLeaderboard = async (
  req: Request<unknown, unknown, unknown>,
  res: Response,
) => {
  try {
    const userId = req.user._id;

    const leaderboard = await createLeaderboard(userId);

    return successResponse(
      res,
      'Leaderboard entry created successfully',
      leaderboard,
      StatusCodes.CREATED,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while creating leaderboard entry',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};
