import { Request, Response } from 'express';
import { AnyZodObject, ZodEffects, ZodSchema } from 'zod';
import { JwtPayload } from './utils/auth.utils';
import { Server } from 'socket.io';

export type ZodObjectWithEffect =
  | AnyZodObject
  | ZodEffects<ZodObjectWithEffect, unknown, unknown>;

export interface GoogleCallbackQuery {
  code: string;
  error?: string;
}

export type RequestZodSchemaType = {
  params?: ZodObjectWithEffect;
  query?: ZodObjectWithEffect;
  body?: ZodSchema;
};

export interface RequestExtended extends Request {
  user: JwtPayload;
  io: Server;
}

export interface ResponseExtended extends Response {
  locals: {
    validateSchema?: ZodSchema;
  };
  jsonValidate: Response['json'];
  sendValidate: Response['send'];
}

export interface typeErrorResponse {
  success: boolean;
  message: string;
  data: object;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  token: string; // FCM registration token
  connectId?: string; // FCM registration token
  notificationType: string; // FCM registration token
  isRead?: boolean; // FCM registration token
}
