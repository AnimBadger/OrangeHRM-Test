#!/bin/bash
set -euo pipefail

# runReport.sh — Generate and open reports from existing test results.
# Use this after a test run to view Allure or HTML reports without re-running tests.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -d "allure-results" ]; then
  echo "No Allure results found at allure-results/. Run tests first."
  exit 1
fi

echo "=== Generating Allure report ==="
allure generate allure-results --clean --output allure-report

echo "=== Opening Allure report ==="
allure open allure-report --port 0
