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

// Add new schemas
const mlsKeywordsSchema = z.object({
  creativeFinancing: z.boolean().default(false),
  investorOwned: z.boolean().default(false),
  motivatedSellerHigh: z.boolean().default(false),
  motivatedSellerLow: z.boolean().default(false),
  motivatedSellerMed: z.boolean().default(false),
});

const mlsHistoryItemSchema = z.object({
  agentEmail: z.string().nullable(),
  agentName: z.string(),
  agentOffice: z.string(),
  agentPhone: z.string().nullable(),
  baths: z.number(),
  beds: z.number(),
  daysOnMarket: z.string(),
  lastStatusDate: z.string(),
  price: z.number(),
  status: z.string(),
  statusDate: z.string(),
  type: z.string(),
});

const schoolSchema = z.object({
  city: z.string(),
  enrollment: z.number(),
  grades: z.string(),
  levels: z.object({
    elementary: z.boolean().nullable(),
    high: z.boolean().nullable(),
    middle: z.boolean().nullable(),
    preschool: z.boolean().nullable(),
  }),
  location: z.string(),
  name: z.string(),
  parentRating: z.number(),
  rating: z.number(),
  state: z.string(),
  street: z.string(),
  type: z.string(),
  zip: z.string(),
});

const taxInfoSchema = z.object({
  assessedImprovementValue: z.number(),
  assessedLandValue: z.number(),
  assessedValue: z.number(),
  assessmentYear: z.number(),
  marketValue: z.number(),
  taxAmount: z.string(),
  taxDelinquentYear: z.string().nullable(),
});

// Base property schema
export const basePropertySchema = z.object({
  absenteeOwner: z.boolean(),
  address: addressSchema,
  bathrooms: z.number(),
  bedrooms: z.number(),
  squareFeet: z.number(),
  propertyId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  lotSquareFeet: z.number(),
  parkingSpaces: z.number(),
  assessedValue: z.number(),
  estimatedValue: z.number(),
  floodZoneDescription: z.string().nullable(),
  mlsStatus: z.string(),
  propertyType: z.string(),
  yearBuilt: z.number(),
  neighborhood: neighborhoodSchema.optional(), // Add this line
  mlsKeywords: mlsKeywordsSchema,
  mlsHistory: z.array(mlsHistoryItemSchema),
  schools: z.array(schoolSchema),
  taxInfo: taxInfoSchema,
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

// Add new filter schema
export const propertyFilterSchema = z.object({
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minBeds: z.number().optional(),
  maxBeds: z.number().optional(),
  minBaths: z.number().optional(),
  maxBaths: z.number().optional(),
  propertyType: z.array(z.string()).optional(),
  mlsStatus: z.array(z.string()).optional(),
  motivatedSeller: z.boolean().optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().default(10),
});

// Export types
export type CreatePropertySchemaType = z.infer<typeof createPropertySchema>;
export type UpdatePropertySchemaType = z.infer<typeof updatePropertySchema>;
export type PropertyIdParamsSchemaType = z.infer<typeof propertyIdParamsSchema>;
export type GetPropertiesSchemaType = z.infer<typeof getPropertiesSchema>;
export type UpdatePropertyParamsSchemaType = z.infer<
  typeof updatePropertyParamsSchema
>;
export type PropertyFilterSchemaType = z.infer<typeof propertyFilterSchema>;
