#!/bin/bash
set -euo pipefail

# runProject.sh — Run a single project. Usage: ./runProject.sh <project-name>
# Valid projects: setup, login, dashboard, admin, smoke, api

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

PROJECT="${1:-}"
if [ -z "$PROJECT" ]; then
  echo "Usage: $0 <project-name>"
  echo "Valid projects: setup, login, dashboard, admin, smoke, api"
  exit 1
fi

VALID_PROJECTS=("setup" "login" "dashboard" "admin" "smoke" "api")
MATCH=0
for p in "${VALID_PROJECTS[@]}"; do
  if [ "$p" = "$PROJECT" ]; then
    MATCH=1
    break
  fi
done
if [ "$MATCH" -eq 0 ]; then
  echo "Invalid project: $PROJECT"
  echo "Valid projects: login, dashboard, admin, smoke, api"
  exit 1
fi

echo "=== Cleaning previous output ==="
rm -rf test-results allure-results playwright-report allure-report

echo "=== Running project: $PROJECT ==="
npx playwright test --project="$PROJECT"
