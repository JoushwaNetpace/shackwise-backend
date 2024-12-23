import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoIdSchemaType } from '../../common/common.schema';
import { errorResponse, successResponse } from '../../utils/api.utils';
import {
  createRating,
  deleteRating,
  getRatings,
  updateRating,
  getRatingById,
  getRatingByUserId,
  addRater,
} from './rating.services';
import {
  CreateRatingSchemaType,
  UpdateRatingSchemaType,
  GetRatingsSchemaType,
} from './rating.schema';

export const handleDeleteRating = async (
  req: Request<{ ratingId: string }, unknown>,
  res: Response,
) => {
  try {
    await deleteRating(req.params.ratingId);
    return successResponse(res, 'Rating has been deleted');
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while deleting the rating',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleUpdateRating = async (
  req: Request<{ ratingId: string }, unknown, UpdateRatingSchemaType>,
  res: Response,
) => {
  try {
    const { ratingId } = req.params;
    const data = req.body;

    const updatedRating = await updateRating(ratingId, data);

    return successResponse(
      res,
      'Rating has been updated successfully',
      updatedRating,
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while updating the rating',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleCreateRating = async (
  req: Request<unknown, unknown, CreateRatingSchemaType>,
  res: Response,
) => {
  try {
    const data = req.body;
    // Add the current user to ratedBy array
    data.ratedBy = [req.user._id];

    const rating = await createRating(data);

    return successResponse(
      res,
      'Rating has been created successfully',
      rating,
      StatusCodes.CREATED,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while creating the rating',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleAddRater = async (
  req: Request<{ ratingId: string }, unknown>,
  res: Response,
) => {
  try {
    const { ratingId } = req.params;
    const userId = req.user._id;

    const updatedRating = await addRater(ratingId, userId);

    return successResponse(
      res,
      'Rater added successfully',
      updatedRating,
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while adding rater',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetRatings = async (
  req: Request<unknown, unknown, unknown, GetRatingsSchemaType>,
  res: Response,
) => {
  try {
    const { results, paginatorInfo } = await getRatings(
      {
        id: req.user.sub,
      },
      req.query,
    );

    return successResponse(res, undefined, { results, paginatorInfo });
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while fetching ratings',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetRatingById = async (
  req: Request<{ ratingId: string }, unknown>,
  res: Response,
) => {
  try {
    const { ratingId } = req.params;

    const rating = await getRatingById(ratingId);

    return successResponse(
      res,
      'Rating fetched successfully',
      rating,
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while fetching the rating',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetRatingByUserId = async (req: Request, res: Response) => {
  try {
    const { _id: userId } = req.user;
    const rating = await getRatingByUserId(userId);

    return successResponse(
      res,
      'User Rating fetched successfully',
      rating,
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while fetching user rating',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};
