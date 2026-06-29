#!/bin/bash
set -euo pipefail

# runNewman.sh — Run Postman API tests via Newman
# Usage: ./runNewman.sh [--report]
#   --report  Generate HTML report in test-results/

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

COLLECTION="postman/collection.json"
ENV_FILE="postman/env.json"

if [ ! -f "$COLLECTION" ]; then
  echo "Error: Collection not found at $COLLECTION"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: Environment file not found at $ENV_FILE"
  exit 1
fi

echo "=== Running Newman: OrangeHRM API Collection ==="

if [ "${1:-}" = "--report" ]; then
  mkdir -p test-results
  npx newman run "$COLLECTION" \
    -e "$ENV_FILE" \
    -r cli,htmlextra \
    --reporter-htmlextra-export test-results/newman-report.html
  echo "=== HTML report: test-results/newman-report.html ==="
else
  npx newman run "$COLLECTION" -e "$ENV_FILE"
fi

echo "=== Newman run complete ==="
