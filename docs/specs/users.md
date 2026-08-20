# Users Module

[src/modules/users/](../../src/modules/users/) — look up a user by username (or list all individuals), and let the authenticated user update their own profile. Owns the `User` Mongoose model, which is also the backing store for `clubs`, `directory`, `auth`, `events` (host lookup), and `products` (cart writes).

## The `User` model is shared by five modules

[user.model.ts](../../src/modules/users/user.model.ts) — one physical collection (`model<IUser>("user", ...)`) holds **both individuals and clubs**, split at the schema level via a Mongoose discriminator keyed on `userType` (`discriminatorKey: "userType"`). `Individual` and `Club` are exported discriminator models off the same base `User` model/collection — both currently add no extra fields (there's no club-only data yet), but it's the home for that once it exists, instead of it landing loosely on the shared base schema. The field itself stays an unconstrained `string` at the base-schema level (not a Mongoose `enum:` constraint — see the comment in the source explaining this is deliberate, so pre-existing rows with other/missing values don't fail schema validation); it's the discriminator models, not the field type, that give `"individual"`/`"club"` their real structure now. Construct a new user document via `getUserModel(userType)` (also exported from `user.model.ts`) rather than `new User(...)` directly — it resolves to `Club` only for exactly `"club"`, defaulting to `Individual` otherwise, and both `auth.service.ts` construction sites (`signup`, `findOrCreateGoogleUser`) go through it.

| Field | Type | Notes |
|---|---|---|
| `userType` | `string?`, indexed | `"individual"` \| `"club"` in practice, unenforced. Indexed (plain, not unique) since `findByType`/`findIndividuals` filter on it — backs `clubs`, `directory`, and the unfiltered branch of `GET /user` |
| `userName` | `string` (required), indexed | Unique in practice (see `generateUniqueUsername` below) but **not** declared `unique: true` on the schema — a race between two concurrent signups reading "is this taken?" then writing could still produce a duplicate; low likelihood, not impossible. The index (added alongside pagination/indexing work) only speeds up lookups by `userName` — it's deliberately a plain index, not unique, so it can't fail to build even if duplicates already exist in a live deployment; closing the race itself would need a separate, coordinated migration |
| `name` | `string?` | |
| `email` | `string` (required, `unique: true`) | The de facto identity field — see [auth.md](./auth.md) for how the JWT encodes it |
| `phone` | `string?` | |
| `profilePicture` / `bannerPicture` | `string?` | URLs, presumably; nothing in this repo uploads/hosts images — that's out of scope for this API today |
| `password` | `string` (required) | bcrypt hash; **never** returned by `sanitize()` (see below) |
| `description` | `string?` | |
| `address` | `{ line1?, line2?, city?, state?, country?, pincode? }` | A **nested object**, not a flat string — see the profile-update mismatch below |
| `config.hasCompletedProfile` | `boolean`, default `false` | Set at creation-time only; **nothing in this codebase ever sets it to `true`** — see [known-issues.md](./known-issues.md#users) |
| `cart` | `{ id: string }[]` | Written to by `products.addToCart` ([products.md](./products.md)) — no other cart mutation (remove/clear) exists anywhere |
| `tokenVersion` | `number`, default `0` | Session-revocation counter — bumped on logout/password-change, checked on every `requireAuth`-gated request. Never returned to a client (excluded from `PUBLIC_FIELDS` and `sanitize()`, same as `password`). See [auth.md](./auth.md#signtoken-and-session-revocation) |

Modules touching `User` directly: `users` (this file), `auth` (create/find/update for login+signup), `clubs` (find, filtered by `userType`), `directory` (find, unfiltered), `events` (read-only, to resolve a host's name/username), `products` (push into `cart`).

## `user.service.ts`

- **`generateUniqueUsername(email)`** — starts from the local part of the email (`email.split("@")[0]`), and while a `User` with that `userName` already exists, appends a random 0–9999 suffix and retries. Unbounded loop (no max-attempt cap) — in the extremely unlikely case of sustained collisions this could loop for a while, but with a 0–9999 random suffix space this is not a realistic concern in practice.
- **`findByEmail` / `findByUsername` / `findIndividuals` / `findAll` / `findByType`** — thin `User.find*` wrappers. All but `findByEmail` project with `PUBLIC_FIELDS = "-password -__v"` (excludes the hash and Mongoose's version key, but **does not exclude `_id`** — see `sanitize()` below for the one place `_id` is stripped too). `findByEmail` is used internally by `auth`/services that need the raw document (including `password`) to verify credentials, so it intentionally returns everything.
- **`updateProfile(email, data)`** — `User.findOneAndUpdate({ email }, { $set: data }, { new: true })`, projected through `PUBLIC_FIELDS`. `data` is whatever `updateProfileSchema` validated — see the mismatch below.
- **`sanitize(user)`** — `user.toObject()` then destructures off `password`, `_id`, `__v`, returning the rest. This is the shape sent back to the client on signup/signin/dashboard/etc. Note it strips `_id` entirely — **the sanitized user object the frontend receives has no id field at all**, only `userName`/`email`/etc.; anything that needs to reference "this user" by a stable id has to use `email` or `userName` instead.

## `GET /user`

No auth. `validate(listUsersQuerySchema, "query")` — `{ userName?: string, page?: number, limit?: number }` (`page`/`limit` merged in from the shared `paginationQuerySchema`, [src/utils/pagination.ts](../../src/utils/pagination.ts) — default `page=1`, `limit=20`, `limit` capped at 100). If `userName` is present: `findByUsername` → `404 NOT_FOUND` if none, else the single user object (through `PUBLIC_FIELDS`, so `_id` **is** present here, unlike the `sanitize()`-shaped responses elsewhere — a real shape difference between "look someone up" and "signup/signin/dashboard" responses); `page`/`limit` are accepted but ignored on this branch. If `userName` is absent: returns every `userType: "individual"` user as `{ data: IUser[], pagination: { page, limit, total, totalPages } }` — `userService.findIndividuals({ skip, limit })` runs the `find` and a `countDocuments` in parallel via `Promise.all`.

## `POST /user/update` — the authenticated user's own profile update

`requireAuth` → `validate(updateProfileSchema)` → `userController.updateProfile`. Body (`updateProfileSchema`, all optional): `{ tagLine?, description?, city?, state?, address?, country?, pincode? }` — **every one of these is a flat top-level string field**, whereas `IUser.address` is a nested object (`{ line1, line2, city, state, country, pincode }`) and `tagLine` doesn't exist anywhere on the `User` schema at all.

What actually happens on `$set: data` with this shape: Mongoose's default `strict: true` means any key not declared on the schema (`tagLine`) is **silently dropped**, no error. `description` (declared as a top-level `string` on the schema) sets correctly. `city`/`state`/`country`/`pincode` are **not** top-level schema fields (they only exist nested under `address`) — same silent-drop fate as `tagLine`. `address` **is** a top-level schema field, but declared as a nested object — `$set: { address: "some flat string" }` gets cast against that nested schema; Mongoose will attempt to coerce or reject it, most likely surfacing as a `mongoose.Error.ValidationError` (→ `400` via the global error handler) rather than silently corrupting the field, but this needs verification by actually calling the route with a realistic payload (per the "reproduce like an end user" rule) rather than assumed from reading the schema alone.

**Net effect: calling this route with the exact body shape the frontend's live `ProfileUpdate`/`ProfileCompletion` forms send (per the frontend's own spec) does not update the fields a user would expect, and the `description`-only subset of the payload is likely the only part that reliably lands.** This is the single most important cross-repo mismatch to understand before touching either side's profile-update code — see [known-issues.md](./known-issues.md#users) and [api-contract.md](./api-contract.md#post-userupdate) for the full frontend-vs-backend comparison, including the separate HTTP-method mismatch (frontend sends `PATCH`, this route only accepts `POST`).

## What's known-broken here

See [known-issues.md](./known-issues.md#users). In short: `config.hasCompletedProfile` can never become `true` through this API (there's no "complete profile" endpoint at all, despite the frontend having a whole feature built around one — `PATCH /user/complete` does not exist here), and the one profile-update route that does exist has a body-shape and HTTP-method mismatch against the only frontend code that calls it.
