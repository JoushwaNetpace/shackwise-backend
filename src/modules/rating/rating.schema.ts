import * as z from 'zod';

// Define a schema for fields containing `rating` and `note`
const ratingFieldSchema = z.object({
  rating: z.number({ required_error: 'Rating is required' }).min(0).max(100),
  note: z.string().optional(),
});

// Base schema for creating or updating a rating
export const baseRatingSchema = z.object({
  ratingMode: z.enum(['SHARE', 'COMPARE', 'GENERAL']),

  ratedBy: z.array(z.string({ required_error: 'Rater ID is required' })),
  propertyId: z.string({ required_error: 'PropertyID is required' }),
  affordability: ratingFieldSchema,
  listPMarketV: ratingFieldSchema,
  location: ratingFieldSchema,
  kitchenSize: ratingFieldSchema,
  masterBedroom: ratingFieldSchema,
  masterBathroom: ratingFieldSchema,
  secondaryBathroom: ratingFieldSchema,
  secondaryBedroom: ratingFieldSchema,
  livingEntertainment: ratingFieldSchema,
  basement: ratingFieldSchema,
  outdoorYardSpace: ratingFieldSchema,
  parkingGarage: ratingFieldSchema,
  overallCondition: ratingFieldSchema,
});

// Update schema for updating a rating
export const updateRatingSchema = z.object({
  ratedBy: z.array(z.string()).optional(),
  affordability: ratingFieldSchema.optional(),
  listPMarketV: ratingFieldSchema.optional(),
  location: ratingFieldSchema.optional(),
  kitchenSize: ratingFieldSchema.optional(),
  masterBedroom: ratingFieldSchema.optional(),
  masterBathroom: ratingFieldSchema.optional(),
  secondaryBathroom: ratingFieldSchema.optional(),
  secondaryBedroom: ratingFieldSchema.optional(),
  livingEntertainment: ratingFieldSchema.optional(),
  basement: ratingFieldSchema.optional(),
  outdoorYardSpace: ratingFieldSchema.optional(),
  parkingGarage: ratingFieldSchema.optional(),
  overallCondition: ratingFieldSchema.optional(),
});

// Schema for pagination and filtering
export const getRatingsSchema = z.object({
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

// Schema for the rating ID in params
export const updateRatingParamsSchema = z.object({
  ratingId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid rating ID format'),
});

// Schema for paginated response
export const ratingsPaginatedSchema = z.object({
  results: z.array(
    baseRatingSchema.extend({
      id: z.string(),
      createdDate: z.date(),
      updatedDate: z.date().optional(),
    }),
  ),
  paginatorInfo: z.object({
    totalRecords: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    hasNextPage: z.boolean(),
  }),
});

// Export types
export type CreateRatingSchemaType = z.infer<typeof baseRatingSchema>;
export type UpdateRatingSchemaType = z.infer<typeof updateRatingSchema>;
export type GetRatingsSchemaType = z.infer<typeof getRatingsSchema>;
export type UpdateRatingParamsSchemaType = z.infer<
  typeof updateRatingParamsSchema
>;
export type RatingsPaginatedSchemaType = z.infer<typeof ratingsPaginatedSchema>;
