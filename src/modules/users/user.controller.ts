import { Request, Response } from "express";
import { STATUS_CODE, STATUS_MESSAGE } from "../../constants/http-status";
import { AuthenticatedRequest } from "../../middleware/auth";
import { AppError } from "../../middleware/error-handler";
import { buildPaginationMeta, toSkipLimit } from "../../utils/pagination";
import * as userService from "./user.service";
import { ListUsersQuery, UpdateProfileInput } from "./user.validation";

export async function listUsers(req: Request, res: Response) {
  const { userName, page, limit } = req.query as unknown as ListUsersQuery;

  if (userName) {
    const user = await userService.findByUsername(userName);

    if (!user) {
      throw new AppError(STATUS_CODE.NOT_FOUND, STATUS_MESSAGE.NOT_FOUND);
    }

    return res.status(STATUS_CODE.OK).json(user);
  }

  const { data, total } = await userService.findIndividuals(
    toSkipLimit({ page, limit }),
  );
  return res
    .status(STATUS_CODE.OK)
    .json({ data, pagination: buildPaginationMeta({ page, limit, total }) });
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  const email = req.auth.email;
  const data = req.body as UpdateProfileInput;

  const user = await userService.updateProfile(email, data);

  if (!user) {
    throw new AppError(STATUS_CODE.NOT_FOUND, STATUS_MESSAGE.USER_NOT_FOUND);
  }

  return res
    .status(STATUS_CODE.OK)
    .json({ message: STATUS_MESSAGE.PROFILE_UPDATE_SUCCESS });
}
