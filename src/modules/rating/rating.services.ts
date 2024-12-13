import { FilterQuery } from 'mongoose';
import { getPaginator } from '../../utils/getPaginator';
import Priority, { IPriorityDocument } from './priority.model';
import {
  CreatePrioritySchemaType,
  UpdatePrioritySchemaType,
  GetPrioritiesSchemaType,
} from './rating.schema';
import { MongoIdSchemaType } from '../../common/common.schema';
// import { PriorityType } from './priority.dto';

export const updatePriority = async (
  priorityId: string,
  payload: UpdatePrioritySchemaType,
): Promise<IPriorityDocument> => {
  const priority = await Priority.findOneAndUpdate(
    { _id: priorityId },
    { $set: { ...payload } },
    { new: true },
  );

  if (!priority) throw new Error('Priority not found');

  return priority.toObject();
};

export const getPriorityById = async (priorityId: string, select?: string) => {
  const priority = await Priority.findOne({ _id: priorityId }).select(
    select ?? '',
  );

  if (!priority) {
    throw new Error('Priority not found');
  }

  return priority.toObject();
};
export const getPriorityByUserId = async (
  userId: MongoIdSchemaType,
  select?: string,
): Promise<CreatePrioritySchemaType> => {
  try {
    const priority = await Priority.findOne({ userId }).select(select || '');

    if (!priority) {
      throw new Error('Priority not found'); // You can customize the error to be more specific or add status code handling
    }

    return priority.toObject(); // Convert to plain object if needed
  } catch (error: any) {
    throw new Error(
      `Error fetching priority for userId ${userId}: ${error.message}`,
    );
  }
};

export const deletePriority = async (priorityId: MongoIdSchemaType) => {
  const priority = await Priority.findByIdAndDelete({ _id: priorityId.id });

  if (!priority) {
    throw new Error('Priority not found');
  }
};

export const getPriorities = async (
  userId: MongoIdSchemaType,
  payload: GetPrioritiesSchemaType,
) => {
  const { id } = userId;
  const currentUser = await Priority.findById({ _id: id });
  if (!currentUser) {
    throw new Error('User must be logged in');
  }

  const conditions: FilterQuery<IPriorityDocument> = {};

  if (payload.searchString) {
    conditions.$or = [
      { 'affordability.note': { $regex: payload.searchString, $options: 'i' } },
      { 'location.note': { $regex: payload.searchString, $options: 'i' } },
      // Add other fields as necessary
    ];
  }

  const totalRecords = await Priority.countDocuments(conditions);
  const paginatorInfo = getPaginator(
    payload.limitParam,
    payload.pageParam,
    totalRecords,
  );

  const results = await Priority.find(conditions)
    .limit(paginatorInfo.limit)
    .skip(paginatorInfo.skip)
    .exec();

  return {
    results,
    paginatorInfo,
  };
};

export const createPriority = async (
  payload: CreatePrioritySchemaType,
): Promise<IPriorityDocument> => {
  console.log('>>', payload);
  const createdPriority = await Priority.create({
    ...payload,
  });

  return createdPriority.toObject();
};
