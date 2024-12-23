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
  token?: string; // FCM registration token
  connectId?: string; // FCM registration token
  notificationType: string; // FCM registration token
  isRead?: boolean; // FCM registration token
}

export interface Address {
  address: string;
  city: string;
  county: string;
  state: string;
  street: string;
  zip: string;
}

export interface Neighborhood {
  center: string;
  id: string;
  name: string;
  type: string;
}

export interface MlsKeywords {
  creativeFinancing: boolean;
  investorOwned: boolean;
  motivatedSellerHigh: boolean;
  motivatedSellerLow: boolean;
  motivatedSellerMed: boolean;
}

export interface MlsHistoryItem {
  agentEmail: string;
  agentName: string;
  agentOffice: string;
  agentPhone: string;
  baths: number;
  beds: number;
  daysOnMarket: string;
  lastStatusDate: string;
  price: number;
  status: string;
  statusDate: string;
  type: string;
}

export interface SchoolLevels {
  elementary: boolean | null;
  high: boolean | null;
  middle: boolean | null;
  preschool: boolean | null;
}

export interface School {
  city: string;
  enrollment: number;
  grades: string;
  levels: SchoolLevels;
  location: string;
  name: string;
  parentRating: number;
  rating: number;
  state: string;
  street: string;
  type: string;
  zip: string;
}

export interface TaxInfo {
  assessedImprovementValue: number;
  assessedLandValue: number;
  assessedValue: number;
  assessmentYear: number;
  marketValue: number;
  taxAmount: string;
  taxDelinquentYear: string | null;
}

export interface PropertyListing {
  absenteeOwner: boolean;
  address: Address;
  bathrooms: number;
  bedrooms: number;
  squareFeet: number;
  propertyId: string;
  latitude: number;
  longitude: number;
  lotSquareFeet: number;
  parkingSpaces: number;
  assessedValue: number;
  estimatedValue: number;
  floodZoneDescription: string | null;
  mlsStatus: string;
  propertyType: string;
  yearBuilt: number;
  neighborhood: Neighborhood;
  mlsKeywords: MlsKeywords;
  mlsHistory: MlsHistoryItem[];
  schools: School[];
  taxInfo: TaxInfo;
}
