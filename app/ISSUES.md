# Issues & Technical Debt Tracker

**Last Updated:** February 3, 2026  
**Project:** bratstvousa SvelteKit Application

---

## P0 - CRITICAL (Blocking Development)

### 1. Cannot View Site Without Database/API Running - RESOLVED ✅

- **Status:** RESOLVED as of Feb 3, 2026
- **Resolution:** Mock database system implemented in `src/lib/server/db/mock-db.ts`
- **Impact:** Site can now run without PostgreSQL using `USE_MOCK_DB=true`
- **See:** MOCK_DATABASE.md for details

---

## P1 - CRITICAL (Security & Stability)

### 2. Insufficient Test Coverage

- **Status:** Critical
- **Current State:**
  - Only 1 trivial unit test (src/demo.spec.ts)
  - Only 1 trivial e2e test (e2e/demo.test.ts)
  - No tests for authentication, forms, or business logic
- **Risk:** Critical bugs in auth, payments, registrations won't be caught
- **Solution:**
  - Add unit tests for $lib/server/auth.ts (session management)
  - Add unit tests for form validation functions
  - Add e2e tests for registration flows
  - Add e2e tests for login/logout flow
  - Test database queries with mock data
- **Target Coverage:** 70% for critical paths
- **Estimated Effort:** 12-16 hours

### 3. Console.log Statements in Production Code

- **Status:** Critical
- **Count:** 16 console.log statements found
- **Locations:**
  - src/routes/[ministry]/north-west-youth-camp-2025/registration/+page.server.ts (lines 16, 23, 47, 50, 54, 76, 77)
  - Other routes and components
- **Risk:**
  - Performance overhead
  - Potential security leaks (sensitive data in logs)
  - Unprofessional in production
- **Solution:**
  - Remove all console.log statements
  - Implement proper logging library (pino, winston)
  - Add environment-aware logging
- **Estimated Effort:** 2 hours

### 4. Weak Password Requirements

- **Status:** Critical Security Issue
- **Location:** src/routes/demo/lucia/login/+page.server.ts:103-104
- **Current:** Only 6 character minimum, no complexity requirements
- **Risk:** Vulnerable to brute force attacks
- **Solution:**
  - Minimum 10 characters
  - Require uppercase, lowercase, number, special character
  - Add password strength indicator on frontend
  - Consider adding rate limiting for login attempts
- **Estimated Effort:** 3 hours

### 5. Generic Error Messages Hide Issues

- **Status:** Critical
- **Location:** src/routes/demo/lucia/login/+page.server.ts:81
- **Issue:** Returns "An error has occurred" without logging actual error
- **Risk:** Impossible to debug production registration failures
- **Solution:**
  - Log actual errors server-side with context
  - Return user-friendly messages
  - Add error monitoring (Sentry, Rollbar)
- **Estimated Effort:** 2 hours

---

## P2 - HIGH (Technical Debt & Functionality)

### 6. Incomplete Email Functionality

- **Status:** High
- **Location:** src/lib/email.ts
- **Issues:**
  - Line 8: "TODO: Cleanup this function"
  - Line 37: "TODO: This needs to be actual text" - Plain text email body is empty
  - No OAuth2 despite comment suggesting it (line 16)
  - No error handling or retry logic
  - SMTP password in env (less secure than OAuth2)
- **Risk:**
  - Poor email deliverability
  - Accessibility issues (screen readers need plain text)
  - Failed emails won't be retried
- **Solution:**
  - Add plain text email generation
  - Implement AWS SES with proper error handling
  - Add email queue for failed sends
  - Add email templates
- **Estimated Effort:** 6 hours

### 7. Type Safety Violations

- **Status:** High
- **Files Using any Type:**
  - src/lib/components/MainNav.svelte
  - src/routes/brothers-courses-ministry/+page.svelte
  - src/routes/brothers-guide/+page.svelte
  - src/routes/privacy-policy/+page.svelte
  - src/routes/+layout.svelte
  - src/routes/[ministry]/north-west-youth-camp-2025/registration/+page.svelte
- **Issues:**
  - Type assertions with "as string" in form handling (5 instances)
  - Violates TypeScript strict mode
  - No compile-time type safety
- **Risk:** Runtime type errors
- **Solution:**
  - Replace any with proper types or unknown
  - Add proper type guards for form data
  - Enable no-explicit-any ESLint rule
- **Estimated Effort:** 4 hours

### 8. Outdated Dependencies

- **Status:** High (Security)
- **Critical Updates:**
  - @node-rs/argon2: 1.8.3 to 2.0.2 (MAJOR - password hashing library)
  - @inlang/paraglide-sveltekit: 0.11.5 to 0.16.1 (5 minor versions behind)
  - @aws-sdk/client-s3: 3.864.0 to 3.975.0 (111 patch versions)
  - @playwright/test: 1.54.2 to 1.58.0
- **Risk:** Missing security patches, bug fixes
- **Solution:**
  - Review changelog for @node-rs/argon2 v2 breaking changes
  - Update all dependencies
  - Test thoroughly after updates
  - Add automated dependency updates (Dependabot/Renovate)
- **Estimated Effort:** 4 hours + testing

### 9. Missing Environment Variables Documentation

- **Status:** High
- **Current:** .env.example only shows DATABASE_URL
- **Missing from .env.example:**
  - MEDIA_URL - Used in almost every route
  - ADMIN_URL - Used in order forms
  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
  - MAIL_INFO_USER - Recipient email
  - AWS credentials for S3
- **Risk:** Deployment failures, difficult onboarding
- **Solution:**
  - Create comprehensive .env.example with all variables
  - Add comments explaining each variable
  - Document in README.md
- **Estimated Effort:** 1 hour

---

## P3 - MEDIUM (Code Quality)

### 10. TODO Comments Indicating Incomplete Features

- **Status:** Medium
- **Locations:**
  - src/lib/email.ts:8 - "TODO: Cleanup this function"
  - src/lib/email.ts:37 - "TODO: This needs to be actual text"
  - src/routes/order-form/+page.server.ts:60 - "TODO: persist or notify"
  - src/routes/calendar/+page.server.ts - "TODO: this should link to ministry slug"
  - src/routes/[ministry]/[slug]/+page.server.ts - "HACK: This is a temporary solution"
- **Solution:** Address each TODO one by one
- **Estimated Effort:** 6 hours total

### 11. Form Validation Inconsistencies

- **Status:** Medium
- **Issue:** src/routes/[ministry]/north-west-youth-camp-2025/registration/+page.server.ts:42
  - Sets errors.email when church validation fails (should be errors.church)
- **Risk:** Confusing UX, wrong error messages
- **Solution:**
  - Fix error field mapping
  - Standardize validation across all forms
  - Create reusable validation utilities
- **Estimated Effort:** 3 hours

### 12. Database Query Pattern Inconsistencies

- **Status:** Medium
- **Issues:**
  - Some queries use .limit(1)[0], others use .at(0)
  - unionAll imported from drizzle-orm/mysql-core instead of drizzle-orm/pg-core (line 15 in queries.ts)
  - Raw SQL template literals mixed with Drizzle query builder
- **Risk:** Potential bugs, harder maintenance
- **Solution:**
  - Standardize query patterns
  - Fix incorrect import (should work but semantically wrong)
  - Document preferred patterns in AGENTS.md
- **Estimated Effort:** 3 hours

### 13. Helpers File Anti-Pattern

- **Status:** Medium
- **Location:** src/lib/helpers.ts
- **Issue:** File has comment "Please, never have a helpers file" but exists anyway
- **Current Functions:**
  - formatDate() - 2 usages
  - regionToLabel() - Multiple usages
- **Risk:** File grows into unmaintainable catch-all
- **Solution:**
  - Move formatDate() to $lib/utils/date.ts
  - Move regionToLabel() to $lib/utils/regions.ts or $lib/constants.ts
  - Delete helpers.ts
  - Update all imports
- **Estimated Effort:** 2 hours

---

## Summary Statistics

| Priority                 | Count         | Total Effort    |
| ------------------------ | ------------- | --------------- |
| P0 - Critical (Blocking) | 1             | 4-6 hours       |
| P1 - Critical (Security) | 4             | 19-23 hours     |
| P2 - High                | 4             | 15+ hours       |
| P3 - Medium              | 4             | 14 hours        |
| **Total**                | **13 issues** | **52-58 hours** |

---

## Recommended Order of Attack

### Sprint 1: Unblock Development (P0)

1. **Issue #1**: Implement mock database system - MUST DO FIRST
   - Create mock data files
   - Implement mock DB layer
   - Add USE_MOCK_DB env variable

### Sprint 2: Security & Stability (P1)

2. **Issue #3**: Remove console.log statements
3. **Issue #4**: Strengthen password requirements
4. **Issue #5**: Fix error handling and logging
5. **Issue #2**: Add comprehensive test coverage

### Sprint 3: Technical Debt (P2)

6. **Issue #9**: Document environment variables
7. **Issue #8**: Update dependencies
8. **Issue #6**: Fix email functionality
9. **Issue #7**: Fix type safety violations

### Sprint 4: Code Quality (P3)

10. **Issue #10**: Address TODO comments
11. **Issue #11**: Standardize form validation
12. **Issue #12**: Clean up database patterns
13. **Issue #13**: Refactor helpers.ts

---

## Positive Findings (Good Practices Already in Place)

- Using Argon2 for password hashing
- Using SHA-256 for session tokens
- Proper env usage ($env/dynamic/private instead of process.env)
- SvelteKit 2.x has built-in CSRF protection
- SQL injection protection via Drizzle ORM
- TypeScript strict mode enabled
- No hardcoded secrets
- Consistent code formatting with Prettier

---

## P3 - LOW PRIORITY (Nice to Have)

### Known TODOs & HACKs From Code Review (Feb 3, 2026)

#### 1. Calendar URL Routing Bug

- **Location:** src/routes/calendar/+page.server.ts:57
- **Issue:** Calendar events link to '/general-event' instead of ministry-specific slugs
- **Comment:** "TODO: this should link to the ministry slug, not just 'general-event'"
- **Impact:** Users can't click on calendar events to see details
- **Estimated Effort:** 2 hours

#### 2. Calendar End Date HACK

- **Location:** src/routes/calendar/+page.server.ts:54
- **Issue:** End date is incremented by 1 day for fullcalendar.io exclusive end date behavior
- **Comment:** "HACK: in the fullcalendar.io, the end date is exclusive, so I need to add a day."
- **Impact:** Workaround works but is fragile
- **Estimated Effort:** 1 hour to document or refactor

#### 3. Media URL String Replacement HACK

- **Location:** src/routes/[ministry]/[slug]/+page.server.ts:152
- **Issue:** String replacement for media URLs instead of fixing in DB
- **Comment:** "HACK: This is a temporary solution. In reality the url should be changed in the db, probably?"
- **Impact:** Performance overhead on every page load, unclear responsibility
- **Solution:** Either fix URLs in database or document this as intentional
- **Estimated Effort:** 3 hours (including DB migration)

#### 4. Email Plain Text Body Missing

- **Location:** src/lib/email.ts:37-38
- **Issue:** Plain text email body is empty string
- **Comment:** "TODO: This needs to be actual text"
- **Impact:** Poor email accessibility, some email clients may reject
- **Solution:** Generate plain text version from HTML
- **Estimated Effort:** 2 hours
- **Already Documented:** See P1 Issue #6 above

#### 5. Email Function Needs Cleanup

- **Location:** src/lib/email.ts:8
- **Issue:** Function needs refactoring
- **Comment:** "TODO: Cleanup this function"
- **Impact:** Code quality
- **Estimated Effort:** 2 hours
- **Already Documented:** See P1 Issue #6 above

#### 6. Order Form Persistence Commented Out

- **Location:** src/routes/order-form/+page.server.ts:59
- **Issue:** Commented out code for persisting/notifying
- **Comment:** "TODO: persist or notify (DB, email, Slack, etc.)"
- **Impact:** Form submissions may not be saved or notified
- **Estimated Effort:** 3 hours

---

## Improvements Made (Feb 3, 2026)

### Code Quality Fixes

- ✅ Fixed wrong `error` import from 'console' → '@sveltejs/kit' in registration route
- ✅ Properly typed `db` instance (was `any`)
- ✅ Added `html: string` type parameter to email function
- ✅ Added null check for `personalPhoto` before accessing properties
- ✅ Fixed error field assignment bug (errors.church was assigned to errors.email)
- ✅ Removed 18 debug console.log statements from production code
- ✅ Added return type annotations to 20+ functions in queries.ts, auth.ts, helpers.ts
- ✅ Fixed `where?: unknown` → `where?: SQL` type in queries
- ✅ Removed unused module-level variables in order-form route
- ✅ Deleted commented-out code blocks (8+ locations)
- ✅ Exported MockDb type from mock-db.ts
- ✅ Improved type safety across authentication layer

---

## Notes

- This document should be updated as issues are resolved
- Add new issues as they are discovered
- Link to PRs/commits when issues are fixed
- Track actual time spent vs estimates
