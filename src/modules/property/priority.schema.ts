import * as z from 'zod';

// Define a schema for fields containing `rating` and `note`
const priorityFieldSchema = z.object({
  rating: z.number({ required_error: 'Rating is required' }).min(0).max(100), // Assuming ratings range from 1 to 5
  note: z.string().optional(), // Note is optional
});

// Base schema for creating or updating a priority
export const basePrioritySchema = z.object({
  userId: z.string({ required_error: 'User ID is required' }), // User ID reference
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
});

// Update schema for updating a priority
export const updatePrioritySchemaL = z.object({
  userId: z.string({ required_error: 'User ID is required' }), // User ID reference
  affordability: priorityFieldSchema.optional(),
  listPMarketV: priorityFieldSchema.optional(),
  location: priorityFieldSchema.optional(),
  kitchenSize: priorityFieldSchema.optional(),
  masterBedroom: priorityFieldSchema.optional(),
  masterBathroom: priorityFieldSchema.optional(),
  secondaryBathroom: priorityFieldSchema.optional(),
  secondaryBedroom: priorityFieldSchema.optional(),
  livingEntertainment: priorityFieldSchema.optional(),
  basement: priorityFieldSchema.optional(),
  outdoorYardSpace: priorityFieldSchema.optional(),
  parkingGarage: priorityFieldSchema.optional(),
  overallCondition: priorityFieldSchema.optional(),
});

// Schema for creating a new priority
// export const createPrioritySchema = basePrioritySchema.extend({
//   createdDate: z.date({ required_error: 'Created date is required' }),
// });

// Schema for updating an existing priority
export const updatePrioritySchema = updatePrioritySchemaL;

// Schema for pagination and filtering
export const getPrioritiesSchema = z.object({
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

// Schema for the priority ID in params
export const updatePriorityParamsSchema = z.object({
  priorityId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid priority ID format'),
});

// Schema for paginated response
export const prioritiesPaginatedSchema = z.object({
  results: z.array(
    basePrioritySchema.extend({
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
export type CreatePrioritySchemaType = z.infer<typeof basePrioritySchema>;
export type UpdatePrioritySchemaType = z.infer<typeof updatePrioritySchema>;
export type GetPrioritiesSchemaType = z.infer<typeof getPrioritiesSchema>;
export type UpdatePriorityParamsSchemaType = z.infer<
  typeof updatePriorityParamsSchema
>;
export type PrioritiesPaginatedSchemaType = z.infer<
  typeof prioritiesPaginatedSchema
>;
