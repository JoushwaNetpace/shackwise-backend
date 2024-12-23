import { z } from 'zod';
import { definePaginatedResponse } from '../../common/common.utils';

// Schema for property rating entry
const propertyRatingSchema = z.object({
  propertyId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid property ID format'),
  ratingId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid rating ID format'),
});

// Base Leaderboard Schema
export const baseLeaderboardSchema = z.object({
  userId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid user ID format'),
  properties: z.array(propertyRatingSchema),
});

// Schema for creating a leaderboard entry
export const createLeaderboardSchema = z.object({
  userId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid user ID format'),
});

// Schema for pagination and filtering
export const getLeaderboardSchema = z.object({
  searchString: z.string().optional(),
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

// Paginated schema for leaderboard
export const leaderboardPaginatedSchema = definePaginatedResponse(
  baseLeaderboardSchema,
);

// Export types
export type BaseLeaderboardType = z.infer<typeof baseLeaderboardSchema>;
export type CreateLeaderboardType = z.infer<typeof createLeaderboardSchema>;
export type GetLeaderboardType = z.infer<typeof getLeaderboardSchema>;
export type LeaderboardPaginatedType = z.infer<
  typeof leaderboardPaginatedSchema
>;
