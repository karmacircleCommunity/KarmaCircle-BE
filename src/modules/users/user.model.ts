import mongoose, { Document, Schema } from "mongoose";

/**
 * The two categories the app's own code queries by. The Mongoose field
 * itself stays an unconstrained string (not `enum: [...]`) because the
 * DB was never validated at this level and may hold other values from
 * before this type existed; `(string & NonNullable<unknown>)` keeps that
 * honest while still giving autocomplete/typo-safety for the two known
 * values.
 */
export type UserType = "individual" | "club";

export interface IUser extends Document {
  userType?: UserType | (string & NonNullable<unknown>);
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
  /**
   * Bumped on logout and on password change to revoke every JWT issued
   * before that point — see src/modules/auth/auth.service.ts's signToken
   * and src/middleware/auth.ts's requireAuth. Never returned to a client;
   * excluded the same way `password` is (see user.service.ts).
   */
  tokenVersion: number;
}

const userSchema = new Schema<IUser>({
  userType: { type: String, index: true },
  // Not `unique: true` — userName uniqueness is still only enforced at the
  // application layer (generateUniqueUsername in user.service.ts), which
  // has a real check-then-write race window. A plain index here only
  // speeds up lookups; it does not close that race. See known-issues.md.
  userName: {
    type: String,
    required: true,
    index: true,
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
  tokenVersion: { type: Number, default: 0 },
});

export const User = mongoose.model<IUser>("user", userSchema);
