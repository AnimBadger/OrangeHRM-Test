# OrangeHRM Test Automation

Playwright-based QA automation framework for [OrangeHRM](https://opensource-demo.orangehrmlive.com), built with industry best practices for scalable and maintainable test suites.

## Tech Stack

| Tool | Purpose |
|------|---------|
| Playwright | Browser automation (Chromium, Firefox, WebKit) |
| TypeScript | Type-safe test code |
| Page Object Model | Encapsulated page interactions |
| Custom Fixtures | Dependency injection via Playwright's fixture system |
| Winston | Structured logging (console + rotating files) |
| Faker | Randomized test data generation |
| Allure | Rich test reporting |
| ESLint + Prettier | Code quality and formatting |
| Husky + lint-staged | Pre-commit hooks |
| GitHub Actions | CI with multi-browser matrix |

## Project Structure

```
src/
├── config/          # Environment variables typed access layer
├── pages/           # Page Object Model classes
├── components/      # Reusable UI components
├── data/            # Test data and constants
├── fixtures/        # Custom Playwright fixtures
├── utils/           # Helpers (logger, API client, data generator)
└── types/           # Shared TypeScript interfaces

tests/
├── smoke/           # Critical path tests (@smoke)
├── regression/      # Full coverage tests (@regression)
└── api/             # API-level tests (@api)

env/                 # Environment configuration (gitignored)
```

## Getting Started

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Copy environment config and adjust as needed
cp env/.env.example env/.env
```

## Running Tests

```bash
# Run all tests
npm test

# Run by tag
npm run test:smoke       # @smoke tagged tests only
npm run test:regression  # @regression tagged tests only
npm run test:api         # @api tagged tests only

# Run by browser
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Run with browser visible
npm run test:headed

# Playwright UI mode
npm run test:ui
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Full Playwright test run |
| `npm run test:smoke` | Smoke tests only |
| `npm run test:regression` | Regression tests only |
| `npm run test:api` | API tests only |
| `npm run test:headed` | Run with browser UI |
| `npm run test:debug` | Run with Playwright debugger |
| `npm run test:ui` | Playwright UI mode |
| `npm run test:chrome` | Chromium only |
| `npm run report` | Open HTML report |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier auto-format |
| `npm run codegen` | Playwright test generator |

## Test Design Patterns

- **Page Object Model** — Each page (`LoginPage`, `DashboardPage`, `PimPage`) extends a shared `BasePage` with common actions (click, fill, wait, visibility checks).
- **Custom Fixtures** — `customFixtures.ts` injects page objects, API helpers, and pre-authenticated sessions into tests via Playwright's fixture system, eliminating repetitive setup.
- **Data Separation** — Test data lives in `src/data/` (constants, users). Randomized data uses Faker via `DataGenerator`. No hardcoded values in tests.
- **Tagged Tests** — `@smoke`, `@regression`, `@api` tags allow targeted test execution and CI pipeline segmentation.
- **API + UI Coverage** — `ApiHelper` wraps REST calls with token-based auth, enabling hybrid API/UI test flows.

## CI/CD

GitHub Actions workflow (`.github/workflows/playwright.yml`):
- Runs on push/PR to main/master
- Matrix strategy across Chromium, Firefox, WebKit
- Scheduled daily runs at 6 AM weekdays
- Test report artifacts retained for 7 days
