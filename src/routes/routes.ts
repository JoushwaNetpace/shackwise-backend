import express from 'express';
import authRouter, { AUTH_ROUTER_ROOT } from '../modules/auth/auth.router';

import healthCheckRouter, {
  HEALTH_ROUTER_ROOT,
} from '../healthcheck/healthcheck.routes';
import uploadRouter, { UPLOAD_ROUTER_ROOT } from '../upload/upload.router';
import userRouter, { USER_ROUTER_ROOT } from '../modules/user/user.router';
import priorityRouter, {
  PRIORITY_ROUTER_ROOT,
} from '../modules/priority/priority.router';
import propertyRouter, {
  PROPERTY_ROUTER_ROOT,
} from '../modules/property/property.router';

const router = express.Router();

router.use(HEALTH_ROUTER_ROOT, healthCheckRouter);
router.use(USER_ROUTER_ROOT, userRouter);
router.use(AUTH_ROUTER_ROOT, authRouter);
router.use(PRIORITY_ROUTER_ROOT, priorityRouter);
router.use(PROPERTY_ROUTER_ROOT, propertyRouter);
router.use(UPLOAD_ROUTER_ROOT, uploadRouter);

export default router;
