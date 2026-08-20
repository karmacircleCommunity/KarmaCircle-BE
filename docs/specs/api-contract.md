# API Contract — Backend Routes vs. What the Frontend Actually Calls

Every route this API exposes, cross-referenced against the frontend's endpoint constants (`KarmaCircle/src/services/ApiEndpoints.ts`) and call sites (`KarmaCircle/src/services/MilanApi.ts` and per-feature code). Read this before changing any route's path, method, or request/response shape — and before assuming a frontend call "just works" against this backend.

**Snapshot taken August 2026, from static reading of both repos — not verified by running either app end-to-end.** Treat every "works"/"broken" verdict below as a strong static-analysis claim, not a confirmed-live-tested fact; reproduce with a real request before shipping a fix that assumes one of these is correct.

**Update:** `GET /user`, `GET /clubs`, `GET /display/users`, `GET /display/clubs`, `GET /events`, and `GET /product/allproducts` (their unfiltered "list everything" branches only) now return `{ data, pagination }` instead of a bare array — see [known-issues.md#pagination](./known-issues.md#pagination) and [architecture.md#pagination](./architecture.md#pagination). This *was* verified live, via a Supertest assertion against a real (in-memory) Mongo, not just read from source — see `tests/events.test.ts`'s `"paginates across multiple pages with skip/limit math"` case.

## Full route inventory

| Method + path | Module | Auth | Frontend constant | Frontend actually calls it? |
|---|---|---|---|---|
| `GET /` | app.ts | no | — | no (liveness check only) |
| `GET /health` | app.ts | no | — | no |
| `GET /docs` | app.ts (swagger) | no | — | no |
| `POST /auth/signup` | auth | no | `authEndpoints.signup` | ✅ `RegisterUser()` |
| `POST /auth/signin` | auth | no | `authEndpoints.signin` | ✅ `LoginUser()` |
| `POST /auth/update` | auth | no (email+oldPassword in body) | — | ❌ no frontend constant/call exists for this route at all |
| `GET /auth/google` | auth | no | `authEndpoints.googleLogin` | ✅ `GoogleAuth()` |
| `GET /auth/google/callback` | auth | Passport | — | n/a (hit by Google's redirect, not called directly by frontend code) |
| `GET /auth/login/failed` | auth | no | — | n/a (redirect target, not called directly) |
| `GET /auth/login/success` | auth | requires `req.user` (see [auth.md](./auth.md#google-oauth-flow)) | `authEndpoints.googleLoginSuccess` | ✅ `successCallback()` — see contract break #3 below |
| `GET /auth/logout` | auth | no | `authEndpoints.logout` | ✅ `Logout()` |
| `GET /user` | users | no | `userEndpoints.details(userName)` | ✅ (per frontend spec, various profile-lookup call sites) |
| `POST /user/update` | users | `requireAuth` | `userEndpoints.updateProfile` | ✅ `updateUserProfile()` — **method mismatch, see contract break #1** |
| — (no route) | — | — | `userEndpoints.update` (`/user/update/profile`) | ❌ dead constant on the frontend side, no matching backend route either — consistent dead code both sides, not a break |
| — (no route) | — | — | `userEndpoints.profile` (`/user/profile`) | ✅ **called live** by `Dashboard.tsx`'s SWR hook — **route does not exist, see contract break #2** |
| — (no route) | — | — | `userEndpoints.completeProfile` (`/user/complete`, `PATCH`) | ✅ **called live** by `useProfileCompletion.ts`/`ProfileCompletion.tsx` — **route does not exist at all, see contract break #4** |
| `POST /user/report` | reports | no | `userEndpoints.report` | ✅ `ReportProblem()` |
| `GET /clubs` | clubs | no | `clubEndpoints.all`, `clubEndpoints.details(userName)` | ✅ `GetAllClubs()` (only from the unrouted `Donate.tsx` — see the pagination note above), and per frontend spec, `Profile.tsx`'s SWR key (single-item branch, unaffected by pagination) |
| `GET /clubs/dashboard` | clubs | `requireAuth` | `clubEndpoints.dashboard` | ✅ `fetchDashboard()` |
| — (no route) | — | — | `clubEndpoints.createEvent` (`/club/createevent`) | ❌ dead constant, no backend route either — consistent dead code both sides |
| `GET /display/users` | directory | no | — | ❌ no frontend constant exists for this route |
| `GET /display/clubs` | directory | no | — | ❌ no frontend constant exists for this route |
| `GET /events` | events | no | `eventEndpoints.all` | per frontend spec, not currently called by any live SWR/fetch (the fetcher exists — `getEvents()` — but the live `Events.tsx` page renders hardcoded data instead; see the frontend's own `known-issues.md`) |
| `POST /events/create` | events | `requireAuth` | `eventEndpoints.create` | ✅ `CreateEvent()` — method/path match; **body-shape correctness depends on which of the frontend's two competing "create event" components made the call, see [events.md](./events.md)** |
| `POST /payment/razorpay` | payments | no | — (no `paymentEndpoints` constant exists in `ApiEndpoints.ts`) | frontend's `PaymentGateway.ts` calls this URL directly, not through the `ApiEndpoints.ts` registry — see the frontend's own `donate-shop-trending.md`/`SPEC.md` for the exact call site and its own separate response-shape bug (`data.currency`/`data.id` vs. this route's actual `{id, currency, amount}` wrapped in axios's `response.data`) |
| `POST /product/addproduct` | products | no | — | no `productEndpoints` constant exists on the frontend at all — the frontend's Shop/product pages are "coming soon" placeholders per its own spec, so this whole module currently has no frontend consumer |
| `GET /product/allproducts` | products | no | — | same as above — no consumer yet |
| `POST /product/cart/add` | products | `requireAuth` (was unauthenticated — see [known-issues.md#products](./known-issues.md#products)) | — | same as above — no consumer yet |
| `GET /product/:productSlug` | products | no | — | same as above — no consumer yet |

## Contract breaks (highest severity first)

### 1. `POST /user/update` vs. the frontend's `PATCH` call — **method mismatch, breaks the live profile-update flow**

The frontend's `updateUserProfile()` ([MilanApi.ts](../../../KarmaCircle/src/services/MilanApi.ts)) issues `Axios.patch(userEndpoints.updateProfile, credentials, { withCredentials: true })` — an HTTP `PATCH`. This backend registers the handler as `router.post("/update", ...)` ([user.routes.ts](../../src/modules/users/user.routes.ts)) — Express only matches the declared method, so a `PATCH` to `/user/update` does not hit this handler at all; it falls through to `notFoundHandler` (`404`), not the intended controller. Per the frontend's own spec, `updateProfile` is the one profile-update path both `ProfileCompletion.tsx` and `ProfileUpdate.tsx` (its two, largely duplicate profile-edit modals) actually call in production — **this means the live "edit my profile" feature does not currently work against this backend**, independent of the body-shape issue in #1b below. Fix by either changing this route to `router.patch("/update", ...)` (matches REST convention for a partial update, and requires no frontend change) or changing the frontend to `Axios.post(...)` — coordinate the choice with whoever owns the frontend change, and update both `docs/specs/` trees in the same change either way.

### 1b. `POST /user/update`'s body shape doesn't match the `User.address` schema

Independent of the method mismatch above: `updateProfileSchema` validates `{ tagLine?, description?, city?, state?, address?, country?, pincode? }` as flat top-level strings. `IUser.address` is a **nested object** (`{ line1, line2, city, state, country, pincode }`), and `tagLine`/top-level `city`/`state`/`country`/`pincode` don't exist on the `User` schema at all. See [users.md](./users.md#post-userupdate--the-authenticated-users-own-profile-update) for the full field-by-field trace of what Mongoose actually does with each field in this shape. Fixing #1 alone (the HTTP method) is not sufficient to make this endpoint behave as either side's code currently assumes — the request/response contract itself needs to be re-agreed (either the backend's `address` field flattens to match what the frontend sends, or the frontend switches to sending a nested `address` object, or a documented mapping layer is added on one side).

### 2. `GET /user/profile` — **called live by `Dashboard.tsx`, route does not exist**

The frontend's `Dashboard.tsx` (per its own `api-integration.md`) calls `useSWR(userEndpoints.profile, fetcher)`, i.e. `GET /user/profile`. No route matching `/user/profile` exists anywhere in `src/routes/index.ts` or `user.routes.ts` — the closest is `GET /user` (which requires a `?userName=` query param to look up a specific user, or returns all individuals with none) and `GET /clubs/dashboard` (which is the route that actually returns "my own dashboard data" for an authenticated caller — see [clubs.md](./clubs.md#get-clubsdashboard)). This SWR call, as currently wired on the frontend, will 404 every time it runs. Whoever owns this needs to decide: should `Dashboard.tsx` be pointed at `clubEndpoints.dashboard` instead (which already works, and is what `fetchDashboard()`/`TrackSection.tsx` separately call), or should this backend grow a real `/user/profile` route? Do not "fix" this by adding a `/user/profile` route that just duplicates `/clubs/dashboard` without first confirming which behavior the frontend actually wants.

### 3. `GET /auth/login/success` — likely unreachable via `req.user` in real cross-browser OAuth traffic

See [auth.md](./auth.md#google-oauth-flow) for the full trace. In short: this route's controller (`authController.loginSuccess`) requires `req.user` to already be populated by Passport, but by the time the frontend calls this route (a separate request, after the OAuth redirect round-trip already completed and responded), there is no session store or other mechanism in this codebase that would carry Passport's `req.user` forward into a new request. This needs to be verified by actually exercising the Google OAuth flow end-to-end (not just read from the source) before treating it as confirmed-broken — but if confirmed, it means Google OAuth login currently cannot complete on this backend as wired, despite `googleInitiate`/`googleCallback` both working correctly up to the redirect.

### 4. `PATCH /user/complete` — **called live by the profile-completion flow, no matching route exists at all**

The frontend's `completeProfileApiCall()` ([MilanApi.ts](../../../KarmaCircle/src/services/MilanApi.ts)) calls `Axios.patch(userEndpoints.completeProfile, credentials, { withCredentials: true })`, i.e. `PATCH /user/complete`. There is no `/complete` route in `user.routes.ts`, and no equivalent anywhere else in this API. This is called from `ProfileCompletion.tsx`/`useProfileCompletion.ts` — per the frontend's own spec, this is the modal shown to a newly-signed-up user to fill in their profile before `config.hasCompletedProfile` (see [users.md](./users.md#the-user-model-is-shared-by-five-modules)) would presumably flip to `true`. **This backend has no code path that ever sets `hasCompletedProfile: true`** — the field exists on the schema (defaulting to `false`) but nothing writes to it. If this feature is meant to work, this backend needs a new route (likely `PATCH /user/complete`, to match what the frontend already calls) whose service layer both accepts the profile fields and flips that flag.

## Endpoints with no frontend caller yet

`GET /display/users`, `GET /display/clubs` (directory module), and the entire `products` module (`/product/*`) have no corresponding call anywhere in the frontend's `ApiEndpoints.ts`/`MilanApi.ts`. This isn't necessarily a bug — the frontend's Shop/Trending pages are explicitly "coming soon" placeholders per its own spec — but it means these routes are currently untested by any real client traffic pattern; if you change their contract, there's no frontend code that would visibly break to catch a regression, only this doc and (for `products`) whatever new frontend work eventually lands.

## Keeping this file honest

If you fix one of the contract breaks above (on either side of the repo boundary), update **both** repos' specs in the same change: this file plus the relevant module file here, and the frontend's own `docs/specs/api-integration.md` plus its `known-issues.md` entry if one exists for the same issue. A contract break fixed on only one side, with the other side's spec still describing the old broken behavior, is worse than not documenting it at all — the next agent will trust the stale doc.
