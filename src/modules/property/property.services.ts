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

export const getPropertyById = async (propertyId: string, select?: string) => {
  const property = await Property.findOne({ _id: propertyId }).select(
    select ?? '',
  );

  if (!property) throw new Error('Property not found');

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
      { 'details.title': { $regex: payload.search, $options: 'i' } },
      { 'details.location': { $regex: payload.search, $options: 'i' } },
    ];
  }

  const totalRecords = await Property.countDocuments(conditions);
  const paginatorInfo = getPaginator(payload.limit, payload.page, totalRecords);

  const results = await Property.find(conditions)
    .limit(paginatorInfo.limit)
    .skip(paginatorInfo.skip)
    .exec();

  return {
    results,
    paginatorInfo,
  };
};
