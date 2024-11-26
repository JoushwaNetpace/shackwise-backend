import mongoose, { Document, Schema } from 'mongoose';

// Define the schema for "rating" and "note" object fields
const PriorityFieldSchema: Schema = new Schema({
  rating: { type: Number, required: true, default: 0 },
  note: { type: String },
});

const PrioritySchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    }, // Foreign key to the User collection

    affordability: { type: PriorityFieldSchema, required: true },
    listPMarketV: { type: PriorityFieldSchema, required: true },
    location: { type: PriorityFieldSchema, required: true },
    kitchenSize: { type: PriorityFieldSchema, required: true },
    masterBedroom: { type: PriorityFieldSchema, required: true },
    masterBathroom: { type: PriorityFieldSchema, required: true },
    secondaryBathroom: { type: PriorityFieldSchema, required: true },
    secondaryBedroom: { type: PriorityFieldSchema, required: true },
    livingEntertainment: { type: PriorityFieldSchema, required: true },
    basement: { type: PriorityFieldSchema, required: true },
    outdoorYardSpace: { type: PriorityFieldSchema, required: true },
    parkingGarage: { type: PriorityFieldSchema, required: true },
    overallCondition: { type: PriorityFieldSchema, required: true },
  },
  { timestamps: true }, // Automatically adds `createdAt` and `updatedAt` fields
);

// Define the interface for the Priority document
export interface IPriorityDocument extends Document {
  userId: string; // Foreign key reference
  affordability: { rating: number; note?: string };
  listPMarketV: { rating: number; note?: string };
  location: { rating: number; note?: string };
  kitchenSize: { rating: number; note?: string };
  masterBedroom: { rating: number; note?: string };
  masterBathroom: { rating: number; note?: string };
  secondaryBathroom: { rating: number; note?: string };
  secondaryBedroom: { rating: number; note?: string };
  livingEntertainment: { rating: number; note?: string };
  basement: { rating: number; note?: string };
  outdoorYardSpace: { rating: number; note?: string };
  parkingGarage: { rating: number; note?: string };
  overallCondition: { rating: number; note?: string };
}

// Create the Priority model
const Priority = mongoose.model<IPriorityDocument>('Priority', PrioritySchema);

export default Priority;
