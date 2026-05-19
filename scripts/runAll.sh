#!/bin/bash
set -euo pipefail

# runAll.sh — Full test suite: run all projects sequentially, then generate both Allure and HTML reports

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "=== Cleaning previous output ==="
rm -rf test-results allure-results playwright-report allure-report

echo "=== Running full test suite ==="
npx playwright test --reporter=allure-playwright,html,list

echo "=== Generating Allure report ==="
allure generate allure-results --clean --output allure-report

echo "=== Opening Allure report ==="
allure open allure-report --port 0
