import { canAccess } from '../../middlewares/can-access.middleware';
import MagicRouter from '../../openapi/magic-router';
import {
  handleGetLeaderboard,
  handleCreateLeaderboard,
} from './leaderboard.controller';
import {
  createLeaderboardSchema,
  getLeaderboardSchema,
  leaderboardPaginatedSchema,
} from './leaderboard.dto';

export const LEADERBOARD_ROUTER_ROOT = '/leaderboard';

const leaderboardRouter = new MagicRouter(LEADERBOARD_ROUTER_ROOT);

leaderboardRouter.get(
  '/',
  {
    requestType: { query: getLeaderboardSchema },
    responseModel: leaderboardPaginatedSchema,
  },
  canAccess(),
  handleGetLeaderboard,
);

leaderboardRouter.post(
  '/',
  {},
  canAccess('roles', ['HOME_BUYER', 'HOME_AGENT']),
  handleCreateLeaderboard,
);

export default leaderboardRouter.getRouter();
