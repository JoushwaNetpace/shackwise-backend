import { z } from 'zod';
import { RoleTypeZ } from '../user/user.dto';

export const baseConnectionRequestSchema = z.object({
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  status: z.enum(['ACCEPTED', 'REJECTED', 'PENDING']),
  isRead: z.boolean().default(false).optional(),
});
export const createConnectionRequestSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  role: RoleTypeZ,
});
export const updateConnectionRequestSchema =
  baseConnectionRequestSchema.partial();

export const updateConnectionRequestParamsSchema = z.object({
  connectionRequestId: z.string().uuid(),
});

export const connectionRequestsPaginatedSchema = z.object({
  results: z.array(baseConnectionRequestSchema),
  paginatorInfo: z.object({
    total: z.number(),
    currentPage: z.number(),
    perPage: z.number(),
  }),
});

// Schema for pagination and filtering
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
export type ConnectionRequestSchemaType = z.infer<
  typeof baseConnectionRequestSchema
>;
export type CreateConnectionRequestSchemaType = z.infer<
  typeof createConnectionRequestSchema
>;
export type UpdateConnectionRequestSchemaType = z.infer<
  typeof updateConnectionRequestSchema
>;
export type GetConnectionRequestsSchemaType = z.infer<
  typeof getConnectionRequestsSchema
>;
