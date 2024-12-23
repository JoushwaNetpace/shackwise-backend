import mongoose, { Document, Schema } from 'mongoose';

// Define the schema for the ConnectionRequest model
const ConnectionRequestSchema: Schema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['ACCEPTED', 'REJECTED', 'PENDING'],
      default: 'PENDING',
    },
    requestType: {
      type: String,
      enum: ['PARTNER', 'AGENT'],
      default: 'PARTNER',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }, // Automatically adds `createdAt` and `updatedAt` fields
);

// Define the interface for the ConnectionRequest document
export interface IConnectionRequestDocument extends Document {
  senderId: string;
  receiverId: string;
  status: 'ACCEPTED' | 'REJECTED' | 'PENDING' | '';
  isRead: boolean;
  requestType: 'PARTNER' | 'AGENT';
  createdAt: Date;
  updatedAt: Date;
}

// Create the ConnectionRequest model
const ConnectionRequest = mongoose.model<IConnectionRequestDocument>(
  'ConnectionRequest',
  ConnectionRequestSchema,
);

export default ConnectionRequest;
