import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoIdSchemaType } from '../../common/common.schema';
import { errorResponse, successResponse } from '../../utils/api.utils';
import {
  createPriority,
  deletePriority,
  getPriorities,
  updatePriority,
  getPriorityById,
  getPriorityByUserId,
} from './priority.services';
import {
  CreatePrioritySchemaType,
  UpdatePrioritySchemaType,
  GetPrioritiesSchemaType,
} from './rating.schema';

export const handleDeletePriority = async (
  req: Request<MongoIdSchemaType, unknown>,
  res: Response,
) => {
  try {
    await deletePriority({ id: req.params.id });

    return successResponse(res, 'Priority has been deleted');
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while deleting the priority',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleUpdatePriority = async (
  req: Request<{ priorityId: string }, unknown, UpdatePrioritySchemaType>,
  res: Response,
) => {
  try {
    const { priorityId } = req.params;
    const data = req.body;

    const updatedPriority = await updatePriority(priorityId, data);

    return successResponse(
      res,
      'Priority has been updated successfully',
      updatedPriority,
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while updating the priority',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleCreatePriority = async (
  req: Request<unknown, unknown, CreatePrioritySchemaType>,
  res: Response,
) => {
  try {
    const data = req.body;

    const priority = await createPriority(data);

    return successResponse(
      res,
      'Priority has been created successfully',
      priority,
      StatusCodes.CREATED,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while creating the priority',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetPriorities = async (
  req: Request<unknown, unknown, unknown, GetPrioritiesSchemaType>,
  res: Response,
) => {
  try {
    const { results, paginatorInfo } = await getPriorities(
      {
        id: req.user.sub,
      },
      req.query,
    );

    return successResponse(res, undefined, { results, paginatorInfo });
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while fetching priorities',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetPriorityById = async (
  req: Request<{ priorityId: string }, unknown>,
  res: Response,
) => {
  try {
    const { priorityId } = req.params;

    const priority = await getPriorityById(priorityId);

    return successResponse(
      res,
      'Priority fetched successfully',
      priority,
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while fetching the priority',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};
export const handleGetPriorityByUserId = async (
  req: Request,
  res: Response,
) => {
  try {
    const { _id: userId } = req.user;
    const priority = await getPriorityByUserId(userId);

    return successResponse(
      res,
      'User Priority fetched successfully',
      priority,
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'An error occurred while fetching user priority',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};
