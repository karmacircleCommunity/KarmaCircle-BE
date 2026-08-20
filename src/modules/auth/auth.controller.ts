import { Request, Response } from "express";
import { env } from "../../config/env";
import { STATUS_CODE, STATUS_MESSAGE } from "../../constants/http-status";
import { IUser } from "../users/user.model";
import * as userService from "../users/user.service";
import * as authService from "./auth.service";
import {
  clearedCookieOptions,
  httpOnlyCookieOptions,
  readableCookieOptions,
} from "./auth.cookies";
import {
  SigninInput,
  SignupInput,
  UpdatePasswordInput,
} from "./auth.validation";

export async function signup(req: Request, res: Response) {
  const { token, user } = await authService.signup(req.body as SignupInput);

  res
    .status(STATUS_CODE.CREATED)
    .cookie("Token", token, readableCookieOptions())
    .json({
      message: STATUS_MESSAGE.SIGNUP_SUCCESS,
      user,
    });
}

export async function signin(req: Request, res: Response) {
  const { email, password } = req.body as SigninInput;
  const { token, user } = await authService.signin(email, password);

  res
    .status(STATUS_CODE.OK)
    .cookie("Token", token, readableCookieOptions())
    .json({
      message: STATUS_MESSAGE.LOGIN_SUCCESS,
      user,
    });
}

export async function updatePassword(req: Request, res: Response) {
  const { email, oldPassword, newPassword } = req.body as UpdatePasswordInput;
  await authService.updatePassword(email, oldPassword, newPassword);

  res
    .status(STATUS_CODE.CREATED)
    .json({ message: STATUS_MESSAGE.PASSWORD_UPDATE_SUCCESS });
}

export function googleInitiate(req: Request, res: Response) {
  const googleAuthURL = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = new URLSearchParams({
    response_type: "code",
    redirect_uri: env.CALLBACK_URL,
    scope: "profile email ",
    client_id: env.CLIENT_ID,
    state: typeof req.query.userType === "string" ? req.query.userType : "",
  });

  res.status(STATUS_CODE.CREATED).json({ url: `${googleAuthURL}?${params}` });
}

export function googleCallback(req: Request, res: Response): void {
  if (!req.isAuthenticated() || !req.user) {
    res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ error: true, message: STATUS_MESSAGE.UNAUTHORIZED });
    return;
  }

  res
    .cookie("OAuthLoginInitiated", true, {
      expires: new Date(Date.now() + 5 * 60 * 1000),
      httpOnly: false,
      secure: true,
      sameSite: "none",
      domain: env.ORIGIN_DOMAIN,
    })
    .redirect(env.successURL);
}

export function loginFailed(_req: Request, res: Response) {
  res
    .status(STATUS_CODE.UNAUTHORIZED)
    .json({ error: true, message: STATUS_MESSAGE.UNAUTHORIZED });
}

export function loginSuccess(req: Request, res: Response): void {
  if (!req.user) {
    res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ error: true, message: STATUS_MESSAGE.UNAUTHORIZED });
    return;
  }

  const user = req.user as IUser;
  const token = authService.signToken(user.email, user.tokenVersion);
  const sanitizedUser = userService.sanitize(user);

  res
    .status(STATUS_CODE.OK)
    .cookie("OAuthLoginInitiated", false, clearedCookieOptions(false))
    .cookie("Token", token, httpOnlyCookieOptions())
    .cookie("userName", user.userName, readableCookieOptions())
    .cookie("isLoggedIn", true, readableCookieOptions())
    .cookie("userType", "user", readableCookieOptions())
    .json({
      message: STATUS_MESSAGE.LOGIN_SUCCESS,
      user: sanitizedUser,
    });
}

export async function logout(req: Request, res: Response) {
  // Best-effort revocation: if this cookie decodes to a real session, kill
  // it server-side too, not just on the client. A missing/expired/garbage
  // token is not an error here — logout always succeeds either way.
  const decoded = authService.verifyTokenLoosely(req.cookies?.Token);
  if (decoded) {
    await authService.bumpTokenVersion(decoded.email);
  }

  res
    .status(STATUS_CODE.OK)
    .cookie("Token", false, clearedCookieOptions(true))
    .cookie("userName", false, clearedCookieOptions(false))
    .cookie("isLoggedIn", false, clearedCookieOptions(false))
    .cookie("userType", false, clearedCookieOptions(false))
    .json({ message: STATUS_MESSAGE.LOGOUT_SUCCESS });
}
