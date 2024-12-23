import * as z from 'zod';

// Schema for property rating entry
const propertyRatingSchema = z.object({
  propertyId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid property ID format'),
  ratingId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid rating ID format'),
});

// Base schema for leaderboard
export const baseLeaderboardSchema = z.object({
  userId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid user ID format'),
  properties: z.array(propertyRatingSchema),
  totalRatings: z.number().min(0),
  score: z.number().min(0),
});

// Schema for pagination and filtering
export const getLeaderboardSchema = z.object({
  limitParam: z
    .string()
    .default('10')
    .transform(Number)
    .refine((val) => val > 0, 'Limit must be positive'),
  pageParam: z
    .string()
    .default('1')
    .transform(Number)
    .refine((val) => val > 0, 'Page must be positive'),
});

// Schema for paginated response
export const leaderboardPaginatedSchema = z.object({
  results: z.array(baseLeaderboardSchema),
  paginatorInfo: z.object({
    totalRecords: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    hasNextPage: z.boolean(),
  }),
});

// Schema for creating a leaderboard entry
export const createLeaderboardSchema = z.object({
  propertyId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid property ID format'),
  ratingId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid rating ID format'),
});

// Export types
export type LeaderboardType = z.infer<typeof baseLeaderboardSchema>;
export type GetLeaderboardSchemaType = z.infer<typeof getLeaderboardSchema>;
export type LeaderboardPaginatedType = z.infer<
  typeof leaderboardPaginatedSchema
>;
export type CreateLeaderboardSchemaType = z.infer<
  typeof createLeaderboardSchema
>;
