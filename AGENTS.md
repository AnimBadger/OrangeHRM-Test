# AGENTS.md — OrangeHRM Test Automation Standards

## Project Structure
```
src/
  config/       Typed access to env vars via Environment class
  pages/        Page Object Model — one class per page, extends BasePage
  components/   Reusable UI component classes (not full pages)
  data/         Constants, mock data, and test users (buzzMocks, adminUsersMocks, users)
  fixtures/     Playwright custom fixtures for DI
  utils/        Logger (winston), API helper, data generator (faker)
  types/        Shared TypeScript interfaces
tests/
  smoke/        @smoke-tagged critical path tests
  ui/           @ui-tagged functional UI tests
    login/        Login and forgot-password tests
    dashboard/    Dashboard, sidebar, and search tests
    admin/        Admin module tests
      userManagement/   System Users — table, search, add, edit
      job/              Job Titles, Pay Grades, Employment Status, Job Categories, Work Shifts
      organizations/    Organization structure and locations
      nationalities/    Nationalities management
      corporateBranding/ Corporate branding settings
      configuration/    Configuration options (email, social media auth, etc.)
  api/          API helper and mock tests (data shape validation only — not run via Playwright, kept for reference)
```

### Structure Enforcement
- Before creating ANY new file, verify the directory it belongs to already exists
- If the directory does not exist, create it first using `mkdir -p`
- Never write files to non-existent directories — this wastes context and breaks imports
- Check the project tree above to find the correct subdirectory for new files

## Naming Conventions
- **Files**: PascalCase for page/component classes (`LoginPage.ts`), camelCase for utils (`dataGenerator.ts`), kebab-case for config/type files
- **Classes**: PascalCase — `DashboardPage`, `ApiHelper`, `DataGenerator`
- **Locators**: camelCase prefixed by type — `usernameInput`, `loginButton`, `errorMessage`, `searchUserRoleDropdown`
- **Methods**: camelCase, verb-first — `clickSearch()`, `getCellText()`, `isAdminPageLoaded()`, `loadSystemUsers()`
- **Test files**: `{module}.ui.test.ts` under `tests/ui/{category}/`, `{module}.api.test.ts`, `{module}.smoke.test.ts`
- **Test descriptions**: lowercase with no trailing punctuation — `'page loads with correct header and breadcrumb'`

## Imports (order and aliases)
```typescript
// 1. Playwright primitives
import { Page, Locator } from '@playwright/test';
import { test, expect } from '@fixtures/customFixtures';

// 2. Project modules via path aliases
//    @pages/*  @config/*  @data/*  @fixtures/*  @utils/*  @typedefs/*  @components/*
import { BasePage } from './BasePage';  // relative for siblings
import { ROUTES, TIMEOUTS } from '@data/constants';
import { validCredentials } from '@data/users';
import type { Employee, UserCredentials } from '@typedefs/index';
import logger from '@utils/logger';
```

## Page Object Model Rules
- Every page class extends `BasePage` and implements `get url(): string`
- Locators are `readonly` properties initialized in the constructor
- Methods return `Promise<void>` for actions, `Promise<T>` for queries
- Use `this.click()`, `this.fill()`, `this.getText()`, `this.isVisible()` from BasePage (wraps waitForElement)
- Call `await this.waitForLoaderToDisappear()` after navigation/submit actions
- Use `logger.info()` for significant actions (login, navigation, search)
- Keep page objects focused on a single page — do not mix concerns

## Fixture Patterns (`src/fixtures/customFixtures.ts`)
- Add new page objects to the `Pages` type and register with `test.extend`
- Use `authenticatedPage` fixture when tests need a logged-in session
- All fixtures use the same `page` instance — share state via fixtures, not globals

## Project Configuration
- Before writing any test file, check `playwright.config.ts` to confirm a project with a matching `testMatch` pattern exists
- Projects now use subdirectory-based `testMatch` patterns (e.g. `ui/admin/**`). New test files must be placed in the corresponding `tests/ui/{project-name}/` subdirectory
- If the test file's directory/module doesn't match any existing project, add a new project at the appropriate position in the sequence before writing tests
- New projects must follow the `dependencies` chain to maintain linear execution order
- Update `testMatch` patterns and create the corresponding `tests/ui/{name}/` subdirectory when adding a new project

## Test Patterns
- Tag tests: `@ui`, `@smoke`, `@api`, `@regression` in `test.describe`
- Test structure: arrange (navigate/setup), act (interact), assert (expect)
- Keep tests independent — each test starts with a fresh browser context
- Use `validCredentials` from `@data/users` — never hardcode credentials
- Verify page state with boolean queries (`isVisible`) and text assertions (`getText`)
- Prefer `expect(value).toBe(expected)` over complex chained assertions
- Always cover edge cases in every module: empty state, invalid input, boundary values, non-existent data, cancel/abort flow, and duplicate submission
- Use data-driven approach (parameterized test cases via arrays) whenever a test creates data — this means running the same test pattern with multiple input variants (valid, invalid, boundary) rather than writing separate nearly-identical test blocks
- Every test module covering forms or user input must include basic security tests on input fields:
  - **XSS** — submit `<script>alert(1)</script>`, `<img onerror=alert(1) src=x>`, `">` — confirm the payload is escaped/encoded in the response, not executed
  - **SQL Injection** — submit `' OR 1=1 --`, `'; DROP TABLE users; --`, `admin'--` — confirm the server rejects or safely handles them without error or data leak
  - **HTML Injection** — submit `<h1>test</h1>`, `<a href="http://evil.com">click</a>` — confirm tags are stripped or escaped in the UI
  - **Length overflow** — submit input exceeding max field length (e.g., 1000+ characters for a 50-char name field) — confirm truncation or validation error
  - **Special characters** — submit `!@#$%^&*()_+{}|:"<>?~`, null bytes, unicode homoglyphs — confirm no crashes or encoding issues
  - Security tests belong in the same module as the feature tests (e.g., `admin.addUser.ui.test.ts` covers user creation security alongside functional scenarios)

## Comments Policy
- No comments in test files — test names and assertions should be self-documenting
- No comments in page objects — method names and locator names should be expressive
- logger.info() calls serve as runtime documentation for test execution flow

## Logging
- Use `logger.info()` for significant actions (navigate, login, search, submit)
- Logger is in `src/utils/logger.ts` using winston — console + rotating file
- Pass descriptive messages: `logger.info(\`Searching admin users by username: ${username}\`)`

## Data Management
- Static test data (users, expected values) in `src/data/`
- Randomized data via `DataGenerator` using faker
- Route URLs, timeouts, labels, breadcrumbs in `src/data/constants.ts`
- UI labels and messages in constants — never hardcode strings in tests
- Types/interfaces in `src/types/` — import with `@typedefs/` alias

## TypeScript
- Use explicit types for method signatures — avoid `any`
- `interface` for data shapes, `type` for unions/primitives
- Use `import type` for type-only imports
- Locators typed as `Locator`, Page as `Page`

## Git Workflow
- No commits unless explicitly asked
- When writing tests or features that are broad in scope or differ from the current branch context, create a new branch before starting
- Branch naming convention: `{type}_{description}` with underscores — e.g. `test_admin_qualifications`, `fix_ci_caching`, `feat_pim_import`, `chore_deps_update`
  - `test_` — adding or updating test files
  - `fix_` — bug fixes
  - `feat_` — new features (not tests)
  - `refactor_` — code restructuring
  - `chore_` — config, deps, tooling
- One type per branch — never mix test, fix, feat, or chore commits on the same branch. If a branch touches both tests and CI config, split into `test_` and `fix_`/`chore_` branches
- Commit messages: concise, focus on why not what
- Never commit secrets, `.env`, credentials, or test-results
- AGENTS.md is gitignored — it is an internal AI instruction file, not project documentation

## Test Execution — Two Runners, One Suite
The project uses two separate runners with clear boundaries:

**Playwright** — handles UI and smoke tests only:
- Playwright projects in `playwright.config.ts` run sequentially: `setup` → `login` → `dashboard` → `admin` → `smoke`
- Each project uses `dependencies` on the previous to enforce linear execution
- Within a project, test files run in parallel across workers
- No API tests in Playwright — those are handled by Newman

**Newman** — handles all API endpoint tests (real and contract):
- Collection: `postman/collection.json` — 27 requests across Auth, Admin Users, Job Titles
- Environment: `postman/env.json` — base_url, admin_username, admin_password
- Runs independently of Playwright, no browser needed
- Full suite completes in ~12s

**Full suite**: `npm run test:all` runs Playwright first, then Newman. See `scripts/runAll.sh`.

When adding new Playwright test files, assign them to the appropriate project in `playwright.config.ts` using `testMatch`. New Playwright projects should follow the `dependencies` chain. Update `scripts/runProject.sh` with the new project name in the `VALID_PROJECTS` array.

When adding new API test scenarios, add them to the Postman collection (`postman/collection.json`) — never to Playwright.

## Performance & Timeouts
- Standard response time for all actions: `TIMEOUTS.ACTION_TIMEOUT` (10s)
- Performance-sensitive methods (autocomplete, search, saves) must fail immediately on timeout
- Never catch and suppress timeout errors — let tests fail fast with clear Playwright timeout messages
- Do not implement retry loops or extended waits for flaky behavior; fail the test and move on
- Tests that depend on the shared demo site's autocomplete/employee name lookup use fail-fast behavior — if the site is slow, the test fails at the slow action rather than hanging or retrying

## Run Optimizations
- **Storage state**: `tests/auth/global.setup.ts` logs in once per worker. The `setup` Playwright project saves `.auth/user.json` for reuse by all non-login projects, eliminating redundant login before each test.
- **Login tests only**: `beforeEach` for login UI is used only in `tests/ui/login/*.test.ts` and `tests/smoke/social.smoke.test.ts`. All other test files must NOT include a login `beforeEach` — they inherit the authenticated session from the `setup` project via `storageState`.
- **Parallelism**: `fullyParallel: true` with `workers: 2` locally, `workers: 4` on CI. Each project runs in parallel within itself while respecting project dependency ordering.
- **CI-conditional output**: In CI (`CI=true`), only the dot reporter is used (minimal output). Locally, `list`, `html`, and `allure-playwright` reporters are active. Traces, screenshots, and video are `on-first-retry` only in CI.
- **Project dependency chain**: `setup` → `login` → `dashboard` → `admin` → `smoke`. Each project's tests can run in parallel with each other, but project-to-project execution is sequential.

## Linting & Formatting
- Run `npx tsc --noEmit` before pushing — must compile cleanly
- Code must pass `npm run lint` and `npm run format:check`
- Tests must pass before committing

## Critical Context
- OrangeHRM Jobs sub-pages (Job Titles, Pay Grades, Employment Status, Job Categories, Work Shifts) use the same `.oxd-form` and `.oxd-table-card` component patterns as Admin users
- Job Titles table columns: 0=checkbox (empty text), 1=Job Title, 2=Job Description, 3=Actions
- Job Titles form fields: Job Title (`input.oxd-input`), Job Description (`textarea`), Job Specification (`input[type="file"]`), Note (`textarea`)
- Simple sub-pages (Pay Grades, Employment Status, Job Categories) have NO checkbox column. Table structure: 0=Name, 1=Actions
- Work Shifts table likely has: 0=Shift Name, 1=Hours (optional), 2=Actions
- Pay Grades edit form has a different structure (name input + currency section) — avoid pre-population assertion, just check header
- Simple sub-page add forms have a single name input: `this.form.locator('input.oxd-input').first()`
- Form headers: `h6:has-text("Add Pay Grade")`, `h6:has-text("Edit Employment Status")`, etc.
- After `adminPage.navigate()`, always call `await expect(adminPage.adminHeader).toBeVisible()` before clicking menu items to ensure the admin SPA is fully loaded
- Server-side "Already exists" error for duplicates renders as generic element (not `.oxd-input-field-error-message`) — `page.getByText()` finds it
- `bi-trash` and `bi-pencil-fill` buttons exist on all admin sub-page rows but delete does not trigger a dialog
- Breadcrumb module text stays as "Admin" for all admin sub-pages — use URL or content heading (h6) for page identity
- 300ms wait in `clickJobSubMenuItem` and `clickOrgSubMenuItem` prevents flaky navigation failures in sequential test runs
- Organization sub-pages: General Information (single form), Locations (CRUD table), Structure (tree view)
- Locations table columns: 0=checkbox (empty text), 1=Name, 2=City, 3=Country, 4=Phone, 5=Actions
- Locations add form has name input + country dropdown — validation on empty submit shows on name field
- General Information is a read-only/edit form showing organization name — no table or add/delete actions
- Structure is a tree view with add buttons for hierarchical units — not a flat table

### Sub-page Form Headers
| Page | Add Header | Edit Header | Route |
|------|-----------|-------------|-------|
| Job Titles | `Add Job Title` | `Edit Job Title` | `/admin/viewJobTitleList` |
| Pay Grades | `Add Pay Grade` | `Edit Pay Grade` | `/admin/viewPayGrades` |
| Employment Status | `Add Employment Status` | `Edit Employment Status` | `/admin/employmentStatus` |
| Job Categories | `Add Job Category` | `Edit Job Category` | `/admin/jobCategory` |
| Work Shifts | `Add Work Shift` | `Edit Work Shift` | `/admin/workShift` |
| Locations | `Add Location` | `Edit Location` | `/admin/locations` |

### New Page Objects
- `PayGradesPage` (`src/pages/PayGradesPage.ts`) — single name input, table actions
- `EmploymentStatusPage` (`src/pages/EmploymentStatusPage.ts`) — same pattern as PayGrades
- `JobCategoriesPage` (`src/pages/JobCategoriesPage.ts`) — same pattern as PayGrades
- `WorkShiftsPage` (`src/pages/WorkShiftsPage.ts`) — single name input + table actions
- `OrganizationPage` (`src/pages/OrganizationPage.ts`) — Organization sub-menu navigation (like JobsPage)
- `LocationsPage` (`src/pages/LocationsPage.ts`) — CRUD table with name, address, country fields
- `GeneralInfoPage` (`src/pages/GeneralInfoPage.ts`) — single form for organization name/registration info
- `StructurePage` (`src/pages/StructurePage.ts`) — tree-based organizational structure view
- All registered in `src/fixtures/customFixtures.ts` fixture list
- Test files: `tests/ui/admin/job/admin.jobs.payGrades.ui.test.ts`, `admin/job/admin.jobs.employmentStatus.ui.test.ts`, `admin/job/admin.jobs.jobCategories.ui.test.ts`, `admin/job/admin.jobs.workShifts.ui.test.ts`
- Organization test files: `tests/ui/admin/organizations/admin.organization.locations.ui.test.ts`, `admin/organizations/admin.organization.generalInfo.ui.test.ts`, `admin/organizations/admin.organization.structure.ui.test.ts`
- User management test files: `tests/ui/admin/userManagement/admin.ui.test.ts`, `admin/userManagement/admin.addUser.ui.test.ts`
- Admin users API test: `tests/api/admin.users.api.test.ts` — real endpoint tests tracking responses per scenario
- Admin users API mock test: `tests/api/admin.users.mock.test.ts` — contract tests using `page.route()` with mock data
- Mock API response data: `src/data/adminUsersMocks.ts` — sample responses for all creation scenarios (success, duplicate, validation errors)
- ApiHelper methods: `getUsers()`, `createUser()`, `deleteUsers()`, `validateUsername()` in `src/utils/apiHelper.ts`
- Job Titles API helper methods: `getJobTitles()`, `getJobTitle()`, `createJobTitle()`, `updateJobTitle()`, `deleteJobTitles()` in `src/utils/apiHelper.ts`
- `authenticatedApiHelper` fixture pre-logs in via API in `src/fixtures/customFixtures.ts`
- Admin Job Titles API tests: `tests/api/admin/admin.jobTitles.api.test.ts` — real endpoint tests with data-driven create cases
- Admin Job Titles API mock tests: `tests/api/admin/admin.jobTitles.mock.test.ts` — contract tests validating mock data shape
- Mock API response data: `src/data/adminJobTitleMocks.ts` — sample responses for all job title scenarios (list, create success, duplicate, validation error, update, not found)
- Job Titles API endpoint: `POST/GET/PUT/DELETE /api/v2/admin/job-titles` — create requires `title`, accepts optional `description` and `note`; update additionally accepts `currentJobSpecification` enum; delete sends `{ ids: number[] }`

### Newman / Postman API Tests
- **Collection**: `postman/collection.json` — 27 requests across Auth, Admin Users, and Job Titles folders
- **Environment**: `postman/env.json` — base_url, admin_username, admin_password
- **Auth flow**: Two sequential requests — `GET Login Page` extracts CSRF token, `POST Login` authenticates. Cookies flow naturally between requests via Postman's cookie jar.
- **Dynamic data**: Pre-request scripts auto-generate unique usernames/passwords (timestamp-based). Success responses store created IDs as collection variables for subsequent update/delete requests.
- **Run via npm**: `npm run newman` (CLI only) or `npm run newman:report` (CLI + HTML report at `test-results/newman-report.html`)
- **Run via script**: `./scripts/runNewman.sh` or `./scripts/runProject.sh newman`
- **Variables used**: `csrf_token`, `emp_number`, `new_username`, `new_password`, `update_password`, `user_id`, `job_title_id`, `created_job_title_id`

### Syncing Newman with Playwright API Coverage
All API endpoint tests belong in the Postman collection, not in Playwright. Keep them in sync:

| Activity | Action |
|----------|--------|
| Adding a new API endpoint | 1. Add to both `src/utils/apiHelper.ts` (for Playwright fixtures/login) AND `postman/collection.json` (for Newman testing) |
| Adding a new API test scenario | Add to `postman/collection.json` only |
| Updating expected status code | Update both `postman/collection.json` (Newman assertion) AND any Playwright `.api.test.ts` file (if the mock data shapes change, update `src/data/*Mocks.ts`) |
| Adding a new mock data shape | Add to `src/data/*Mocks.ts` — these are pure TypeScript contract validators, not endpoint tests |
| Collection grows beyond 30 requests | Split into multiple Newman runs by folder using `--folder` flag |

When scenarios exist in both runners (e.g., the Login API helper is used by Playwright for session setup while Newman tests the actual endpoint responses), verify assertions match the same server behavior. Mismatches found to date:

| Scenario | Playwright Expected | Newman Observed | Resolution |
|----------|-------------------|-----------------|------------|
| Invalid login | 302 (Playwright's `maxRedirects: 0`) | 200 (redirect followed) | Both correct — same behavior observed at different points |
| Empty job title | 400 | 422 | Newman matches actual server — Playwright test was fixed |
