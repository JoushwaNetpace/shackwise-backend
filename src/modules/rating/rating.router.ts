import { canAccess } from '../../middlewares/can-access.middleware';
import MagicRouter from '../../openapi/magic-router';
import {
  handleCreateRating,
  handleGetRatings,
  handleUpdateRating,
  handleDeleteRating,
  handleGetRatingById,
  handleGetRatingByUserId,
  handleAddRater,
} from './rating.controller';
import {
  ratingsPaginatedSchema,
  updateRatingParamsSchema,
  updateRatingSchema,
  getRatingsSchema,
  baseRatingSchema,
} from './rating.schema';

export const RATING_ROUTER_ROOT = '/rating';

const ratingRouter = new MagicRouter(RATING_ROUTER_ROOT);

ratingRouter.get(
  '/user-rating',
  {},
  canAccess('roles', ['HOME_BUYER', 'HOME_AGENT']),
  handleGetRatingByUserId,
);

ratingRouter.get(
  '/',
  {
    requestType: { query: getRatingsSchema },
    responseModel: ratingsPaginatedSchema,
  },
  canAccess(),
  handleGetRatings,
);

ratingRouter.get(
  '/:ratingId',
  { requestType: { params: updateRatingParamsSchema } },
  canAccess(),
  handleGetRatingById,
);

ratingRouter.post(
  '/',
  { requestType: { body: baseRatingSchema } },
  canAccess('roles', ['SUPER_ADMIN', 'HOME_AGENT', 'HOME_BUYER']),
  handleCreateRating,
);

// New route for adding a rater
ratingRouter.post(
  '/:ratingId/rater',
  { requestType: { params: updateRatingParamsSchema } },
  canAccess('roles', ['HOME_AGENT', 'HOME_BUYER']),
  handleAddRater,
);

ratingRouter.patch(
  '/:ratingId',
  {
    requestType: {
      params: updateRatingParamsSchema,
      body: updateRatingSchema,
    },
  },
  canAccess('roles', ['SUPER_ADMIN', 'HOME_AGENT', 'HOME_BUYER']),
  handleUpdateRating,
);

ratingRouter.delete(
  '/:ratingId',
  { requestType: { params: updateRatingParamsSchema } },
  canAccess('roles', ['SUPER_ADMIN']),
  handleDeleteRating,
);

export default ratingRouter.getRouter();
