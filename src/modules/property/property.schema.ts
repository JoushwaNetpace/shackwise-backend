import { z } from 'zod';

// Address schema
const addressSchema = z.object({
  address: z.string(),
  city: z.string(),
  county: z.string(),
  state: z.string(),
  street: z.string(),
  zip: z.string(),
});

// Neighborhood schema
const neighborhoodSchema = z.object({
  center: z.string(),
  id: z.string(),
  name: z.string(),
  type: z.string(),
});

// Base property schema
export const basePropertySchema = z.object({
  absenteeOwner: z.boolean(),
  address: addressSchema,
  bathrooms: z.number(),
  bedrooms: z.number(),
  assessedValue: z.number(),
  estimatedValue: z.number(),
  floodZoneDescription: z.string(),
  mlsStatus: z.string(),
  propertyType: z.string(),
  yearBuilt: z.number(),
  neighborhood: neighborhoodSchema.optional(), // Add this line
});

// Create Property schema
export const createPropertySchema = basePropertySchema.extend({
  id: z.string(),
});

// Update Property schema (all fields optional)
export const updatePropertySchema = basePropertySchema.partial();

// Schema for property ID in params
export const propertyIdParamsSchema = z.object({
  propertyId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid property ID format'),
});

// Schema for getting properties with optional pagination and filters
export const getPropertiesSchema = z.object({
  page: z.number().positive().default(1),
  limit: z.number().positive().default(10),
  search: z.string().optional(),
});

// Schema for updating property with ID in params
export const updatePropertyParamsSchema = z.object({
  propertyId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid property ID format'),
});

// Export types
export type CreatePropertySchemaType = z.infer<typeof createPropertySchema>;
export type UpdatePropertySchemaType = z.infer<typeof updatePropertySchema>;
export type PropertyIdParamsSchemaType = z.infer<typeof propertyIdParamsSchema>;
export type GetPropertiesSchemaType = z.infer<typeof getPropertiesSchema>;
export type UpdatePropertyParamsSchemaType = z.infer<
  typeof updatePropertyParamsSchema
>;
