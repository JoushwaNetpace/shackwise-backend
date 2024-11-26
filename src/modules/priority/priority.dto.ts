import z from 'zod';
import { definePaginatedResponse } from '../../common/common.utils';

// Define the schema for "rating" and "note" object fields
const priorityFieldSchema = z.object({
  rating: z
    .number()
    .min(25, { message: 'Rating must be at least 25' })
    .max(100, { message: 'Rating cannot exceed 100' })
    .refine((value) => value % 5 === 0, {
      message: 'Rating must be divisible by 5',
    }),
  note: z.string().optional(), // Note is optional
});

// Base schema for Priority model
export const prioritySchema = z.object({
  _id: z.string(), // Primary key (MongoDB default)
  userId: z.string(), // Foreign key to USER table
  affordability: priorityFieldSchema,
  listPMarketV: priorityFieldSchema,
  location: priorityFieldSchema,
  kitchenSize: priorityFieldSchema,
  masterBedroom: priorityFieldSchema,
  masterBathroom: priorityFieldSchema,
  secondaryBathroom: priorityFieldSchema,
  secondaryBedroom: priorityFieldSchema,
  livingEntertainment: priorityFieldSchema,
  basement: priorityFieldSchema,
  outdoorYardSpace: priorityFieldSchema,
  parkingGarage: priorityFieldSchema,
  overallCondition: priorityFieldSchema,
  createdDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for createdDate',
  }),
  updatedDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for updatedDate',
  }),
});

// Pagination schema
export const prioritiesPaginatedSchema =
  definePaginatedResponse(prioritySchema);

// Export types
export type PriorityModelType = z.infer<typeof prioritySchema>;
export type PriorityType = z.infer<typeof prioritySchema> & {
  _id: string;
};
export type PriorityPaginatedType = z.infer<typeof prioritiesPaginatedSchema>;
