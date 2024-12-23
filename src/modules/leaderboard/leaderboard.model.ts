import mongoose, { Document, Schema } from 'mongoose';

// Define the schema for property ratings entry
const PropertyRatingSchema: Schema = new Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  ratingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating',
    required: true,
  },
});

const LeaderboardSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    properties: [PropertyRatingSchema],
  },
  { timestamps: true },
);

// Define the interface for the Leaderboard document
export interface ILeaderboardDocument extends Document {
  userId: string;
  properties: Array<{
    propertyId: string;
    ratingId: string;
  }>;
}

const Leaderboard = mongoose.model<ILeaderboardDocument>(
  'Leaderboard',
  LeaderboardSchema,
);

export default Leaderboard;
