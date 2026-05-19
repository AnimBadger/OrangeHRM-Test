#!/bin/bash

# clean.sh — Remove all test output directories (results, reports, screenshots, videos)

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Cleaning test output ==="
rm -rf "$ROOT_DIR/test-results"
rm -rf "$ROOT_DIR/allure-results"
rm -rf "$ROOT_DIR/allure-report"
rm -rf "$ROOT_DIR/playwright-report"
rm -rf "$ROOT_DIR/screenshots"

echo "Done"
