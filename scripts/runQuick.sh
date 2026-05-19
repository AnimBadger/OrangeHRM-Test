#!/bin/bash
set -euo pipefail

# runQuick.sh — Quick verification: smoke + login tests only, no report generation.
# Use this during development to quickly check if critical paths still work.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "=== Cleaning previous output ==="
rm -rf test-results allure-results playwright-report allure-report

echo "=== Running smoke and login tests only ==="
npx playwright test --project=smoke --project=login --reporter=list

echo "=== Done ==="
