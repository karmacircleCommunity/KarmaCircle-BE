import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { STATUS_CODE, STATUS_MESSAGE } from "../../constants/http-status";
import { AppError } from "../../middleware/error-handler";
import { IUser, User } from "../users/user.model";
import * as userService from "../users/user.service";
import { SignupInput } from "./auth.validation";

const SALT_ROUNDS = 10;

export function signToken(email: string): string {
  return jwt.sign({ User: { id: email } }, env.JWT_SECRET);
}

export async function signup(input: SignupInput): Promise<{ token: string; user: unknown }> {
  const { email, ...data } = input;

  const existingUser = await userService.findByEmail(email);
  if (existingUser) {
    throw new AppError(STATUS_CODE.CONFLICT, STATUS_MESSAGE.USER_ALREADY_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  const userName = await userService.generateUniqueUsername(email);

  const newUser = new User({
    ...data,
    userName,
    email,
    password: hashedPassword,
  });
  await newUser.save();

  return {
    token: signToken(email),
    user: userService.sanitize(newUser),
  };
}

export async function signin(
  email: string,
  password: string,
): Promise<{ token: string; user: unknown }> {
  const existingUser = await userService.findByEmail(email);

  if (!existingUser) {
    throw new AppError(STATUS_CODE.UNAUTHORIZED, STATUS_MESSAGE.INVALID_CREDENTIALS);
  }

  const validPassword = await bcrypt.compare(password, existingUser.password);
  if (!validPassword) {
    throw new AppError(STATUS_CODE.UNAUTHORIZED, STATUS_MESSAGE.INVALID_CREDENTIALS);
  }

  return {
    token: signToken(existingUser.email),
    user: userService.sanitize(existingUser),
  };
}

export async function updatePassword(
  email: string,
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  const existingUser = await userService.findByEmail(email);
  if (!existingUser) {
    throw new AppError(STATUS_CODE.NOT_FOUND, STATUS_MESSAGE.USER_NOT_FOUND);
  }

  const validPassword = await bcrypt.compare(oldPassword, existingUser.password);
  if (!validPassword) {
    throw new AppError(STATUS_CODE.UNAUTHORIZED, STATUS_MESSAGE.USER_NOT_FOUND);
  }

  existingUser.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await existingUser.save();
}

export async function findOrCreateGoogleUser(params: {
  email: string;
  name?: string;
  userType?: string;
}): Promise<IUser> {
  const { email, name, userType } = params;

  const existingUser = await userService.findByEmail(email);
  if (existingUser) {
    return existingUser;
  }

  const userName = await userService.generateUniqueUsername(email);
  const randomPassword = await bcrypt.hash(crypto.randomBytes(20).toString("hex"), SALT_ROUNDS);

  return User.create({
    email,
    name,
    userType,
    userName,
    password: randomPassword,
  });
}
