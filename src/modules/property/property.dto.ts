import { z } from 'zod';
import { definePaginatedResponse } from '../../common/common.utils';

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

// Property DTO schema
export const propertySchema = z.object({
  id: z.string(),
  absenteeOwner: z.boolean(),
  address: addressSchema,
  adjustableRate: z.boolean(),
  airConditioningAvailable: z.boolean(),
  assessedImprovementValue: z.number(),
  assessedLandValue: z.number(),
  assessedValue: z.number(),
  auction: z.boolean(),
  basement: z.boolean(),
  bathrooms: z.number(),
  bedrooms: z.number(),
  cashBuyer: z.boolean(),
  corporateOwned: z.boolean(),
  death: z.boolean(),
  distressed: z.boolean(),
  documentType: z.string(),
  documentTypeCode: z.string(),
  equity: z.boolean(),
  equityPercent: z.number(),
  estimatedEquity: z.number(),
  estimatedValue: z.number(),
  floodZone: z.boolean(),
  floodZoneDescription: z.string().nullable(),
  floodZoneType: z.string(),
  foreclosure: z.boolean(),
  forSale: z.boolean(),
  freeClear: z.boolean(),
  garage: z.boolean(),
  highEquity: z.boolean(),
  inherited: z.boolean(),
  inStateAbsenteeOwner: z.boolean(),
  investorBuyer: z.boolean(),
  landUse: z.string(),
  lastMortgage1Amount: z.number().nullable(),
  lastSaleAmount: z.string(),
  lastSaleDate: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  lotSquareFeet: z.number(),
  mailAddress: addressSchema,
  medianIncome: z.string(),
  mlsActive: z.boolean(),
  mlsCancelled: z.boolean(),
  mlsDaysOnMarket: z.number(),
  mlsFailed: z.boolean(),
  mlsHasPhotos: z.boolean(),
  mlsLastSaleDate: z.string(),
  mlsLastStatusDate: z.string(),
  mlsListingDate: z.string(),
  mlsListingPrice: z.number(),
  mlsPending: z.boolean(),
  mlsSold: z.boolean(),
  mlsStatus: z.string(),
  mlsType: z.string(),
  negativeEquity: z.boolean(),
  neighborhood: neighborhoodSchema,
  openMortgageBalance: z.number(),
  outOfStateAbsenteeOwner: z.boolean(),
  owner1FirstName: z.string(),
  owner1LastName: z.string(),
  owner2FirstName: z.string().optional(),
  owner2LastName: z.string().optional(),
  ownerOccupied: z.boolean(),
  preForeclosure: z.boolean(),
  privateLender: z.boolean(),
  propertyId: z.string(),
  propertyType: z.string(),
  propertyUse: z.string(),
  propertyUseCode: z.number(),
  rentAmount: z.number().nullable(),
  reo: z.boolean(),
  roomsCount: z.number(),
  squareFeet: z.number(),
  suggestedRent: z.string(),
  unitsCount: z.number(),
  vacant: z.boolean(),
  yearBuilt: z.number(),
  yearsOwned: z.number(),
});

// Paginated response schema
export const propertiesPaginatedSchema =
  definePaginatedResponse(propertySchema);

// Export types
export type PropertyType = z.infer<typeof propertySchema>;
export type PropertiesPaginatedType = z.infer<typeof propertiesPaginatedSchema>;
