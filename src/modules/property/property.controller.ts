import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { errorResponse, successResponse } from '../../utils/api.utils';
import {
  createProperty,
  deleteProperty,
  getProperties,
  getPropertiesWithFilters,
  updateProperty,
  getPropertyById,
  getPropertyByPropId,
} from './property.services';
import {
  CreatePropertySchemaType,
  UpdatePropertySchemaType,
  GetPropertiesSchemaType,
  PropertyFilterSchemaType,
} from './property.schema';
import { MongoIdSchemaType } from '../../common/common.schema';

export const handleCreateProperty = async (
  req: Request<unknown, unknown, CreatePropertySchemaType>,
  res: Response,
) => {
  try {
    const data = req.body;

    // if property already exists then update the proxperty data else create a new property
    const propertyI = await getPropertyByPropId(data.propertyId);
    if (propertyI) {
      const updatedProperty = await updateProperty(propertyI._id, data);
      return successResponse(
        res,
        'Property updated successfully',
        updatedProperty,
        StatusCodes.OK,
      );
    }

    const property = await createProperty(data);

    return successResponse(
      res,
      'Property created successfully',
      property,
      StatusCodes.CREATED,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'Error creating property',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleUpdateProperty = async (
  req: Request<{ propertyId: string }, unknown, UpdatePropertySchemaType>,
  res: Response,
) => {
  try {
    const { propertyId } = req.params;
    const data = req.body;

    const updatedProperty = await updateProperty(propertyId, data);

    return successResponse(
      res,
      'Property updated successfully',
      updatedProperty,
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'Error updating property',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetPropertyById = async (
  req: Request<{ propertyId: string }, unknown>,
  res: Response,
) => {
  try {
    const { propertyId } = req.params;
    const property = await getPropertyById(propertyId);

    return successResponse(
      res,
      'Property fetched successfully',
      property,
      StatusCodes.OK,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'Error fetching property',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleDeleteProperty = async (
  req: Request<MongoIdSchemaType, unknown>,
  res: Response,
) => {
  try {
    await deleteProperty({ id: req.params.id });
    return successResponse(res, 'Property deleted successfully');
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'Error deleting property',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetProperties = async (
  req: Request<unknown, unknown, unknown, GetPropertiesSchemaType>,
  res: Response,
) => {
  try {
    const { results, paginatorInfo } = await getProperties(
      { id: req.user.sub },
      req.query,
    );
    return successResponse(res, 'Properties fetched successfully', {
      results,
      paginatorInfo,
    });
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'Error fetching properties',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetFilteredProperties = async (
  req: Request<unknown, unknown, unknown, PropertyFilterSchemaType>,
  res: Response,
) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;

    const { results, paginatorInfo } = await getPropertiesWithFilters(
      { id: req.user.sub },
      filters,
      { page, limit },
    );

    return successResponse(res, 'Filtered properties fetched successfully', {
      results,
      paginatorInfo,
    });
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || 'Error fetching filtered properties',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};
