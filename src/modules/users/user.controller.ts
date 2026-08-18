import { Request, Response } from "express";
import { STATUS_CODE, STATUS_MESSAGE } from "../../constants/http-status";
import { AppError } from "../../middleware/error-handler";
import * as userService from "./user.service";
import { ListUsersQuery, UpdateProfileInput } from "./user.validation";

export async function listUsers(req: Request, res: Response) {
  const { userName } = req.query as ListUsersQuery;

  if (userName) {
    const user = await userService.findByUsername(userName);

    if (!user) {
      throw new AppError(STATUS_CODE.NOT_FOUND, STATUS_MESSAGE.NOT_FOUND);
    }

    return res.status(STATUS_CODE.OK).json(user);
  }

  const users = await userService.findIndividuals();
  return res.status(STATUS_CODE.OK).json(users);
}

export async function updateProfile(req: Request, res: Response) {
  const email = req.auth!.email;
  const data = req.body as UpdateProfileInput;

  const user = await userService.updateProfile(email, data);

  if (!user) {
    throw new AppError(STATUS_CODE.NOT_FOUND, STATUS_MESSAGE.USER_NOT_FOUND);
  }

  return res
    .status(STATUS_CODE.OK)
    .json({ message: STATUS_MESSAGE.PROFILE_UPDATE_SUCCESS });
}
