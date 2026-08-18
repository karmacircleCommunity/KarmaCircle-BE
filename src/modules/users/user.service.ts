import { IUser, User } from "./user.model";

const PUBLIC_FIELDS = "-password -__v";

export async function generateUniqueUsername(email: string): Promise<string> {
  let userName = email.split("@")[0];

  while (await User.findOne({ userName })) {
    userName = `${email.split("@")[0]}${Math.floor(Math.random() * 10000)}`;
  }

  return userName;
}

export async function findByEmail(email: string) {
  return User.findOne({ email });
}

export async function findByUsername(userName: string) {
  return User.findOne({ userName }).select(PUBLIC_FIELDS);
}

export async function findIndividuals() {
  return User.find({ userType: "individual" }).select(PUBLIC_FIELDS);
}

export async function findAll() {
  return User.find({}).select(PUBLIC_FIELDS);
}

export async function findByType(userType: string) {
  return User.find({ userType }).select(PUBLIC_FIELDS);
}

interface UpdateProfileInput {
  tagLine?: string;
  description?: string;
  city?: string;
  state?: string;
  address?: string;
  country?: string;
  pincode?: string;
}

export async function updateProfile(email: string, data: UpdateProfileInput) {
  return User.findOneAndUpdate({ email }, { $set: data }, { new: true }).select(
    PUBLIC_FIELDS,
  );
}

export function sanitize(user: IUser) {
  const { password, _id, __v, ...rest } = user.toObject();
  return rest;
}
