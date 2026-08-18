import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { STATUS_CODE, STATUS_MESSAGE } from "../constants/http-status";

interface TokenPayload {
  User: { id: string };
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.Token;

  if (!token) {
    res.status(STATUS_CODE.UNAUTHORIZED).json({ message: STATUS_MESSAGE.UNAUTHORIZED });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.auth = { email: decoded.User.id };
    next();
  } catch {
    res.status(STATUS_CODE.UNAUTHORIZED).json({ message: STATUS_MESSAGE.UNAUTHORIZED });
  }
}
