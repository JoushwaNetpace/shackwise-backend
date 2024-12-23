import { canAccess } from '../../middlewares/can-access.middleware';
import MagicRouter from '../../openapi/magic-router';
import {
  handleCreateProperty,
  handleGetProperties,
  handleGetFilteredProperties,
  handleUpdateProperty,
  handleDeleteProperty,
  handleGetPropertyById,
} from './property.controller';
import {
  basePropertySchema,
  getPropertiesSchema,
  propertyFilterSchema,
  updatePropertyParamsSchema,
  updatePropertySchema,
} from './property.schema';

export const PROPERTY_ROUTER_ROOT = '/property';

const propertyRouter = new MagicRouter(PROPERTY_ROUTER_ROOT);

// Route to fetch all properties with optional pagination and filters
propertyRouter.get(
  '/',
  {
    requestType: { query: getPropertiesSchema },
  },
  canAccess(),
  handleGetProperties,
);

// Route to fetch a single property by its ID
propertyRouter.get(
  '/:propertyId',
  { requestType: { params: updatePropertyParamsSchema } },
  canAccess(),
  handleGetPropertyById,
);

// Route to create a new property
propertyRouter.post(
  '/',
  { requestType: { body: basePropertySchema } },
  canAccess('roles', ['SUPER_ADMIN', 'HOME_AGENT', 'HOME_BUYER']),
  handleCreateProperty,
);

// Route to update an existing property
propertyRouter.patch(
  '/:propertyId',
  {
    requestType: {
      params: updatePropertyParamsSchema,
      body: updatePropertySchema,
    },
  },
  canAccess('roles', ['SUPER_ADMIN', 'HOME_AGENT']),
  handleUpdateProperty,
);

// Route to delete a property
propertyRouter.delete(
  '/:propertyId',
  { requestType: { params: updatePropertyParamsSchema } },
  canAccess('roles', ['SUPER_ADMIN']),
  handleDeleteProperty,
);

// Add new route for filtered properties
propertyRouter.get(
  '/filter',
  {
    requestType: { query: propertyFilterSchema },
  },
  canAccess(),
  handleGetFilteredProperties,
);

export default propertyRouter.getRouter();
