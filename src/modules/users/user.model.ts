import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  userType?: string;
  userName: string;
  name?: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  bannerPicture?: string;
  password: string;
  description?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  config?: {
    hasCompletedProfile: boolean;
  };
  cart: Array<{ id: string }>;
}

const userSchema = new Schema<IUser>({
  userType: { type: String },
  userName: {
    type: String,
    required: true,
  },
  name: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: { type: String },
  profilePicture: { type: String },
  bannerPicture: { type: String },
  password: {
    type: String,
    required: true,
  },
  description: { type: String },
  address: {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
  },
  config: {
    hasCompletedProfile: { type: Boolean, default: false },
  },
  cart: [{ id: { type: String } }],
});

export const User = mongoose.model<IUser>("user", userSchema);
