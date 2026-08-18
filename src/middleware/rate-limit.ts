import rateLimit from "express-rate-limit";
import { STATUS_CODE } from "../constants/http-status";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: STATUS_CODE.TOO_MANY_REQUESTS,
  message: { message: "Too many auth attempts, please try again later." },
});
