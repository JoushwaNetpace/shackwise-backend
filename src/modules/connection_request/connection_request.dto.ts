import { z } from 'zod';
import { definePaginatedResponse } from '../../common/common.utils';

// Base Connection Request Schema
export const baseConnectionRequestSchema = z.object({
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  status: z.enum(['ACCEPTED', 'REJECTED', 'PENDING']),
  requestType: z.enum(['PARTNER', 'AGENT']),
  isRead: z.boolean().default(false),
});

// Schema for updating a Connection Request
export const updateConnectionRequestSchema =
  baseConnectionRequestSchema.partial();

// Schema for updating connection request parameters
export const updateConnectionRequestParamsSchema = z.object({
  connectionRequestId: z.string().uuid(),
});
export const createConnectionRequestSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  requestType: z.enum(['PARTNER', 'AGENT']),
});

// Paginated schema for connection requests
export const connectionRequestsPaginatedSchema = definePaginatedResponse(
  baseConnectionRequestSchema,
);

// Schema for fetching connection requests with filters and pagination
export const getConnectionRequestsSchema = z.object({
  searchString: z.string().optional(),
  status: z.string().optional(),
  limitParam: z
    .string()
    .default('10')
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) >= 0,
      'Input must be a positive integer',
    )
    .transform(Number),
  pageParam: z
    .string()
    .default('1')
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) >= 0,
      'Input must be a positive integer',
    )
    .transform(Number),
});

// Type Definitions
export type BaseConnectionRequestType = z.infer<
  typeof baseConnectionRequestSchema
>;
// Type Definitions
export type CreateConnectionRequestType = z.infer<
  typeof createConnectionRequestSchema
>;
export type UpdateConnectionRequestType = z.infer<
  typeof updateConnectionRequestSchema
>;
export type UpdateConnectionRequestParamsType = z.infer<
  typeof updateConnectionRequestParamsSchema
>;
export type ConnectionRequestsPaginatedType = z.infer<
  typeof connectionRequestsPaginatedSchema
>;
export type GetConnectionRequestsType = z.infer<
  typeof getConnectionRequestsSchema
>;
