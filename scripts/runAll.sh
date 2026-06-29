#!/bin/bash
set -euo pipefail

# runAll.sh — Full test suite: Playwright UI + Newman API, then generate reports
# Playwright handles UI and smoke tests. Newman handles all API endpoint tests.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "=== Cleaning previous output ==="
rm -rf test-results allure-results playwright-report allure-report

echo "=== Phase 1: Playwright UI & Smoke Tests ==="
npx playwright test

echo ""
echo "=== Phase 2: Newman API Tests ==="
npx newman run "$ROOT_DIR/postman/collection.json" -e "$ROOT_DIR/postman/env.json" \
  -r cli,htmlextra \
  --reporter-htmlextra-export test-results/newman-report.html

echo ""
echo "=== Phase 3: Generating Allure report (if available) ==="
if command -v allure &> /dev/null; then
  allure generate allure-results --clean --output allure-report
  echo "Allure report: allure-report/index.html"
fi

echo ""
echo "=== Full test suite complete ==="
echo "Playwright report: playwright-report/index.html"
echo "Newman report:     test-results/newman-report.html"
