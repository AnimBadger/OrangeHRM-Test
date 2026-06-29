#!/bin/bash
set -euo pipefail

# runProject.sh — Run a single project. Usage: ./runProject.sh <project-name>
# Valid projects: setup, login, dashboard, admin, smoke, newman

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

PROJECT="${1:-}"
if [ -z "$PROJECT" ]; then
  echo "Usage: $0 <project-name>"
  echo "Valid projects: setup, login, dashboard, admin, smoke, newman"
  exit 1
fi

VALID_PROJECTS=("setup" "login" "dashboard" "admin" "smoke" "newman")
MATCH=0
for p in "${VALID_PROJECTS[@]}"; do
  if [ "$p" = "$PROJECT" ]; then
    MATCH=1
    break
  fi
done
if [ "$MATCH" -eq 0 ]; then
  echo "Invalid project: $PROJECT"
  echo "Valid projects: setup, login, dashboard, admin, smoke, newman"
  exit 1
fi

echo "=== Cleaning previous output ==="
rm -rf test-results allure-results playwright-report allure-report

if [ "$PROJECT" = "newman" ]; then
  echo "=== Running Newman: OrangeHRM API Collection ==="
  npx newman run "$ROOT_DIR/postman/collection.json" -e "$ROOT_DIR/postman/env.json"
  exit 0
fi

echo "=== Running project: $PROJECT ==="
npx playwright test --project="$PROJECT"
