import { Request, Response } from "express";
import { STATUS_CODE } from "../../constants/http-status";
import * as userService from "../users/user.service";

export async function listAllUsers(_req: Request, res: Response) {
  const users = await userService.findAll();
  res.status(STATUS_CODE.OK).json(users);
}

export async function listClubs(_req: Request, res: Response) {
  const clubs = await userService.findByType("club");
  res.status(STATUS_CODE.OK).json(clubs);
}
