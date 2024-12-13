import { canAccess } from '../../middlewares/can-access.middleware';
import MagicRouter from '../../openapi/magic-router';
import {
  handleCreatePriority,
  handleGetPriorities,
  handleUpdatePriority,
  handleDeletePriority,
  handleGetPriorityById,
  handleGetPriorityByUserId,
} from './rating.controller';
import {
  // createPrioritySchema,
  prioritiesPaginatedSchema,
  updatePriorityParamsSchema,
  updatePrioritySchema,
  getPrioritiesSchema,
  basePrioritySchema,
} from './rating.schema';

export const PRIORITY_ROUTER_ROOT = '/priority';

const priorityRouter = new MagicRouter(PRIORITY_ROUTER_ROOT);
// Route to fetch a user priority by its userId
priorityRouter.get(
  '/user-priority',
  {},
  canAccess('roles', ['HOME_BUYER', 'HOME_AGENT']),
  handleGetPriorityByUserId,
);
// Route to fetch all priorities with optional pagination and filters
priorityRouter.get(
  '/',
  {
    requestType: { query: getPrioritiesSchema },
    responseModel: prioritiesPaginatedSchema,
  },
  canAccess(),
  handleGetPriorities,
);

// Route to fetch a single priority by its ID
priorityRouter.get(
  '/:priorityId',
  { requestType: { params: updatePriorityParamsSchema } },
  canAccess(),
  handleGetPriorityById,
);
// Route to fetch a single priority by its ID
priorityRouter.get(
  '/:priorityId',
  { requestType: { params: updatePriorityParamsSchema } },
  canAccess(),
  handleGetPriorityById,
);

// Route to create a new priority
priorityRouter.post(
  '/',
  { requestType: { body: basePrioritySchema } },
  canAccess('roles', ['SUPER_ADMIN', 'HOME_AGENT', 'HOME_BUYER']),
  handleCreatePriority,
);

// Route to update an existing priority
priorityRouter.patch(
  '/:priorityId',
  {
    requestType: {
      params: updatePriorityParamsSchema,
      body: updatePrioritySchema,
    },
  },
  canAccess('roles', ['SUPER_ADMIN', 'HOME_AGENT', 'HOME_BUYER']),
  handleUpdatePriority,
);

// Route to delete a priority
priorityRouter.delete(
  '/:priorityId',
  { requestType: { params: updatePriorityParamsSchema } },
  canAccess('roles', ['SUPER_ADMIN']),
  handleDeletePriority,
);

export default priorityRouter.getRouter();
