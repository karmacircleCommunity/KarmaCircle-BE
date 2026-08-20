# Known Issues & Inconsistencies

A catalog of the cross-cutting bugs, gaps, and unresolved inconsistencies found while writing these specs (August 2026), gathered from static reading of the code — none of this has been verified by running the app. Each item also appears inline in its relevant module spec; this file exists so an agent can get the full picture in one read before making changes near any of these areas. Treat entries here as **things to be aware of**, not necessarily things to fix unless you were asked to.

## Pagination

**Resolved.** Every "list everything" endpoint (`GET /user`, `GET /clubs`, `GET /display/users`, `GET /display/clubs`, `GET /events`, `GET /product/allproducts`) now takes `?page=&limit=` and returns `{ data, pagination: { page, limit, total, totalPages } }` instead of a bare array — see [architecture.md](./architecture.md#pagination). This is a **response-shape change** on those six routes. Per [api-contract.md](./api-contract.md), the only currently-reachable frontend caller of any of them was `GetAllClubs()` (`GET /clubs`, no `userName`), and per the frontend's own `donate-shop-trending/SPEC.md` that function is only invoked from `Donate.tsx` — a page with no registered route in the frontend today — so this shipped with **no live frontend breakage**. It will still need `GetAllClubs()`'s caller updated to read `response.data.data` (and the frontend's own specs updated) whenever `Donate.tsx`/that call site is fixed or routed.

## Cross-repo contract breaks

The single most important category in this file — see [api-contract.md](./api-contract.md) for the full trace of each:

1. **`POST /user/update` vs. the frontend's `PATCH` call.** The live "edit my profile" feature does not work against this backend today — Express doesn't match `PATCH` against a `router.post(...)` registration, so every real call 404s.
2. **`GET /user/profile` doesn't exist**, but `Dashboard.tsx` calls it live via SWR. The dashboard's actual working data source (`GET /clubs/dashboard`, via `fetchDashboard()`) is a separate, correctly-wired path the same page doesn't currently use for this particular fetch.
3. **`GET /auth/login/success` likely can't complete Google OAuth** — its controller needs `req.user`, which nothing in this stateless-JWT-only backend carries forward from the earlier `/auth/google/callback` request. Needs live verification, not just static reading, before treating as confirmed.
4. **`PATCH /user/complete` doesn't exist at all**, but the frontend's profile-completion modal calls it live. `User.config.hasCompletedProfile` can never become `true` through any code path in this API.

## Auth

- **JWT expiry + session revocation: resolved.** `signToken` used to issue a JWT with no expiry at all — only the cookie carrying it expired (30 days), and there was no way to kill a session early. Fixed: the JWT now carries its own `expiresIn` (tied to the same `THIRTY_DAYS_MS` constant the cookie uses, so both lapse together), and every `User` has a `tokenVersion` embedded in the token and checked on every `requireAuth`-gated request — bumped on logout and on password change, so either one invalidates the token immediately rather than waiting out its expiry. This was a deliberate architecture trade-off, not a free change: `requireAuth` now does one DB read (`User.findOne(...).select("tokenVersion")`) per authenticated request, where it previously did zero. See [auth.md](./auth.md#signtoken-and-session-revocation).
- `Token` cookie's `httpOnly` flag differs between the email/password path (`false`) and the Google OAuth path (`true`) — see [auth.md](./auth.md#two-parallel-login-mechanisms-one-resulting-cookie-shape).
- `POST /auth/update` (password change) is unauthenticated — it trusts `{ email, oldPassword }` in the body rather than the caller's own session/token. Anyone who knows an account's email and current password can change it without being logged in as that account, which is a reasonable design if that's the intended UX (a locked-out user changing their password), but worth confirming it's intentional rather than a missed `requireAuth`.
- `POST /auth/update`'s wrong-old-password branch responds `401` with `STATUS_MESSAGE.USER_NOT_FOUND` — status code and message constant don't match; should likely be `INVALID_CREDENTIALS` or a dedicated message.
- Google OAuth's `state` param carries `userType` through the redirect round-trip but is never validated against what `googleInitiate` originally issued — no CSRF protection on this flow, despite `state` conventionally serving that purpose in OAuth.
- Every cookie this API sets hardcodes `secure: true; sameSite: "none"` — requires HTTPS everywhere, including local dev; testing the real cookie flow over plain `http://localhost` will silently fail to persist any cookie.
- `env.SECRET_KEY` is validated as required at startup but not read anywhere else in the codebase — likely vestigial.

## Users

- `config.hasCompletedProfile` defaults to `false` and nothing in this codebase ever sets it `true` — see contract break #4 above.
- `sanitize()` strips `_id` along with `password`/`__v` — the user object returned from signup/signin/dashboard has no id field at all; only `GET /user`'s `PUBLIC_FIELDS`-projected responses include `_id`. A frontend or future backend feature that needs a stable per-user id from a sanitized response has to use `email`/`userName` instead — there is currently no id in that shape.
- `userName` is not declared `unique: true` on the schema, only made unique in practice by `generateUniqueUsername`'s pre-check — a race between two concurrent signups could theoretically still collide.

## Events

- `createEvent`'s `uid`-uniqueness check is a plain existence query before `.save()`, not relying on the schema's own unique index to surface the friendlier `409 EVENT_UID_ALREADY_EXISTS` — a genuine race (two requests with the same `uid` in flight at once) would instead surface as the generic Mongo-11000 `409` from the global error handler.
- `platform`/`platformLink` are optional even when `mode === "Online"` — an online event can be created with no way for an attendee to actually join it; only `Offline` mode has a conditional-required-fields check (`city`/`state`/`country`/`address`/`mapIframe`).

## Products

- **`POST /product/cart/add`'s auth/ownership gap is fixed.** It used to identify whose cart to mutate purely by an `email` string in the request body — anyone who knew a user's email could push an arbitrary `productId` into that user's cart with no token, no session, nothing tying the caller to the account being modified. It's now `requireAuth`-gated and always mutates `req.auth.email`'s own cart; the body no longer has an `email` field at all. See [products.md](./products.md#post-productcartadd) and `tests/products.test.ts` for the regression test.
- `productId` in that same call is still never checked against the `Product` collection — a cart can reference ids that don't exist.
- No de-duplication and no remove/clear operation exist for the cart — `cart` can only ever grow, including duplicate entries for the same product.
- `POST /product/addproduct` has no auth either — any caller can create products. May be intentional pending an admin-role system that doesn't exist yet in this codebase.
- The `Product` model's registered name (`"Products"`, plural) is inconsistent with every other model in the codebase (`"user"`, `"Event"`, `"report"`, all singular) — no functional impact, just a naming inconsistency to match if you ever touch this.

## Payments

- No `Order`/`Payment` model — a Razorpay order is created but never persisted on this side, so there's no server-side record connecting an order to a user, product, or event, and no way to build "my order history" from this API alone.
- No webhook endpoint to receive Razorpay's payment-confirmation callback — this backend has no server-side way to know whether an order it minted was ever actually paid; whatever confirms success today is entirely client-side.
- Currency is hardcoded to `"INR"` throughout — no multi-currency support.

## Reports

- The 2-hour report-spam cooldown is per-email, not per-IP/session — trivially bypassed by using a different email each time. The IP-based `apiLimiter`/`authLimiter` (see [architecture.md](./architecture.md#middleware-stack-createapp-in-order)) are the only IP-level throttles in this API and aren't specific to this route.

## Build / config

- `env.IGNORE_ORIGINS` is read as the literal string `"true"` (not a real boolean) before being transformed — a `.env` value of anything else (including an actual unquoted `false`, or `1`) evaluates to `false` after the transform; only the exact string `"true"` enables it.
- Swagger's `@openapi` JSDoc blocks are hand-maintained next to each route and are not derived from (or checked against) the Zod validation schemas sitting right next to them in the same module — the two can silently drift; don't treat the `/docs` UI as authoritative over actually reading a module's `.validation.ts` file.

## Test coverage

`auth`, `events`, and `products` have test files (`tests/auth.test.ts`, `tests/events.test.ts`, `tests/products.test.ts`). `users`, `clubs`, `directory`, `payments`, and `reports` are completely untested — a change to any of them is only checked by `typecheck`/`lint`, not by CI-run behavioral tests, until coverage is added. See [architecture.md](./architecture.md#testing).

`apiLimiter`/`authLimiter` ([rate-limit.ts](../../src/middleware/rate-limit.ts)) are skipped when `NODE_ENV=test` — they weren't originally, and a test file making enough `/auth/*` calls across its whole suite (as `tests/auth.test.ts` does once its session-revocation tests were added) would start getting genuine `429`s partway through a run, unrelated to whatever behavior that test was actually checking. If you're ever debugging a mysteriously-failing test that looks like a state-leak between `it` blocks, check the response status/body before assuming it — a `429` disguised as a missing `Set-Cookie` header is exactly what this looked like before it was traced down.

## Keep this file honest

If you fix something this file calls out, remove that entry (and the matching note in the relevant module spec) in the same change. If a fix touches a cross-repo contract break, update the frontend's own specs too — see [api-contract.md](./api-contract.md#keeping-this-file-honest). If you notice something new and wrong while working nearby, add it here rather than leaving it undocumented.
