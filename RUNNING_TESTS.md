# Running Tests

## Prerequisites

```bash
npm install
```

## npm Scripts

```bash
# Full suite (all projects sequentially)
npm test

# By tag
npm run test:smoke       # @smoke-tagged tests only
npm run test:regression  # @regression-tagged tests only
npm run test:api         # @api-tagged tests only

# By browser
npm run test:chrome
npm run test:firefox
npm run test:webkit

# By mode
npm run test:headed      # visible browser
npm run test:debug       # Playwright debugger (Pause on each test)
npm run test:ui          # Playwright UI mode (interactive test runner)
```

## Shell Scripts (`scripts/`)

```bash
# Full suite with Allure + HTML reports
./scripts/runAll.sh

# Single project (login | dashboard | admin | smoke | api)
./scripts/runProject.sh admin

# Quick smoke + login check (no reports)
./scripts/runQuick.sh

# Clean up output directories
./scripts/clean.sh
```

## Playwright CLI Direct

```bash
# Single project
npx playwright test --project=admin

# Multiple projects
npx playwright test --project=login --project=dashboard

# Specific file
npx playwright test tests/api/admin/admin.users.api.test.ts

# Specific test (by title pattern, case-insensitive)
npx playwright test -g "creates an Admin user"

# With grep tag
npx playwright test --grep @smoke

# Exclude tag
npx playwright test --grep-invert @api

# With environment override
BASE_URL=https://your-instance.orangehrm.com npx playwright test

# With custom reporter (no reports generated, just console)
npx playwright test --reporter=list

# Retries
npx playwright test --retries=2

# Update snapshots
npx playwright test --update-snapshots
```

## Reports

```bash
# Playwright HTML report
npm run report

# Allure report (requires Allure CLI)
npm run report:allure
```

## Configuration

Environment variables in `env/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://opensource-demo.orangehrmlive.com` | Target OrangeHRM instance |
| `TIMEOUT` | `30000` | Global test timeout (ms) |
| `RETRIES` | `1` | Number of retries |
| `HEADLESS` | `true` | Headless mode |
| `ADMIN_USERNAME` | `Admin` | Admin login username |
| `ADMIN_PASSWORD` | `admin123` | Admin login password |

## CI

Tests run with `CI=true` which enables retries and disables `test.only`. In CI, workers=1 and fullyParallel=false ensure sequential execution per the project dependency chain.
