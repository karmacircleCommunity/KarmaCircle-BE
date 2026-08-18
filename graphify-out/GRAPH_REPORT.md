# Graph Report - /Users/tamalcodes/Gh/KarmaCircle-BE  (2026-08-19)

## Corpus Check
- Corpus is ~21,205 words - fits in a single context window. You may not need a graph.

## Summary
- 162 nodes · 141 edges · 52 communities detected
- Extraction: 72% EXTRACTED · 28% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Auth Service Logic|Auth Service Logic]]
- [[_COMMUNITY_Code of Conduct|Code of Conduct]]
- [[_COMMUNITY_Contributor Onboarding|Contributor Onboarding]]
- [[_COMMUNITY_Club & User Controllers|Club & User Controllers]]
- [[_COMMUNITY_App Bootstrap & Server|App Bootstrap & Server]]
- [[_COMMUNITY_Directory & Event Listing|Directory & Event Listing]]
- [[_COMMUNITY_Product Catalog & Cart|Product Catalog & Cart]]
- [[_COMMUNITY_Auth Controller & OAuth|Auth Controller & OAuth]]
- [[_COMMUNITY_PR & Commit Workflow|PR & Commit Workflow]]
- [[_COMMUNITY_Milan Brand & Landing|Milan Brand & Landing]]
- [[_COMMUNITY_Error Handling|Error Handling]]
- [[_COMMUNITY_Report Creation|Report Creation]]
- [[_COMMUNITY_Env & API Key Setup|Env & API Key Setup]]
- [[_COMMUNITY_Event Test Helper|Event Test Helper]]
- [[_COMMUNITY_Request Validation Middleware|Request Validation Middleware]]
- [[_COMMUNITY_Auth Guard Middleware|Auth Guard Middleware]]
- [[_COMMUNITY_Env Loader|Env Loader]]
- [[_COMMUNITY_Async Handler Wrapper|Async Handler Wrapper]]
- [[_COMMUNITY_Payment Order Service|Payment Order Service]]
- [[_COMMUNITY_Payment Order Controller|Payment Order Controller]]
- [[_COMMUNITY_Setup Docs Wrap-up|Setup Docs Wrap-up]]
- [[_COMMUNITY_Jest Config|Jest Config]]
- [[_COMMUNITY_Commitlint Config|Commitlint Config]]
- [[_COMMUNITY_Auth Test Suite|Auth Test Suite]]
- [[_COMMUNITY_Test Env Setup|Test Env Setup]]
- [[_COMMUNITY_Jest Setup|Jest Setup]]
- [[_COMMUNITY_Rate Limiting|Rate Limiting]]
- [[_COMMUNITY_Express Type Augmentation|Express Type Augmentation]]
- [[_COMMUNITY_Logger|Logger]]
- [[_COMMUNITY_Passport Strategy Config|Passport Strategy Config]]
- [[_COMMUNITY_Swagger Docs Config|Swagger Docs Config]]
- [[_COMMUNITY_HTTP Status Constants|HTTP Status Constants]]
- [[_COMMUNITY_Payment Routes|Payment Routes]]
- [[_COMMUNITY_Payment Validation|Payment Validation]]
- [[_COMMUNITY_Club Routes|Club Routes]]
- [[_COMMUNITY_Club Validation|Club Validation]]
- [[_COMMUNITY_Product Routes|Product Routes]]
- [[_COMMUNITY_Product Validation|Product Validation]]
- [[_COMMUNITY_Product Model|Product Model]]
- [[_COMMUNITY_Auth Validation|Auth Validation]]
- [[_COMMUNITY_Auth Routes|Auth Routes]]
- [[_COMMUNITY_Directory Routes|Directory Routes]]
- [[_COMMUNITY_User Model|User Model]]
- [[_COMMUNITY_User Routes|User Routes]]
- [[_COMMUNITY_User Validation|User Validation]]
- [[_COMMUNITY_Event Model|Event Model]]
- [[_COMMUNITY_Event Routes|Event Routes]]
- [[_COMMUNITY_Event Validation|Event Validation]]
- [[_COMMUNITY_Report Model|Report Model]]
- [[_COMMUNITY_Report Validation|Report Validation]]
- [[_COMMUNITY_Report Routes|Report Routes]]
- [[_COMMUNITY_Entry Point|Entry Point]]

## God Nodes (most connected - your core abstractions)
1. `findByEmail()` - 7 edges
2. `loginSuccess()` - 6 edges
3. `signup()` - 5 edges
4. `sanitize()` - 5 edges
5. `Contributing to Milan` - 5 edges
6. `signToken()` - 4 edges
7. `signin()` - 4 edges
8. `readableCookieOptions()` - 4 edges
9. `findAll()` - 4 edges
10. `Reporting Guidelines` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Backend Tech Stack` --semantically_similar_to--> `Techstack Overview`  [INFERRED] [semantically similar]
  README.md → docs/BackendSetup.md
- `MIT License Notice` --semantically_similar_to--> `License and Attribution`  [INFERRED] [semantically similar]
  README.md → CODE_OF_CONDUCT.md
- `Reporting a Vulnerability` --semantically_similar_to--> `Reporting Guidelines`  [INFERRED] [semantically similar]
  SECURITY.md → CODE_OF_CONDUCT.md
- `Reporting a Vulnerability` --semantically_similar_to--> `Creating an Issue`  [INFERRED] [semantically similar]
  SECURITY.md → CONTRIBUTING.md
- `buildTestApp()` --calls--> `createApp()`  [INFERRED]
  tests/helpers/test-app.ts → src/app.ts

## Hyperedges (group relationships)
- **Pull Request Contribution Workflow** — contributing_creating_issue, contributing_working_on_issue, contributing_closing_issue, contributing_creating_pr, contributing_pr_title_format, contributing_reviewing_pr [EXTRACTED 0.90]
- **Local Project Setup Flow** — clonesetup_forking, clonesetup_cloning, backendsetup_installing_dependencies, backendsetup_env_setup [EXTRACTED 0.85]
- **Environment Secrets Configuration** — backendsetup_env_setup, backendsetup_google_client_setup, backendsetup_razorpay_setup [EXTRACTED 0.85]

## Communities

### Community 0 - "Auth Service Logic"
Cohesion: 0.23
Nodes (13): loginSuccess(), logout(), clearedCookieOptions(), httpOnlyCookieOptions(), findOrCreateGoogleUser(), signin(), signToken(), signup() (+5 more)

### Community 1 - "Code of Conduct"
Cohesion: 0.15
Nodes (13): Addressing Grievances, Consequences of Unacceptable Behavior, Contact Info, Expected Behavior, JWOC Code of Conduct Purpose, Open Source Citizenship Goal, Reporting Guidelines, Code of Conduct Scope (+5 more)

### Community 2 - "Contributor Onboarding"
Cohesion: 0.18
Nodes (13): Installing Dependencies, Techstack Overview, Cloning the Repository, Forking the Repository, Clone Setup Next Steps, Django Code of Conduct, Geek Feminism Anti-Harassment Policy, License and Attribution (+5 more)

### Community 3 - "Club & User Controllers"
Cohesion: 0.2
Nodes (6): listClubs(), listClubs(), listUsers(), findByType(), findByUsername(), findIndividuals()

### Community 4 - "App Bootstrap & Server"
Cohesion: 0.2
Nodes (5): createApp(), connectToMongo(), handler(), main(), buildTestApp()

### Community 5 - "Directory & Event Listing"
Cohesion: 0.22
Nodes (6): listAllUsers(), listEvents(), createEvent(), findAll(), findByUid(), listProducts()

### Community 6 - "Product Catalog & Cart"
Cohesion: 0.22
Nodes (2): getProduct(), findBySlug()

### Community 7 - "Auth Controller & OAuth"
Cohesion: 0.29
Nodes (3): signin(), signup(), readableCookieOptions()

### Community 8 - "PR & Commit Workflow"
Cohesion: 0.33
Nodes (6): Closing an Issue, Commit Message Format, Creating a Pull Request, ESLint and Prettier Pre-commit Hooks, Pull Request Title Format, Reviewing a Pull Request

### Community 9 - "Milan Brand & Landing"
Cohesion: 0.4
Nodes (6): Charity/NGO Collaboration Hub Purpose, Milan Landing Page (Desktop Mockup), Milan Platform, Milan Mobile Web View (milanhub.org), Milan Promotional Banner, Tagline: 'United, We Achieve Greatness'

### Community 10 - "Error Handling"
Cohesion: 0.4
Nodes (1): AppError

### Community 11 - "Report Creation"
Cohesion: 0.4
Nodes (2): createReport(), hasReportedRecently()

### Community 12 - "Env & API Key Setup"
Cohesion: 1.0
Nodes (3): Setting up .env, Setting up Google Client ID and Secret, Setting up Razorpay API Key

### Community 13 - "Event Test Helper"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Request Validation Middleware"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Auth Guard Middleware"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Env Loader"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Async Handler Wrapper"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Payment Order Service"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Payment Order Controller"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Setup Docs Wrap-up"
Cohesion: 1.0
Nodes (2): Coding Standards, Backend Setup Next Steps

### Community 21 - "Jest Config"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Commitlint Config"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Auth Test Suite"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Test Env Setup"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Jest Setup"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Rate Limiting"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Express Type Augmentation"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Logger"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Passport Strategy Config"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Swagger Docs Config"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "HTTP Status Constants"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Payment Routes"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Payment Validation"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Club Routes"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Club Validation"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Product Routes"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Product Validation"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Product Model"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Auth Validation"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Auth Routes"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Directory Routes"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "User Model"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "User Routes"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "User Validation"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Event Model"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Event Routes"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Event Validation"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Report Model"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Report Validation"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Report Routes"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Entry Point"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **15 isolated node(s):** `Milan Project Overview`, `JWOC Code of Conduct Purpose`, `Weapons Policy`, `Code of Conduct Scope`, `Contact Info` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Event Test Helper`** (2 nodes): `signupAndGetCookie()`, `events.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Request Validation Middleware`** (2 nodes): `validate.ts`, `validate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Guard Middleware`** (2 nodes): `requireAuth()`, `auth.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Env Loader`** (2 nodes): `loadEnv()`, `env.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Async Handler Wrapper`** (2 nodes): `asyncHandler()`, `async-handler.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Payment Order Service`** (2 nodes): `createOrder()`, `payment.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Payment Order Controller`** (2 nodes): `createOrder()`, `payment.controller.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Setup Docs Wrap-up`** (2 nodes): `Coding Standards`, `Backend Setup Next Steps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Jest Config`** (1 nodes): `jest.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Commitlint Config`** (1 nodes): `commitlint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Test Suite`** (1 nodes): `auth.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Test Env Setup`** (1 nodes): `env.setup.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Jest Setup`** (1 nodes): `jest.setup.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Rate Limiting`** (1 nodes): `rate-limit.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Express Type Augmentation`** (1 nodes): `express.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Logger`** (1 nodes): `logger.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Passport Strategy Config`** (1 nodes): `passport.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Swagger Docs Config`** (1 nodes): `swagger.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `HTTP Status Constants`** (1 nodes): `http-status.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Payment Routes`** (1 nodes): `payment.routes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Payment Validation`** (1 nodes): `payment.validation.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Club Routes`** (1 nodes): `club.routes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Club Validation`** (1 nodes): `club.validation.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Routes`** (1 nodes): `product.routes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Validation`** (1 nodes): `product.validation.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Model`** (1 nodes): `product.model.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Validation`** (1 nodes): `auth.validation.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Routes`** (1 nodes): `auth.routes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Directory Routes`** (1 nodes): `directory.routes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Model`** (1 nodes): `user.model.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Routes`** (1 nodes): `user.routes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Validation`** (1 nodes): `user.validation.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Event Model`** (1 nodes): `event.model.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Event Routes`** (1 nodes): `event.routes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Event Validation`** (1 nodes): `event.validation.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Report Model`** (1 nodes): `report.model.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Report Validation`** (1 nodes): `report.validation.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Report Routes`** (1 nodes): `report.routes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Entry Point`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `findByEmail()` connect `Auth Service Logic` to `Club & User Controllers`, `Directory & Event Listing`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `createEvent()` connect `Directory & Event Listing` to `Auth Service Logic`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `findByEmail()` (e.g. with `dashboard()` and `signup()`) actually correct?**
  _`findByEmail()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `loginSuccess()` (e.g. with `signToken()` and `sanitize()`) actually correct?**
  _`loginSuccess()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `signup()` (e.g. with `findByEmail()` and `generateUniqueUsername()`) actually correct?**
  _`signup()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `sanitize()` (e.g. with `dashboard()` and `loginSuccess()`) actually correct?**
  _`sanitize()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Milan Project Overview`, `JWOC Code of Conduct Purpose`, `Weapons Policy` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._