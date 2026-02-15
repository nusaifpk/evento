import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  category: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  city: string;
  startDate: Date;
  endDate: Date;
  price: number;
  images: string[];
  organizerName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      trim: true,
      enum: [
        'Music',
        'Nightlife',
        'Tech',
        'Arts',
        'Food',
        'Sports',
        'Gaming',
        'Outdoors',
        'Workshop',
        'Cultural',
        'Other',
      ],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (coords: number[]) {
            return (
              coords.length === 2 &&
              coords[0] >= -180 &&
              coords[0] <= 180 &&
              coords[1] >= -90 &&
              coords[1] <= 90
            );
          },
          message: 'Invalid coordinates. Must be [longitude, latitude]',
        },
      },
    },
    address: {
      type: String,
      required: [true, 'Event address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Event city is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Event start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'Event end date is required'],
      validate: {
        validator: function (this: IEvent, endDate: Date) {
          return endDate > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    price: {
      type: Number,
      required: [true, 'Event price is required'],
      min: [0, 'Price cannot be negative'],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    organizerName: {
      type: String,
      required: [true, 'Organizer name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
  }
);

// Create 2dsphere index for geospatial queries
EventSchema.index({ location: '2dsphere' });

// Index for common queries
EventSchema.index({ startDate: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ city: 1 });
EventSchema.index({ status: 1 }); // Index for status filtering

export const Event = mongoose.model<IEvent>('Event', EventSchema);

