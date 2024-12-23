import { FilterQuery } from 'mongoose';
import { getPaginator } from '../../utils/getPaginator';
import Property, { IPropertyDocument } from './property.model';
import {
  CreatePropertySchemaType,
  UpdatePropertySchemaType,
  GetPropertiesSchemaType,
} from './property.schema';
import { MongoIdSchemaType } from '../../common/common.schema';

export const createProperty = async (
  payload: CreatePropertySchemaType,
): Promise<IPropertyDocument> => {
  const createdProperty = await Property.create({ ...payload });
  return createdProperty.toObject();
};

export const updateProperty = async (
  propertyId: string,
  payload: UpdatePropertySchemaType,
): Promise<IPropertyDocument> => {
  const property = await Property.findOneAndUpdate(
    { _id: propertyId },
    { $set: { ...payload } },
    { new: true },
  );

  if (!property) throw new Error('Property not found');

  return property.toObject();
};

export const getPropertyById = async (id: string, select?: string) => {
  const property = await Property.findOne({ _id: id }).select(select ?? '');

  if (!property) throw new Error('Property not found');

  return property.toObject();
};
export const getPropertyByPropId = async (
  propertyId: string,
  select?: string,
) => {
  const property = await Property.findOne({ propertyId }).select(select ?? '');

  if (!property) {
    return null;
  }

  return property.toObject();
};

export const deleteProperty = async (propertyId: MongoIdSchemaType) => {
  const property = await Property.findByIdAndDelete({ _id: propertyId.id });

  if (!property) throw new Error('Property not found');
};

export const getProperties = async (
  userId: MongoIdSchemaType,
  payload: GetPropertiesSchemaType,
) => {
  const { id } = userId;

  const conditions: FilterQuery<IPropertyDocument> = { userId: id };

  if (payload.search) {
    conditions.$or = [
      { 'address.address': { $regex: payload.search, $options: 'i' } },
      { 'address.city': { $regex: payload.search, $options: 'i' } },
      { 'address.street': { $regex: payload.search, $options: 'i' } },
      { 'neighborhood.name': { $regex: payload.search, $options: 'i' } },
      { mlsStatus: { $regex: payload.search, $options: 'i' } },
      { propertyType: { $regex: payload.search, $options: 'i' } },
    ];
  }

  const totalRecords = await Property.countDocuments(conditions);
  const paginatorInfo = getPaginator(payload.limit, payload.page, totalRecords);

  const results = await Property.find(conditions)
    .limit(paginatorInfo.limit)
    .skip(paginatorInfo.skip)
    .sort({ createdAt: -1 })
    .exec();

  return {
    results,
    paginatorInfo,
  };
};

export const getPropertiesWithFilters = async (
  userId: MongoIdSchemaType,
  filters: {
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    maxBeds?: number;
    minBaths?: number;
    maxBaths?: number;
    propertyType?: string[];
    mlsStatus?: string[];
    motivatedSeller?: boolean;
  },
  pagination: { page: number; limit: number },
) => {
  const conditions: FilterQuery<IPropertyDocument> = { userId: userId.id };

  if (filters.minPrice || filters.maxPrice) {
    conditions.estimatedValue = {};
    if (filters.minPrice) conditions.estimatedValue.$gte = filters.minPrice;
    if (filters.maxPrice) conditions.estimatedValue.$lte = filters.maxPrice;
  }

  if (filters.minBeds || filters.maxBeds) {
    conditions.bedrooms = {};
    if (filters.minBeds) conditions.bedrooms.$gte = filters.minBeds;
    if (filters.maxBeds) conditions.bedrooms.$lte = filters.maxBeds;
  }

  if (filters.minBaths || filters.maxBaths) {
    conditions.bathrooms = {};
    if (filters.minBaths) conditions.bathrooms.$gte = filters.minBaths;
    if (filters.maxBaths) conditions.bathrooms.$lte = filters.maxBaths;
  }

  if (filters.propertyType?.length) {
    conditions.propertyType = { $in: filters.propertyType };
  }

  if (filters.mlsStatus?.length) {
    conditions.mlsStatus = { $in: filters.mlsStatus };
  }

  if (filters.motivatedSeller) {
    conditions.$or = [
      { 'mlsKeywords.motivatedSellerHigh': true },
      { 'mlsKeywords.motivatedSellerMed': true },
      { 'mlsKeywords.motivatedSellerLow': true },
    ];
  }

  const totalRecords = await Property.countDocuments(conditions);
  const paginatorInfo = getPaginator(
    pagination.limit,
    pagination.page,
    totalRecords,
  );

  const results = await Property.find(conditions)
    .limit(paginatorInfo.limit)
    .skip(paginatorInfo.skip)
    .sort({ createdAt: -1 })
    .exec();

  return {
    results,
    paginatorInfo,
  };
};
