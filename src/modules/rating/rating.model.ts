import mongoose, { Document, Schema } from 'mongoose';

// Define the schema for "rating" and "note" object fields
const RatingFieldSchema: Schema = new Schema({
  rating: { type: Number, required: true, default: 0 },
  note: { type: String },
});

const RatingSchema: Schema = new Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true,
    },
    ratedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    ratingMode: {
      type: String,
      required: true,
      enum: ['SHARE', 'COMPARE', 'GENERAL'],
    },
    affordability: { type: RatingFieldSchema, required: true },
    listPMarketV: { type: RatingFieldSchema, required: true },
    location: { type: RatingFieldSchema, required: true },
    kitchenSize: { type: RatingFieldSchema, required: true },
    masterBedroom: { type: RatingFieldSchema, required: true },
    masterBathroom: { type: RatingFieldSchema, required: true },
    secondaryBathroom: { type: RatingFieldSchema, required: true },
    secondaryBedroom: { type: RatingFieldSchema, required: true },
    livingEntertainment: { type: RatingFieldSchema, required: true },
    basement: { type: RatingFieldSchema, required: true },
    outdoorYardSpace: { type: RatingFieldSchema, required: true },
    parkingGarage: { type: RatingFieldSchema, required: true },
    overallCondition: { type: RatingFieldSchema, required: true },
  },
  { timestamps: true, strict: false },
);

// Define the interface for the Rating document
export interface IRatingDocument extends Document {
  propertyId: string;
  ratedBy: string[];
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

const Rating = mongoose.model<IRatingDocument>('Rating', RatingSchema);

export default Rating;
