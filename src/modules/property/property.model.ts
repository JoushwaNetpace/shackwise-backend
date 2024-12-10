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

// Property schema
const PropertySchema = new Schema(
  {
    absenteeOwner: { type: Boolean, required: true },
    address: { type: AddressSchema, required: true },
    bathrooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    assessedValue: { type: Number, required: true },
    estimatedValue: { type: Number, required: true },
    floodZoneDescription: { type: String, required: true },
    mlsStatus: { type: String, required: true },
    propertyType: { type: String, required: true },
    yearBuilt: { type: Number, required: true },
    neighborhood: NeighborhoodSchema, // Add this line
  },
  { timestamps: true },
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
  assessedValue: number;
  estimatedValue: number;
  floodZoneDescription: string;
  mlsStatus: string;
  propertyType: string;
  yearBuilt: number;
}

// Create the Property model
const Property = mongoose.model<IPropertyDocument>('Property', PropertySchema);

export default Property;
