import { canAccess } from '../../middlewares/can-access.middleware';
import MagicRouter from '../../openapi/magic-router';
import {
  handleCreateConnectionRequest,
  handleGetConnectionRequests,
  handleUpdateConnectionRequest,
  handleDeleteConnectionRequest,
  handleGetConnectionRequestById,
} from './connection_request.controller';
import {
  // baseConnectionRequestSchema,
  connectionRequestsPaginatedSchema,
  updateConnectionRequestParamsSchema,
  updateConnectionRequestSchema,
  getConnectionRequestsSchema,
  createConnectionRequestSchema,
} from './connection_request.schema';

export const CONNECTION_REQUEST_ROUTER_ROOT = '/connection-request';

const connectionRequestRouter = new MagicRouter(CONNECTION_REQUEST_ROUTER_ROOT);

// Route to fetch all connection requests with optional pagination
connectionRequestRouter.get(
  '/',
  {
    requestType: { query: getConnectionRequestsSchema },
    responseModel: connectionRequestsPaginatedSchema,
  },
  canAccess('roles', ['HOME_BUYER', 'SUPER_ADMIN']),
  handleGetConnectionRequests,
);

// Route to fetch a single connection request by its ID
connectionRequestRouter.get(
  '/:connectionRequestId',
  { requestType: { params: updateConnectionRequestParamsSchema } },
  canAccess(),
  handleGetConnectionRequestById,
);

// Route to create a new connection request
connectionRequestRouter.post(
  '/',
  { requestType: { body: createConnectionRequestSchema } },
  canAccess('roles', ['HOME_BUYER', 'HOME_AGENT']),
  handleCreateConnectionRequest,
);

// Route to update an existing connection request
connectionRequestRouter.patch(
  '/:connectionRequestId',
  {
    requestType: {
      params: updateConnectionRequestParamsSchema,
      body: updateConnectionRequestSchema,
    },
  },
  canAccess('roles', ['HOME_BUYER', 'HOME_AGENT']),
  handleUpdateConnectionRequest,
);

// Route to delete a connection request
connectionRequestRouter.delete(
  '/:connectionRequestId',
  { requestType: { params: updateConnectionRequestParamsSchema } },
  canAccess('roles', ['HOME_BUYER', 'HOME_AGENT']),
  handleDeleteConnectionRequest,
);

export default connectionRequestRouter.getRouter();
