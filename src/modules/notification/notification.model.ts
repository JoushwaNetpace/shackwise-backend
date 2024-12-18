import mongoose, { Document, Schema } from 'mongoose';

// Define the schema for the Notification model
const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    }, // Foreign key to the User collection

    title: { type: String, required: true, index: true },
    body: { type: String, required: true },
    // type: { type: String,  },
    connectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ConnectionRequest',
    },
    notificationType: {
      type: String,
      enum: [
        'GENERAL',
        'COMPARE_REQUEST',
        'SHARE_REQUEST',
        'CONNECTION_REQUEST',
      ],
      required: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }, // Automatically adds `createdAt` and `updatedAt` fields
);

// Define the interface for the Notification document
export interface INotificationDocument extends Document {
  userId: string;
  title: string;
  body: string;
  // type: string;
  connectId: string;
  notificationType:
    | 'GENERAL'
    | 'COMPARE_REQUEST'
    | 'SHARE_REQUEST'
    | 'CONNECTION_REQUEST';
  isRead?: boolean;
}

// Create the Notification model
const Notification = mongoose.model<INotificationDocument>(
  'Notification',
  NotificationSchema,
);

export default Notification;
