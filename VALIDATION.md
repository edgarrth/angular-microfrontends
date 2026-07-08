# Validation Report

Date: 2026-07-07

## Angular 21 validation

Validated frontend baseline:

```text
Angular CLI       : 21.2.18
Angular           : 21.2.17
Node.js           : 22.16.0
Package Manager   : npm 10.9.2
TypeScript        : 5.9.3
Native Federation : @angular-architects/native-federation 21.2.5
```

## Validated successfully

| Check | Result |
|---|---|
| Angular shared library build | OK |
| Accounts MFE production build | OK |
| Payments MFE production build | OK |
| Notifications MFE production build | OK |
| Shell production build | OK |
| Authentication API TypeScript build | OK |
| Accounts API TypeScript build | OK |
| Payments API TypeScript build | OK |
| Notifications API TypeScript build | OK |
| Backend unit tests | OK |
| Backend health endpoints | OK |
| Account summary endpoint | OK |
| Payment history endpoint | OK |
| Notifications endpoint | OK |
| Payment initiate + confirm flow | OK |
| Static frontend artifacts exist | OK |
| RemoteEntry files exist and are reachable through local static servers | OK |
| Docker Compose YAML syntax | OK |
| Frontend unit test bundle compilation | OK |

## Commands executed

```bash
npm run build:apis
npm run build:shared
npm run build:accounts-mfe
npm run build:payments-mfe
npm run build:notifications-mfe
npm run build:shell
npm run test:apis
npm test -- --watch=false --browsers=ChromeHeadless
```

Runtime backend validation executed against:

```text
http://localhost:3000/health
http://localhost:3001/health
http://localhost:3002/health
http://localhost:3003/health
http://localhost:3001/accounts/summary
http://localhost:3002/payments/history?limit=1
http://localhost:3003/notifications?limit=1
POST http://localhost:3002/payments/initiate
POST http://localhost:3002/payments/{id}/confirm
```

Frontend artifact validation executed against local static servers:

```text
http://127.0.0.1:4200/index.html
http://127.0.0.1:4200/federation.manifest.json
http://127.0.0.1:4201/remoteEntry.json
http://127.0.0.1:4202/remoteEntry.json
http://127.0.0.1:4203/remoteEntry.json
```

## Not fully validated in this environment

Docker Compose could not be executed because the current generation environment does not include the Docker CLI/daemon. The file `infrastructure/docker-compose.yml` was syntax-validated with YAML parsing and is ready to run in a local machine with Docker installed.

Frontend Karma tests compiled but could not execute because Chrome/Chromium is not installed in this environment. The script is available as `npm test` and requires `ChromeHeadless` or `CHROME_BIN` configured.
