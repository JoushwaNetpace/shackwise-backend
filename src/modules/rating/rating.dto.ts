import z from 'zod';
import { definePaginatedResponse } from '../../common/common.utils';

// Define the schema for "rating" and "note" object fields
const ratingFieldSchema = z.object({
  rating: z
    .number()
    .min(25, { message: 'Rating must be at least 25' })
    .max(100, { message: 'Rating cannot exceed 100' })
    .refine((value) => value % 5 === 0, {
      message: 'Rating must be divisible by 5',
    }),
  note: z.string().optional(),
});

// Base schema for Rating model
export const ratingSchema = z.object({
  _id: z.string(),
  propertyId: z.string(),
  ratedBy: z.array(z.string()), // Array of user IDs who rated
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
  ratingMode: z.enum(['SHARE', 'COMPARE', 'GENERAL']),
});

// Pagination schema
export const ratingsPaginatedSchema = definePaginatedResponse(ratingSchema);

// Export types
export type RatingModelType = z.infer<typeof ratingSchema>;
export type RatingType = z.infer<typeof ratingSchema> & {
  _id: string;
};
export type RatingPaginatedType = z.infer<typeof ratingsPaginatedSchema>;
