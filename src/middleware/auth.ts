import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { STATUS_CODE, STATUS_MESSAGE } from "../constants/http-status";

interface TokenPayload {
  User: { id: string };
}

/**
 * Request shape after requireAuth has run: `auth` is guaranteed present,
 * so handlers typed against this don't need a `req.auth!` assertion.
 * Pair with asyncHandler<AuthenticatedRequest>(...) in the route file.
 */
export interface AuthenticatedRequest extends Request {
  auth: { email: string };
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.Token;

  if (!token) {
    res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ message: STATUS_MESSAGE.UNAUTHORIZED });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.auth = { email: decoded.User.id };
    next();
  } catch {
    res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ message: STATUS_MESSAGE.UNAUTHORIZED });
  }
}
