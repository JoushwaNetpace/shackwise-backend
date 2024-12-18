import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { errorResponse, successResponse } from '../../utils/api.utils';
import {
  // createConnectionRequest,
  deleteConnectionRequest,
  getConnectionRequests,
  updateConnectionRequest,
  getConnectionRequestById,
  createConnectionRequest,
} from './connection_request.services';
import {
  // ConnectionRequestSchemaType,
  CreateConnectionRequestSchemaType,
  GetConnectionRequestsSchemaType,
  UpdateConnectionRequestSchemaType,
} from './connection_request.schema';
import {
  findUserByEmailAndUsername,
  getUserConnectionList,
} from '../user/user.services';
import { SendNotificationQueue } from '../../queues/notification.queue';
// import { SendNotificationQueue } from '../../queues/notification.queue';

export const handleCreateConnectionRequest = async (
  req: Request<unknown, unknown, CreateConnectionRequestSchemaType>,
  res: Response,
) => {
  try {
    const { username, email, role } = req.body;
    const { connectionList } = await getUserConnectionList(req.user);

    if (connectionList.length == 0) {
      const receiverUser = await findUserByEmailAndUsername(
        email,
        username,
        '',
      );

      if (!receiverUser) {
        return errorResponse(
          res,
          'No User Found with given username and password!',
          StatusCodes.NOT_FOUND,
          {},
        );
      }

      const connectionRequest = await createConnectionRequest({
        senderId: req.user._id,
        receiverId: receiverUser._id,
      });
      // // Enqueue the job to send the connection request  notification
      await SendNotificationQueue.add('send-user-notification', {
        userId: receiverUser._id,
        title: `Incoming Connection Request`,
        body: `You have received a connect invite from ${req.user.name}`,
        connectId: connectionRequest._id,
        notificationType: 'CONNECTION_REQUEST',
        token: receiverUser.fcmToken,
      });
      return successResponse(
        res,
        'Connection request has been sent successfully',
        connectionRequest,
        StatusCodes.CREATED,
      );
    }
    return errorResponse(
      res,
      'Already connected with another user!',
      StatusCodes.CONFLICT,
      {},
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse(
        res,
        error.message ||
          'An error occurred while creating the connection request',
        StatusCodes.BAD_REQUEST,
        error,
      );
    }
    return errorResponse(
      res,
      'An unknown error occurred',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetConnectionRequests = async (
  req: Request<unknown, unknown, unknown, GetConnectionRequestsSchemaType>,
  res: Response,
) => {
  try {
    const { results, paginatorInfo } = await getConnectionRequests(
      req.user._id,
      req.query,
    );

    return successResponse(res, undefined, { results, paginatorInfo });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse(
        res,
        error.message || 'An error occurred while fetching connection requests',
        StatusCodes.BAD_REQUEST,
        error,
      );
    }
    return errorResponse(
      res,
      'An unknown error occurred',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleGetConnectionRequestById = async (
  req: Request<{ connectionRequestId: string }, unknown>,
  res: Response,
) => {
  try {
    const { connectionRequestId } = req.params;
    const connectionRequest =
      await getConnectionRequestById(connectionRequestId);

    return successResponse(
      res,
      'Connection request fetched successfully',
      connectionRequest,
      StatusCodes.OK,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse(
        res,
        error.message ||
          'An error occurred while fetching the connection request',
        StatusCodes.BAD_REQUEST,
        error,
      );
    }
    return errorResponse(
      res,
      'An unknown error occurred',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleUpdateConnectionRequest = async (
  req: Request<
    { connectionRequestId: string },
    unknown,
    UpdateConnectionRequestSchemaType
  >,
  res: Response,
) => {
  try {
    const { connectionRequestId } = req.params;
    const data = req.body;

    const updatedConnectionRequest = await updateConnectionRequest(
      connectionRequestId,
      data,
    );

    return successResponse(
      res,
      'Connection request updated successfully',
      updatedConnectionRequest,
      StatusCodes.OK,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse(
        res,
        error.message ||
          'An error occurred while updating the connection request',
        StatusCodes.BAD_REQUEST,
        error,
      );
    }
    return errorResponse(
      res,
      'An unknown error occurred',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};

export const handleDeleteConnectionRequest = async (
  req: Request<{ connectionRequestId: string }, unknown>,
  res: Response,
) => {
  try {
    await deleteConnectionRequest(req.params.connectionRequestId);

    return successResponse(res, 'Connection request deleted successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse(
        res,
        error.message ||
          'An error occurred while deleting the connection request',
        StatusCodes.BAD_REQUEST,
        error,
      );
    }
    return errorResponse(
      res,
      'An unknown error occurred',
      StatusCodes.BAD_REQUEST,
      error,
    );
  }
};
