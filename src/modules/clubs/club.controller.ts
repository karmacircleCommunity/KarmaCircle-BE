import { Request, Response } from "express";
import { STATUS_CODE, STATUS_MESSAGE } from "../../constants/http-status";
import { AppError } from "../../middleware/error-handler";
import * as userService from "../users/user.service";

export async function listClubs(req: Request, res: Response) {
  const { userName } = req.query as { userName?: string };

  if (userName) {
    const club = await userService.findByUsername(userName);

    if (!club) {
      throw new AppError(STATUS_CODE.NOT_FOUND, STATUS_MESSAGE.NOT_FOUND);
    }

    return res.status(STATUS_CODE.OK).json(club);
  }

  const clubs = await userService.findByType("club");
  return res.status(STATUS_CODE.OK).json(clubs);
}

export async function dashboard(req: Request, res: Response) {
  const email = req.auth!.email;
  const user = await userService.findByEmail(email);

  if (!user) {
    throw new AppError(STATUS_CODE.NOT_FOUND, STATUS_MESSAGE.DASHBOARD_FETCH_FAILED);
  }

  return res.status(STATUS_CODE.OK).json(userService.sanitize(user));
}
