#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
echo "Datasets are JSON based and loaded by each mock backend at startup."
echo "Dataset path: ${ROOT_DIR}/datasets/json"
find "${ROOT_DIR}/datasets/json" -maxdepth 1 -type f -name '*.json' -print
