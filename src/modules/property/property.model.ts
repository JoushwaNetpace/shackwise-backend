import mongoose, { Document, Schema } from 'mongoose';

// Address schema
const AddressSchema = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  county: { type: String, required: true },
  state: { type: String, required: true },
  street: { type: String, required: true },
  zip: { type: String, required: true },
});

// Neighborhood schema
const NeighborhoodSchema = new Schema({
  center: { type: String, required: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
});

const mlsHistorySchema = new Schema({
  agentEmail: { type: String, required: false, default: null },
  agentName: { type: String, required: true },
  agentOffice: { type: String, required: true },
  agentPhone: { type: String, required: false, default: null },
  baths: { type: Number, required: true },
  beds: { type: Number, required: true },
  daysOnMarket: { type: String, required: true },
  lastStatusDate: { type: Date, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
  statusDate: { type: Date, required: true },
  type: { type: String, required: true },
});

// Property schema
const PropertySchema = new Schema(
  {
    absenteeOwner: { type: Boolean, required: true },
    address: { type: AddressSchema, required: true },
    bathrooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    squareFeet: { type: Number, required: true },
    latitude: { type: Number, required: true },
    propertyId: { type: String, required: true, index: true },
    longitude: { type: Number, required: true },
    lotSquareFeet: { type: Number, required: true },
    parkingSpaces: { type: Number, required: true },
    assessedValue: { type: Number, required: true },
    estimatedValue: { type: Number, required: true },
    floodZoneDescription: { type: String },
    mlsStatus: { type: String, required: true },
    propertyType: { type: String, required: true },
    yearBuilt: { type: Number, required: true },
    neighborhood: NeighborhoodSchema, // Add this line
    mlsKeywords: {
      creativeFinancing: { type: Boolean, default: false },
      investorOwned: { type: Boolean, default: false },
      motivatedSellerHigh: { type: Boolean, default: false },
      motivatedSellerLow: { type: Boolean, default: false },
      motivatedSellerMed: { type: Boolean, default: false },
    },
    mlsHistory: [mlsHistorySchema],
    schools: [
      {
        city: { type: String, required: true },
        enrollment: { type: Number, required: true },
        grades: { type: String, required: true },
        levels: {
          elementary: { type: Boolean, default: null },
          high: { type: Boolean, default: null },
          middle: { type: Boolean, default: null },
          preschool: { type: Boolean, default: null },
        },
        location: { type: String, required: true },
        name: { type: String, required: true },
        parentRating: { type: Number, required: true },
        rating: { type: Number, required: true },
        state: { type: String, required: true },
        street: { type: String, required: true },
        type: { type: String, required: true },
        zip: { type: String, required: true },
      },
    ],
    taxInfo: {
      assessedImprovementValue: Number,
      assessedLandValue: Number,
      assessedValue: Number,
      assessmentYear: Number,
      marketValue: Number,
      taxAmount: String,
      taxDelinquentYear: String,
    },
  },
  { timestamps: true, strict: false },
);

// Interface for the Property document
export interface IPropertyDocument extends Document {
  absenteeOwner: boolean;
  address: {
    address: string;
    city: string;
    county: string;
    state: string;
    street: string;
    zip: string;
  };
  bathrooms: number;
  bedrooms: number;
  squareFeet: number;
  latitude: number;
  longitude: number;
  lotSquareFeet: number;
  parkingSpaces: number;
  assessedValue: number;
  estimatedValue: number;
  floodZoneDescription: string;
  mlsStatus: string;
  propertyType: string;
  yearBuilt: number;
  neighborhood?: {
    center: string;
    id: string;
    name: string;
    type: string;
  };
  mlsKeywords: {
    creativeFinancing: boolean;
    investorOwned: boolean;
    motivatedSellerHigh: boolean;
    motivatedSellerLow: boolean;
    motivatedSellerMed: boolean;
  };
  mlsHistory: Array<{
    agentEmail: string | null;
    agentName: string;
    agentOffice: string;
    agentPhone: string | null;
    baths: number;
    beds: number;
    daysOnMarket: string;
    lastStatusDate: Date;
    price: number;
    status: string;
    statusDate: Date;
    type: string;
  }>;
  schools: Array<{
    city: string;
    enrollment: number;
    grades: string;
    levels: {
      elementary: boolean | null;
      high: boolean | null;
      middle: boolean | null;
      preschool: boolean | null;
    };
    location: string;
    name: string;
    parentRating: number;
    rating: number;
    state: string;
    street: string;
    type: string;
    zip: string;
  }>;
  taxInfo: {
    assessedImprovementValue: number;
    assessedLandValue: number;
    assessedValue: number;
    assessmentYear: number;
    marketValue: number;
    taxAmount: string;
    taxDelinquentYear: string | null;
  };
}

// Create the Property model
const Property = mongoose.model<IPropertyDocument>('Property', PropertySchema);

export default Property;
