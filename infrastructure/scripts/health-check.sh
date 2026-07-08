#!/usr/bin/env bash
set -euo pipefail
for url in \
  http://localhost:3000/health \
  http://localhost:3001/health \
  http://localhost:3002/health \
  http://localhost:3003/health \
  http://localhost:4200 \
  http://localhost:4201/remoteEntry.json \
  http://localhost:4202/remoteEntry.json \
  http://localhost:4203/remoteEntry.json; do
  echo "Checking ${url}"
  curl -fsS "${url}" >/dev/null
  echo "OK"
done
