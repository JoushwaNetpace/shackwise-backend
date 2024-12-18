import { FilterQuery } from 'mongoose';
import { getPaginator } from '../../utils/getPaginator';
import ConnectionRequest, {
  IConnectionRequestDocument,
} from './connection_request.model';
import {
  ConnectionRequestSchemaType,
  UpdateConnectionRequestSchemaType,
  GetConnectionRequestsSchemaType,
} from './connection_request.schema';
import { MongoIdSchemaType } from '../../common/common.schema';

// Create a new connection request
export const createConnectionRequest = async (payload: {
  senderId: string;
  receiverId: string;
}): Promise<IConnectionRequestDocument> => {
  try {
    const createdConnectionRequest = await ConnectionRequest.create({
      ...payload,
    });

    return createdConnectionRequest.toObject();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error creating connection request: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }
};

// Delete an existing connection request
export const deleteConnectionRequest = async (
  connectionRequestId: string,
): Promise<void> => {
  try {
    const connectionRequest =
      await ConnectionRequest.findByIdAndDelete(connectionRequestId);
    if (!connectionRequest) {
      throw new Error('Connection Request not found');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error deleting connection request: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }
};

// Get a single connection request by its ID
export const getConnectionRequestById = async (
  connectionRequestId: string,
): Promise<IConnectionRequestDocument> => {
  try {
    const connectionRequest =
      await ConnectionRequest.findById(connectionRequestId);
    if (!connectionRequest) {
      throw new Error('Connection Request not found');
    }
    return connectionRequest.toObject();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching connection request: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }
};
// check for exisitng connection

export const checkExistingConnectionRequest = async (
  userId: string,
  status: string,
): Promise<IConnectionRequestDocument | null> => {
  try {
    const connectionRequest = await ConnectionRequest.findOne({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status,
    });

    if (!connectionRequest) {
      throw new Error(`No connection request found with status: ${status}`);
    }

    return connectionRequest.toObject();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error checking connection request: ${error.message}`);
    }

    throw new Error('An unknown error occurred');
  }
};

// Get all connection requests for a user, with pagination and optional filtering
export const getConnectionRequests = async (
  userId: MongoIdSchemaType,
  payload: GetConnectionRequestsSchemaType,
): Promise<{
  results: IConnectionRequestDocument[];
  paginatorInfo: unknown;
}> => {
  try {
    const conditions: FilterQuery<IConnectionRequestDocument> = {
      $or: [{ senderId: userId.id }, { receiverId: userId.id }],
    };

    if (payload.status) {
      conditions.status = payload.status;
    }

    const totalRecords = await ConnectionRequest.countDocuments(conditions);
    const paginatorInfo = getPaginator(
      payload.limitParam,
      payload.pageParam,
      totalRecords,
    );

    const results = await ConnectionRequest.find(conditions)
      .limit(paginatorInfo.limit)
      .skip(paginatorInfo.skip)
      .exec();

    return { results, paginatorInfo };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching connection requests: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }
};

// Update a specific connection request
export const updateConnectionRequest = async (
  connectionRequestId: string,
  payload: UpdateConnectionRequestSchemaType,
): Promise<IConnectionRequestDocument> => {
  try {
    const connectionRequest = await ConnectionRequest.findByIdAndUpdate(
      connectionRequestId,
      { $set: { ...payload } },
      { new: true },
    );
    if (!connectionRequest) {
      throw new Error('Connection Request not found');
    }
    return connectionRequest.toObject();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error updating connection request: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }
};
