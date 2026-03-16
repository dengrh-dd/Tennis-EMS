# Tennis EMS – Frontend Progress Log
## Scope: Vite + React Router + Authentication Entry Flow (Frontend)

> **Purpose of this log**
> - This file is the **single source of truth** for the current *frontend-layer* implementation.
> - In future chats, this log can be shared instead of pasting code so the current frontend status is immediately clear.
> - It records:
>   - Which frontend modules and pages currently exist
>   - What routing structure has been set up
>   - How login-state recovery currently works
>   - Which backend endpoints are already connected

---

# 1) Current Frontend Stack

## 1.1 Tooling
- **Frontend framework:** React
- **Build tool / dev server:** Vite
- **Language:** TypeScript
- **Routing library:** `react-router-dom`

## 1.2 Project Location
Recommended local structure:
- Parent folder contains both backend and frontend projects side by side.
- Current naming convention used by the user:
  - `Tennis_EMS_Backend` → Spring Boot backend
  - `Tennis_EMS_Frontend` → Vite React frontend

---

# 2) Current Frontend Goal Achieved

The frontend currently supports the following end-to-end flow structure:

1. Open the frontend app
2. Visit `/`
3. Frontend checks current login state using backend `/auth/me`
4. If not logged in → redirect to `/login`
5. Login page can submit credentials to `/auth/login`
6. On successful login, frontend uses returned `role` to decide which role portal to enter:
   - `ADMIN` → `/admin`
   - `COACH` → `/coach`
   - `STUDENT` → `/student`
7. Role-specific pages currently exist as minimal placeholder pages

> Note: At the current point in development, the full login chain is structurally connected. The latest blocker observed is **test password hash mismatch in database seed data**, not frontend routing.

---

# 3) Current Directory / File Structure

## 3.1 Core Structure under `src`
- `src/App.tsx`
- `src/auth/types.ts`
- `src/auth/authApi.ts`
- `src/auth/AuthGate.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/AdminHome.tsx`
- `src/pages/CoachHome.tsx`
- `src/pages/StudentHome.tsx`

---

# 4) Routing Structure

## 4.1 Active Routes
The current frontend routing structure is:

- `/` → `AuthGate`
- `/login` → `LoginPage`
- `/admin` → `AdminHome`
- `/coach` → `CoachHome`
- `/student` → `StudentHome`

## 4.2 Routing Intent
- `/` acts as the unified application entry point.
- The route does not render a permanent page of its own.
- Instead, it checks session-based login state and redirects the user.

---

# 5) Current Authentication Integration

## 5.1 Backend Endpoints Already Used
The frontend is currently designed to integrate with these backend endpoints:

- `POST /auth/login`
- `GET /auth/me`

## 5.2 Authentication Mode
- Backend auth mode is **session-based** (`HttpSession`)
- Frontend requests include credentials using:
  - `credentials: 'include'`

This is necessary so the browser sends the session cookie back to the backend.

---

# 6) Current Auth Module

## 6.1 `types.ts`
Defines the frontend auth-related types.

### Current Types
- `Role`
  - `'ADMIN' | 'COACH' | 'STUDENT'`
- `CurrentUser`
  - `userId`
  - `email`
  - `role`
  - `profileId`
  - `displayName`

### Purpose
- Give the frontend a typed representation of what `/auth/login` and `/auth/me` return.
- Make role-based routing safer and clearer.

---

## 6.2 `authApi.ts`
Encapsulates frontend calls to backend auth endpoints.

### Current Functions
- `me(): Promise<CurrentUser>`
  - Calls `GET /auth/me`
  - Used to restore login state after page refresh or first app load
  - Throws if not logged in

- `login(email: string, password: string): Promise<CurrentUser>`
  - Calls `POST /auth/login`
  - Sends JSON body `{ email, password }`
  - Uses returned role to determine where to navigate next

### Current Behavior
- Uses `fetch`
- Includes `credentials: 'include'`
- Treats non-OK responses as login/auth failures

---

## 6.3 `AuthGate.tsx`
This is the frontend entry gate for authentication recovery.

### Responsibility
- Runs when user visits `/`
- Immediately calls `me()`
- Redirect behavior:
  - if logged in and role = `ADMIN` → `/admin`
  - if logged in and role = `COACH` → `/coach`
  - if logged in and role = `STUDENT` → `/student`
  - if not logged in → `/login`

### Purpose
- Solve the “refresh problem” on the frontend
- Frontend memory is lost on refresh, but backend session still exists
- `AuthGate` restores the user’s identity by asking backend `/auth/me`

---

# 7) Current Pages

## 7.1 `LoginPage.tsx`
### Responsibility
- Render login form
- Capture `email` and `password`
- Submit credentials to backend via `login(...)`
- Navigate based on returned role

### Current Local State
- `email`
- `password`
- `loading`
- `errorMsg`

### Current Redirect Rules
- `ADMIN` → `/admin`
- `COACH` → `/coach`
- `STUDENT` → `/student`

### Current Status
- Page exists and is connected to backend login call
- Latest observed failure was backend password mismatch rather than frontend logic failure

---

## 7.2 `AdminHome.tsx`
### Responsibility
- Minimal placeholder page for admin portal

### Current UI
- Displays simple text indicating admin page

---

## 7.3 `CoachHome.tsx`
### Responsibility
- Minimal placeholder page for coach portal

### Current UI
- Displays simple text indicating coach page

---

## 7.4 `StudentHome.tsx`
### Responsibility
- Minimal placeholder page for student portal

### Current UI
- Displays simple text indicating student page

---

# 8) Current Dev Server / Proxy Setup

## 8.1 Vite Proxy
The Vite dev server is configured to proxy backend requests.

### Current Proxy Targets
- `/auth` → `http://localhost:8080`
- `/api` → `http://localhost:8080`

## 8.2 Purpose
- Keep frontend requests written as relative paths like `/auth/me`
- Forward them to Spring Boot backend automatically during development
- Simplify local development for session-based authentication

---

# 9) What Has Been Verified So Far

## 9.1 Verified Frontend Capabilities
The following have already been verified:
- Vite project creation succeeded
- Dev server starts correctly on `http://localhost:5173`
- React Router works
- `/login`, `/admin`, `/coach`, `/student` routes render correctly
- `/` successfully routes through `AuthGate`
- Visiting `/` while not logged in redirects to `/login`
- Frontend can successfully reach backend `/auth/login`
- Backend returns structured auth error responses to frontend

## 9.2 Current Integration Conclusion
The login chain is mostly operational end-to-end.
The last observed blocker is:
- database seed password hashes do not match backend BCrypt password verification

This means the major frontend architecture is already functioning.

---

# 10) Architecture Decisions (Frontend)

- Use **role-based routing** instead of backend-provided landing paths.
- Use `/auth/me` to restore identity after refresh.
- Keep redirect logic in frontend routing layer rather than creating a dedicated backend Home endpoint.
- Use session cookie auth with `credentials: 'include'`.
- Keep current role pages minimal until business modules are expanded.

---

# 11) Next Steps

## Immediate Next Steps
- Fix backend/database test password hash so login succeeds
- Verify successful redirects for all three roles:
  - ADMIN → `/admin`
  - COACH → `/coach`
  - STUDENT → `/student`
- Verify refresh behavior after successful login

## Near-Term Frontend Expansion
- Add logout button / logout flow
- Add route protection component (e.g. `RoleGuard`) if role-specific direct route protection is needed
- Introduce shared layout for each role:
  - `AdminLayout`
  - `CoachLayout`
  - `StudentLayout`
- Create navigation/sidebar structure
- Start real business pages under each role area

## Longer-Term Frontend Expansion
- Add global auth state store/context
- Add error display improvements for backend `ErrorResponseDTO`
- Add API layer abstraction for other business modules
- Add page styling / design system

---

## How to use this log in the next chat
Upload/paste this file and say:
**"Continue from this frontend log"**.
